const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

/**
 * @notice auto-grading tests for simpleDEX challenge
 * Stages of testing are as follows: set up global test variables, test contract deployment, deploy contracts in beforeEach(), then actually test out each separate function.
 * @dev this is still a rough WIP. See TODO: scattered throughout.'
 * @dev additional TODO: Write edge cases; putting in zero as inputs, or whatever.
 * @dev Harshit will be producing auto-grading tests in one of the next PRs. 
 */
describe("🚩 Challenge 3: ⚖️ 🪙 Simple DEX", function () {
  this.timeout(45000);

  let dexContract;
  let balloonsContract;
  let deployer;
  let user2;
  let user3;

  // assign 'signer' addresses as object properties (Strings) to user array --> this is so we have signers ready to test this thing.
  before(async function () {
    const getAccounts = async function () {
      let accounts = [];
      let signers = [];
      signers = await hre.ethers.getSigners();
      for (const signer of signers) {
        accounts.push({ signer, address: await signer.getAddress() });
      } //populates the accounts array with addresses.
      return accounts;
    };

    // REFACTOR
    [deployer, user2, user3] = await getAccounts();
    // console.log("User1 after before(): ", user1);
  });

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("DEX: Standard Path", function () {
    // 1st check if DEX contract already deployed, otherwise balloons needs to be deployed! TODO: have to figure out what account is the deployer if the challenger submits with a .env file!
    if (process.env.CONTRACT_ADDRESS) {
      it("Should connect to dex contract", async function () {
        dexContract = await ethers.getContractAt(
          "DEX",
          process.env.CONTRACT_ADDRESS
        );
        console.log("     🛰 Connected to DEX contract", dexContract.address);
      });
    } else {
      it("Should deploy Balloons contract", async function () {
        const BalloonsContract = await ethers.getContractFactory(
          "Balloons",
          deployer
        );
        balloonsContract = await BalloonsContract.deploy();
      });
      it("Should deploy DEX", async function () {
        const Dex = await ethers.getContractFactory("DEX", deployer);
        dexContract = await Dex.deploy(balloonsContract.address);
      });
    }

    // see if initial setup works, should have 1000 balloons in totalSupply, and 5 balloons + 5 ETH within DEX. This set up will be used continuously afterwards for nested function tests.
    // TODO: Also need to test that the other functions do not work if we try calling them without init() started.
    describe("init()", function () {
      it("Should set up DEX with 5 balloons at start", async function () {
        let tx1 = await balloonsContract
          .connect(deployer.signer)
          .approve(dexContract.address, ethers.utils.parseEther("100"));
        await expect(tx1)
          .emit(balloonsContract, "Approval")
          .withArgs(
            deployer.address,
            dexContract.address,
            ethers.utils.parseEther("100")
          );
        let tx2 = await dexContract
          .connect(deployer.signer)
          .init(ethers.utils.parseEther("5"), {
            value: ethers.utils.parseEther("5"),
          });
        await expect(tx2).emit(balloonsContract, "Transfer");

        // TODO: SYNTAX - get revert test to work
        // let tx3 = await dexContract
        //   .connect(deployer.signer)
        //   .init(ethers.utils.parseEther("5"), {
        //     value: ethers.utils.parseEther("5"),
        //   });
        // await expect(tx3).revertedWith("DEX: init - already has liquidity");
        // await expect(tx3).to.be.reverted;
      });

      describe("ethToToken()", function () {
        it("Should send 1 Ether to DEX in exchange for _ $BAL", async function () {
          let tx1 = await dexContract.connect(deployer.signer).ethToToken({
            value: ethers.utils.parseEther("1"),
          });
          // TODO: SYNTAX - Figure out how to read eth balance of dex contract and to compare it against the eth sent in via this tx. Also figure out why/how to read the event that should be emitted with this too.

          expect(
            await ethers.BigNumber.from(dexContract.address.balance)
          ).to.equal(ethers.utils.parseEther("6"));

          // await expect(tx1)
          //   .emit(dexContract, "EthToTokenSwap")
          //   .withArgs(user2.address, __, ethers.utils.parseEther("1"));
        });

        it("Should send less tokens after the first trade (ethToToken called)", async function () {
          await dexContract.connect(deployer.signer).ethToToken({
            value: ethers.utils.parseEther("1"),
          });
          let tx1 = dexContract.connect(user2.signer).ethToToken({
            value: ethers.utils.parseEther("1"),
          });
          // expect(tx1).emit(dexContract, "EthToTokenSwap").withArgs(user2.address, __, ethers.utils.parseEther("1"));
        });
        // could insert more tests to show the declining price, and what happens when the pool becomes very imbalanced.
      });
      describe("tokenToEth", async () => {
        it("Should send 1 $BAL to DEX in exchange for _ $ETH", async function () {
          let tx1 = await dexContract
            .connect(deployer.signer)
            .tokenToEth(ethers.utils.parseEther("1"));

          //TODO: SYNTAX -  write an expect that takes into account the emitted event from tokenToETH.
        });

        it("Should send less tokens after the first trade (tokenToEach() called)", async function () {
          await dexContract
            .connect(deployer.signer)
            .tokenToEth(ethers.utils.parseEther("1"));
          let tx1 = await dexContract
            .connect(deployer.sign
            .tokenToEth(ethers.utils.parseEther("1"));

          //TODO: SYNTAX - write an expect that takes into account the emitted event from tokenToETH.
        });
      });

      describe("deposit", async () => {
        it("Should deposit 1 ETH and 1 $BAL when pool at 1:1 ratio", async function () {
          let tx1 = await dexContract.connect(deployer.signer).deposit(
            (ethers.utils.parseEther("5"),
            {
              value: ethers.utils.parseEther("5"),
            })
          );
          // TODO: SYNTAX - Write expect() assessing changed liquidty within the pool. Should have an emitted event!
        });
      });

      // pool should have 5:5 ETH:$BAL ratio
      describe("withdraw", async () => {
        it("Should withdraw 1 ETH and 1 $BAL when pool at 1:1 ratio", async function () {
          let tx1 = await dexContract
            .connect(deployer.signer)
            .withdraw(ethers.utils.parseEther("1"));

          // TODO: SYNTAX - Write expect() assessing changed liquidty within the pool. Should have an emitted event!
        });
      });
    });
  });
});
