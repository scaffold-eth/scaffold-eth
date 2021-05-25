import { ethers, waffle } from 'hardhat';
import { BigNumber, utils, Signer } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { MockAction, MockERC20, OpynPerpVault, MockWETH } from '../typechain';
import * as fs from 'fs';
import { isConstructorDeclaration } from 'typescript';

const mnemonic = fs.existsSync('.secret')
  ? fs.readFileSync('.secret').toString().trim()
  : 'test test test test test test test test test test test junk';

enum VaultState {
  Locked,
  Unlocked,
  Emergency,
}

describe('OpynPerpVault Tests', function () {
  let action1: MockAction;
  let action2: MockAction;
  // asset used by this action: in this case, weth
  let weth: MockWETH;
  let usdc: MockERC20;

  let accounts: SignerWithAddress[] = [];

  let owner: SignerWithAddress;
  let depositor1: SignerWithAddress;
  let depositor2: SignerWithAddress;
  let depositor3: SignerWithAddress;
  let random: SignerWithAddress;
  let feeRecipient: SignerWithAddress;
  let vault: OpynPerpVault;

  this.beforeAll('Set accounts', async () => {
    accounts = await ethers.getSigners();
    const [_owner, _feeRecipient, _depositor1, _depositor2, _depositor3, _random] = accounts;

    owner = _owner;
    feeRecipient = _feeRecipient;

    depositor1 = _depositor1;
    depositor2 = _depositor2;
    depositor3 = _depositor3;
    random = _random;
  });

  this.beforeAll('Deploy Mock contracts', async () => {
    const MockWETHContract = await ethers.getContractFactory('MockWETH');
    weth = (await MockWETHContract.deploy()) as MockWETH;
    await weth.init('WETH', 'WETH', 18);

    const ERC20 = await ethers.getContractFactory('MockERC20');
    usdc = (await ERC20.deploy()) as MockERC20;
    await usdc.init('USDC', 'USDC', 6);
  });

  this.beforeAll('Deploy vault and mock actions', async () => {
    const VaultContract = await ethers.getContractFactory('OpynPerpVault');
    vault = (await VaultContract.deploy()) as OpynPerpVault;

    // deploy 2 mock actions
    const MockActionContract = await ethers.getContractFactory('MockAction');
    action1 = await MockActionContract.deploy(vault.address, weth.address);
    action2 = await MockActionContract.deploy(vault.address, weth.address);
  });

  describe('init', async () => {
    it('should init the contract successfully', async () => {
      await vault
        .connect(owner)
        .init(
          weth.address,
          owner.address,
          feeRecipient.address,
          weth.address,
          18,
          'OpynPerpShortVault share',
          'sOPS',
          [action1.address, action2.address]
        );
      // init state
      expect((await vault.state()) === VaultState.Unlocked).to.be.true;
      expect((await vault.totalAsset()).isZero(), 'total asset should be zero').to.be.true;
      expect((await vault.WETH()) === weth.address).to.be.true;
    });

    it('should set fee reserve', async () => {
      await vault.connect(owner).setWithdrawReserve(1000);
      expect((await vault.withdrawReserve()).toNumber() == 1000).to.be.true;
    });

    it('should revert if someone tries to send ETH to the vault', async () => {
      await expect(
        depositor1.sendTransaction({ to: vault.address, value: utils.parseUnits('1') })
      ).to.be.revertedWith('Cannot receive ETH');
    });
  });

  describe('genesis: before first cycle start', async () => {
    const depositAmount = utils.parseUnits('10');
    before('mint some WETH for depositor 2', async () => {
      // deposit 10 eth into weth
      await weth.connect(depositor2).deposit({ value: depositAmount });
      await weth.connect(depositor2).approve(vault.address, ethers.constants.MaxUint256);
    });
    it('should revert if calling depositETH with no value', async () => {
      await expect(vault.connect(depositor1).depositETH()).to.be.revertedWith('!VALUE');
    });
    it('should be able to deposit ETH and WETH', async () => {
      // depositor 1 deposit 10 eth
      await vault.connect(depositor1).depositETH({ value: depositAmount });
      expect((await vault.totalAsset()).eq(depositAmount), 'total asset should update').to.be.true;

      // depositor 2 deposit 10 weth
      await vault.connect(depositor2).deposit(depositAmount);

      expect((await vault.balanceOf(depositor1.address)).eq(depositAmount)).to.be.true;
      expect((await vault.balanceOf(depositor2.address)).eq(depositAmount)).to.be.true;

      expect((await vault.totalAsset()).eq(depositAmount.mul(2)), 'total asset should update').to.be
        .true;
    });
    it('should be able to withdraw weth or eth', async () => {
      // depositor 3 deposit 10 eth
      await vault.connect(depositor3).depositETH({ value: depositAmount });
      await vault.connect(depositor3).withdraw(depositAmount);
      expect((await vault.balanceOf(depositor3.address)).isZero()).to.be.true;
    });
    it('should revert when calling closePosition', async () => {
      await expect(vault.connect(owner).closePositions()).to.be.revertedWith('!Locked');
    });
    it('should revert if rollover is called with total percentage > 100', async () => {
      // max percentage sum should be 90% (9000) because 10% is set for reserve
      await expect(vault.connect(owner).rollOver([5000, 5000])).to.be.revertedWith(
        'PERCENTAGE_SUM_EXCEED_MAX'
      );
    });
    it('should revert if rollover is called with invalid percentage array', async () => {
      await expect(vault.connect(owner).rollOver([5000])).to.be.revertedWith('INVALID_INPUT');
    });
    it('should rollover to the next round', async () => {
      const vaultBalanceBefore = await weth.balanceOf(vault.address);
      const action1BalanceBefore = await weth.balanceOf(action1.address);
      const action2BalanceBefore = await weth.balanceOf(action2.address);
      const totalValueBefore = await vault.totalAsset();

      // Distribution:
      // 40% - action1
      // 50% - action2
      await vault.connect(owner).rollOver([4000, 5000]);

      const vaultBalanceAfter = await weth.balanceOf(vault.address);
      const action1BalanceAfter = await weth.balanceOf(action1.address);
      const action2BalanceAfter = await weth.balanceOf(action2.address);
      const totalValueAfter = await vault.totalAsset();

      expect(action1BalanceAfter.sub(action1BalanceBefore).eq(vaultBalanceBefore.mul(4).div(10))).to
        .be.true;
      expect(action2BalanceAfter.sub(action2BalanceBefore).eq(vaultBalanceBefore.mul(5).div(10))).to
        .be.true;

      expect(vaultBalanceAfter.eq(vaultBalanceBefore.div(10))).to.be.true;

      expect(totalValueAfter.eq(totalValueBefore), 'total value should stay uneffected').to.be.true;

      expect((await vault.state()) === VaultState.Locked).to.be.true;
    });
    it('shoudl revert when trying to call rollover again', async () => {
      await expect(vault.connect(owner).rollOver([7000, 2000])).to.be.revertedWith('!Unlocked');
    });
    it('should revert when trying to withdraw full amount', async () => {
      const depositor1Shares = await vault.balanceOf(depositor1.address);
      await expect(vault.connect(depositor1).withdraw(depositor1Shares.div(2))).to.be.revertedWith(
        'NOT_ENOUGH_BALANCE'
      );
    });
    it('should be able to withdraw reserved amount of asset (ETH)', async () => {
      const depositor1Shares = await vault.balanceOf(depositor1.address);
      // withdraw 10%
      const withdrawShareAmount = depositor1Shares.div(10);
      const expectedAmount = await vault.getWithdrawAmountByShares(withdrawShareAmount);

      const vaultBalanceBefore = await weth.balanceOf(vault.address);
      const totalSupplyBefore = await vault.totalSupply();
      const ethBalanceBefore = await depositor1.getBalance();

      const feeRecipientBalanceBefore = await weth.balanceOf(feeRecipient.address);

      // withdraw eth, (set gas price to 0 so gas won't mess with eth balances)
      await vault.connect(depositor1).withdrawETH(withdrawShareAmount, { gasPrice: 0 });

      const vaultBalanceAfter = await weth.balanceOf(vault.address);
      const totalSupplyAfter = await vault.totalSupply();
      const ethBalanceAfter = await depositor1.getBalance();

      const feeRecipientBalanceAfter = await weth.balanceOf(feeRecipient.address);
      const feeCollected = feeRecipientBalanceAfter.sub(feeRecipientBalanceBefore);

      expect(ethBalanceAfter.sub(ethBalanceBefore).eq(expectedAmount)).to.be.true;
      expect(vaultBalanceBefore.sub(vaultBalanceAfter).eq(expectedAmount.add(feeCollected))).to.be
        .true;
      expect(totalSupplyBefore.sub(totalSupplyAfter).eq(withdrawShareAmount)).to.be.true;
    });

    it('should be able to withdraw reserved amount of asset (WETH)', async () => {
      const depositor2Shares = await vault.balanceOf(depositor2.address);
      // withdraw 10%
      const withdrawShareAmount = depositor2Shares.div(10);
      const expectedAmount = await vault.getWithdrawAmountByShares(withdrawShareAmount);

      const vaultBalanceBefore = await weth.balanceOf(vault.address);
      const totalSupplyBefore = await vault.totalSupply();
      const wethBalanceBefore = await weth.balanceOf(depositor2.address);

      const feeRecipientBalanceBefore = await weth.balanceOf(feeRecipient.address);

      // withdraw weth
      await vault.connect(depositor2).withdraw(withdrawShareAmount);

      const vaultBalanceAfter = await weth.balanceOf(vault.address);
      const totalSupplyAfter = await vault.totalSupply();
      const wethBalanceAfter = await weth.balanceOf(depositor2.address);

      const feeRecipientBalanceAfter = await weth.balanceOf(feeRecipient.address);
      const feeCollected = feeRecipientBalanceAfter.sub(feeRecipientBalanceBefore);

      expect(wethBalanceAfter.sub(wethBalanceBefore).eq(expectedAmount)).to.be.true;
      expect(vaultBalanceBefore.sub(vaultBalanceAfter).eq(expectedAmount.add(feeCollected))).to.be
        .true;
      expect(totalSupplyBefore.sub(totalSupplyAfter).eq(withdrawShareAmount)).to.be.true;
    });
    it('should revert if calling resumeFrom pause when vault is normal', async () => {
      await expect(vault.connect(owner).resumeFromPause(VaultState.Locked)).to.be.revertedWith(
        '!Emergency'
      );
    });
    it('should be able to set vault to emergency state', async () => {
      await vault.connect(owner).emergencyPause();
      expect((await vault.state()) === VaultState.Emergency);

      await expect(
        vault.connect(depositor1).depositETH({ value: utils.parseUnits('1') })
      ).to.be.revertedWith('Emergency');

      await vault.connect(owner).resumeFromPause(VaultState.Locked);
      expect((await vault.state()) === VaultState.Emergency);
    });
  });
  describe('close position', async () => {
    before('pretent that action1 made money', async () => {
      // mint 1 weth and send it to action1
      await weth.connect(random).deposit({ value: utils.parseUnits('1') });
      await weth.connect(random).transfer(action1.address, utils.parseUnits('1'));
    });

    it('should be able to close position', async () => {
      const totalAssetBefore = await vault.totalAsset();
      const vaultBalanceBefore = await weth.balanceOf(vault.address);

      const action1BalanceBefore = await weth.balanceOf(action1.address);
      const action2BalanceBefore = await weth.balanceOf(action2.address);
      await vault.connect(owner).closePositions();

      const totalAssetAfter = await vault.totalAsset();
      const vaultBalanceAfter = await weth.balanceOf(vault.address);
      const action1BalanceAfter = await weth.balanceOf(action1.address);
      const action2BalanceAfter = await weth.balanceOf(action2.address);

      expect(totalAssetBefore.eq(totalAssetAfter)).to.be.true;
      expect(
        vaultBalanceAfter
          .sub(vaultBalanceBefore)
          .eq(
            action2BalanceBefore
              .sub(action2BalanceAfter)
              .add(action1BalanceBefore.sub(action1BalanceAfter))
          )
      ).to.be.true;
    });
    it('should revert if calling closePositions again', async () => {
      await expect(vault.connect(owner).closePositions()).to.be.revertedWith('!Locked');
    });
  });
});
