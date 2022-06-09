const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { BigNumber } = require("ethers");

use(solidity);

describe("🚩 Challenge 3: 🎲 Dice Game", function () {
  let deployer;
  let account1;
  let diceGame;
  let riggedRoll;
  let provider;

  async function deployContracts() {
    const DiceGame = await ethers.getContractFactory("DiceGame");
    diceGame = await DiceGame.deploy();

    const RiggedRoll = await ethers.getContractFactory("RiggedRoll");
    riggedRoll = await RiggedRoll.deploy(diceGame.address);

    [deployer, account1] = await ethers.getSigners();
    provider = ethers.provider;
  }

  function fundRiggedContract() {
    return deployer.sendTransaction({
      to: riggedRoll.address,
      value: ethers.utils.parseEther("1"),
    });
  }

  async function changeStatesToGetRequiredRoll(getRollLessThanTwo) {
    let expectedRoll;
    while (true) {
      let latestBlockNumber = await provider.getBlockNumber();
      let block = await provider.getBlock(latestBlockNumber);
      let prevHash = block.hash;
      let nonce = await diceGame.nonce();

      let hash = ethers.utils.solidityKeccak256(
        ["bytes32", "address", "uint256"],
        [prevHash, diceGame.address, nonce]
      );

      let bigNum = BigNumber.from(hash);
      expectedRoll = bigNum.mod(16);
      if (expectedRoll.lte(2) == getRollLessThanTwo) {
        break;
      }

      const options = { value: ethers.utils.parseEther("0.002") };
      await diceGame.rollTheDice(options);
    }
    return expectedRoll;
  }

  describe("⚙️ Setup contracts", function () {
    it("Should deploy contracts", async function () {
      await deployContracts();
      expect(await riggedRoll.diceGame()).to.equal(diceGame.address);
    });

    it("Should revert if balance less than .002 ethers", async function () {
      expect(riggedRoll.riggedRoll()).to.reverted;
    });

    it("Should transfer sufficient eth to RiggedRoll", async function () {
      await fundRiggedContract();
      let balance = await provider.getBalance(riggedRoll.address);
      expect(balance).to.above(ethers.utils.parseEther(".002"));
    });
  });

  describe("🔑 Rigged Rolls", function () {
    it("Should call DiceGame for a roll less than 2", async () => {
      //first change states and create the inputs required to produce a roll <= 2
      let getRollLessThanTwo = true;
      let expectedRoll = await changeStatesToGetRequiredRoll(
        getRollLessThanTwo
      );
      console.log(
        "EXPECT ROLL TO BE LESS THAN OR EQUAL TO 2: ",
        expectedRoll.toNumber()
      );

      let tx = riggedRoll.riggedRoll();

      it("Should emit Roll event!", async () => {
        expect(tx)
          .to.emit(diceGame, "Roll")
          .withArgs(riggedRoll.address, expectedRoll);
      });

      it("Should emit Winner event!", async () => {
        expect(tx).to.emit(diceGame, "Winner");
      });
    });

    it("Should not call DiceGame for a roll greater than 2", async () => {
      let getRollLessThanTwo = false;
      let expectedRoll = await changeStatesToGetRequiredRoll(
        getRollLessThanTwo
      );
      console.log(
        "EXPECTED ROLL TO BE GREATER THAN 2: ",
        expectedRoll.toNumber()
      );

      expect(riggedRoll.riggedRoll()).to.reverted;
    });

    it("Should withdraw funds", async () => {
      //deployer is the owner by default so should be able to withdraw
      await fundRiggedContract();

      let prevBalance = await deployer.getBalance();
      await riggedRoll.withdraw(
        deployer.address,
        provider.getBalance(riggedRoll.address)
      );
      let curBalance = await deployer.getBalance();
      expect(prevBalance.lt(curBalance)).to.true;
    });
  });
});
