const { ethers } = require("@nomiclabs/buidler");

const DEX = artifacts.require("DEX");
describe("My Dapp", function() {
  let accounts;
  let myContract;
  before(async function() {
    console.log("HERE")
    accounts = await ethers.getSigners();
    console.log("   accounts",accounts)
  });
  describe("My SmartContractWallet", function() {
    console.log("   accounts",accounts)
    //it("Should deploy my SmartContractWallet", async function() {
    //  myContract = await SmartContractWallet.new();
    //});
    //describe("owner()", function() {
    ////  it("Should have an owner equal to the deployer", async function() {
    //    assert.equal(await myContract.owner(), accounts[0]);
    //  });
    //});
  });
});
