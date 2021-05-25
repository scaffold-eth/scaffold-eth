import { ethers, waffle } from 'hardhat';
import { BigNumber, utils } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import {
  ShortOTokenActionWithSwap,
  MockERC20,
  MockWhitelist,
  MockSwap,
  MockController,
  MockPool,
  MockOToken,
} from '../typechain';
import * as fs from 'fs';

const { createOrder, signTypedDataOrder } = require('@airswap/utils');

const mnemonic = fs.existsSync('.secret')
  ? fs.readFileSync('.secret').toString().trim()
  : 'test test test test test test test test test test test junk';

enum ActionState {
  Idle,
  Committed,
  Activated,
}

describe('ShortActionWithSwap Tests', function () {
  const provider = waffle.provider;

  const counterpartyWallet = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/30");

  let action: ShortOTokenActionWithSwap;
  // asset used by this action: in this case, weth
  let token: MockERC20;
  //
  let usdc: MockERC20;

  let swap: MockSwap;
  let whitelist: MockWhitelist;
  let controller: MockController;

  let accounts: SignerWithAddress[] = [];

  let owner: SignerWithAddress;
  let vault: SignerWithAddress;

  let otoken1: MockOToken;
  let otoken2: MockOToken;

  const otoken1StrikePrice = 4000 * 1e8;
  const otoken2StrikePrice = 5000 * 1e8;

  // 7 days from now
  const otoken1Expiry = BigNumber.from(parseInt((Date.now() / 1000).toString()) + 86400 * 7);
  // 14 days from now
  const otoken2Expiry = BigNumber.from(parseInt((Date.now() / 1000).toString()) + 86400 * 14);

  // pretend to be gamma margin pool
  let pool: MockPool;

  this.beforeAll('Set accounts', async () => {
    accounts = await ethers.getSigners();
    const [_owner, _vault] = accounts;

    owner = _owner;
    vault = _vault;
  });

  this.beforeAll('Deploy Mock contracts', async () => {
    const ERC20 = await ethers.getContractFactory('MockERC20');
    token = (await ERC20.deploy()) as MockERC20;
    await token.init('WETH', 'WETH', 18);

    usdc = (await ERC20.deploy()) as MockERC20;
    await usdc.init('USDC', 'USDC', 6);

    const mintAmount = utils.parseUnits('100', 'ether');
    await token.mint(vault.address, mintAmount);

    // deploy mock swap and mock whitelist
    const Whitelist = await ethers.getContractFactory('MockWhitelist');
    whitelist = (await Whitelist.deploy()) as MockWhitelist;

    const Swap = await ethers.getContractFactory('MockSwap');
    swap = (await Swap.deploy()) as MockSwap;

    const MockPool = await ethers.getContractFactory('MockPool');
    pool = (await MockPool.deploy()) as MockPool;

    const Controller = await ethers.getContractFactory('MockController');
    controller = (await Controller.deploy()) as MockController;
    await controller.setPool(pool.address);
  });

  describe('deployment test', () => {
    it('deploy', async () => {
      const ShortActionContract = await ethers.getContractFactory('ShortOTokenActionWithSwap');
      action = (await ShortActionContract.deploy(
        vault.address,
        token.address,
        swap.address,
        whitelist.address,
        controller.address,
        0 // type 0 vault
      )) as ShortOTokenActionWithSwap;

      expect((await action.owner()) == owner.address).to.be.true;

      expect((await action.asset()) === token.address).to.be.true;

      expect(await controller.vaultOpened()).to.be.true;

      expect((await token.allowance(action.address, pool.address)).eq(ethers.constants.MaxUint256))
        .to.be.true;
      expect((await token.allowance(action.address, vault.address)).eq(ethers.constants.MaxUint256))
        .to.be.true;

      // init state should be idle
      expect((await action.state()) === ActionState.Idle).to.be.true;

      // whitelist is set
      expect((await action.opynWhitelist()) === whitelist.address).to.be.true;
    });
    it('should revert when deploying with empty swap contract', async () => {
      const ShortActionContract = await ethers.getContractFactory('ShortOTokenActionWithSwap');
      await expect(
        ShortActionContract.deploy(
          vault.address,
          token.address,
          ethers.constants.AddressZero,
          whitelist.address,
          controller.address,
          0 // type 0 vault
        )
      ).to.be.revertedWith('Invalid airswap address');
    });
    it('should deploy with type 1 vault', async () => {
      const ShortActionContract = await ethers.getContractFactory('ShortOTokenActionWithSwap');
      await ShortActionContract.deploy(
        vault.address,
        token.address,
        swap.address,
        whitelist.address,
        controller.address,
        1 // type 0 vault
      );
      expect((await action.owner()) == owner.address).to.be.true;
      expect((await action.asset()) === token.address).to.be.true;
      expect(await controller.vaultOpened()).to.be.true;
    });
  });

  describe('idle phase', () => {
    before('Mint some eth to action', async () => {
      // mint 10 weth
      const mintAmount = utils.parseUnits('10');
      await token.mint(action.address, mintAmount);
    });
    before('Deploy mock otokens', async () => {
      const MockOToken = await ethers.getContractFactory('MockOToken');
      otoken1 = (await MockOToken.deploy()) as MockOToken;
      await otoken1.init('oWETHUSDC', 'oWETHUSDC', 18);
      await otoken1.initMockOTokenDetail(
        token.address,
        usdc.address,
        token.address,
        otoken1StrikePrice,
        otoken1Expiry,
        false
      );

      otoken2 = (await MockOToken.deploy()) as MockOToken;
      await otoken2.init('oWETHUSDC', 'oWETHUSDC', 18);
      await otoken2.initMockOTokenDetail(
        token.address,
        usdc.address,
        token.address,
        otoken2StrikePrice,
        otoken2Expiry,
        false
      );
    });
    it('should revert if calling mint in idle phase', async () => {
      const collateral = utils.parseUnits('10');
      const amountOTokenToMint = 10 * 1e8;
      await expect(
        action.connect(owner).mintOToken(collateral, amountOTokenToMint)
      ).to.be.revertedWith('!Activated');
    });
    it('should revert if calling sell in idle phase', async () => {
      const amountOTokenToSell = 10 * 1e8;
      const order = await getOrder(
        action.address,
        otoken1.address,
        amountOTokenToSell,
        token.address,
        swap.address,
        counterpartyWallet.privateKey
      );
      await expect(action.connect(owner).swapSell(order)).to.be.revertedWith('!Activated');
    });
    it('should be able to commit next token', async () => {
      await action.connect(owner).commitOToken(otoken1.address);
      expect((await action.nextOToken()) === otoken1.address);
      expect((await action.state()) === ActionState.Committed).to.be.true;
    });
    it('should revert if the vault is trying to rollover before min commit period is spent', async () => {
      await expect(action.connect(vault).rolloverPosition()).to.be.revertedWith(
        'COMMIT_PHASE_NOT_OVER'
      );
    });
  });

  describe('activating the action', () => {
    const mintOTokenAmount = 10 * 1e8;
    before('increase blocktime to get it over with minimal commit period', async () => {
      const minPeriod = await action.MIN_COMMIT_PERIOD();
      await provider.send('evm_increaseTime', [minPeriod.toNumber()]); // increase time
      await provider.send('evm_mine', []);
    });
    it('should revert if the vault is trying to rollover from non-vault address', async () => {
      await expect(action.connect(owner).rolloverPosition()).to.be.revertedWith('!VAULT');
    });
    it('should be able to roll over the position', async () => {
      await action.connect(vault).rolloverPosition();

      expect((await action.nextOToken()) === ethers.constants.AddressZero);
    });
    it('should get currentValue as total amount in gamma as ', async () => {
      const collateralAmount = utils.parseUnits('10');
      expect((await action.currentValue()).eq(collateralAmount)).to.be.true;
    });
    it('should be able to mint in this phase', async () => {
      const collateralAmount = utils.parseUnits('10');
      const otokenBalanceBefore = await otoken1.balanceOf(action.address);
      await action.connect(owner).mintOToken(collateralAmount, mintOTokenAmount);
      const otokenBalanceAfter = await otoken1.balanceOf(action.address);
      expect(otokenBalanceAfter.sub(otokenBalanceBefore).eq(mintOTokenAmount)).to.be.true;
    });
    it('should be able to sell in this phase', async () => {
      const sellAmount = 10 * 1e8;
      const order = await getOrder(
        action.address,
        otoken1.address,
        sellAmount,
        token.address,
        swap.address,
        counterpartyWallet.privateKey
      );
      await action.connect(owner).swapSell(order);
    });
    it('should revert when trying to fill wrong order', async () => {
      const badOrder1 = await getOrder(
        action.address,
        ethers.constants.AddressZero,
        mintOTokenAmount,
        token.address,
        swap.address,
        counterpartyWallet.privateKey
      );
      await expect(action.connect(owner).swapSell(badOrder1)).to.be.revertedWith(
        'Can only sell otoken'
      );

      const badOrder2 = await getOrder(
        action.address,
        otoken1.address,
        mintOTokenAmount,
        ethers.constants.AddressZero,
        swap.address,
        counterpartyWallet.privateKey
      );
      await expect(action.connect(owner).swapSell(badOrder2)).to.be.revertedWith(
        'Can only sell for asset'
      );
    });
    it('should not be able to commit next token', async () => {
      await expect(action.connect(owner).commitOToken(otoken2.address)).to.be.revertedWith(
        'Activated'
      );
    });
    it('should revert if the vault is trying to rollover', async () => {
      await expect(action.connect(vault).rolloverPosition()).to.be.revertedWith('!COMMITED');
    });
  });

  describe('close position', () => {
    before('increase blocktime to otoken expiry', async () => {
      await provider.send('evm_setNextBlockTimestamp', [otoken1Expiry.toNumber()]); // add totalDuration
      await provider.send('evm_mine', []);
    });
    it('should revert if the vault is trying to close from non-vault address', async () => {
      await expect(action.connect(owner).closePosition()).to.be.revertedWith('!VAULT');
    });
    it('should be able to close the position', async () => {
      const actionBalanceBefore = await token.balanceOf(action.address);
      const settlePayout = utils.parseUnits('9'); // assume we can get back 9 eth
      await controller.setSettlePayout(settlePayout);

      await action.connect(vault).closePosition();
      const actionBalanceAfter = await token.balanceOf(action.address);
      expect(actionBalanceAfter.sub(actionBalanceBefore).eq(settlePayout)).to.be.true;
      expect((await action.state()) === ActionState.Idle).to.be.true;
    });
    it('should revert if calling mint in idle phase', async () => {
      const collateral = utils.parseUnits('10');
      const amountOTokenToMint = 10 * 1e8;
      await expect(
        action.connect(owner).mintOToken(collateral, amountOTokenToMint)
      ).to.be.revertedWith('!Activated');
    });
    it('should revert if calling sell in idle phase', async () => {
      const amountOTokenToSell = 10 * 1e8;
      const order = await getOrder(
        action.address,
        otoken1.address,
        amountOTokenToSell,
        token.address,
        swap.address,
        counterpartyWallet.privateKey
      );
      await expect(action.connect(owner).swapSell(order)).to.be.revertedWith('!Activated');
    });
  });
});

const getOrder = async (
  sender: string,
  senderToken: string,
  senderTokenAmount: BigNumber | number,
  signerToken: string,
  swapContract: string,
  privateKey: any
) => {
  const order = createOrder({
    signer: {
      wallet: ethers.constants.AddressZero,
      token: signerToken,
      amount: 0,
    },
    sender: {
      wallet: sender,
      token: senderToken,
      amount: senderTokenAmount,
    },
    affiliate: {
      wallet: ethers.constants.AddressZero,
    },
  });
  const signedOrder = await signTypedDataOrder(order, privateKey, swapContract);
  return signedOrder;
};
