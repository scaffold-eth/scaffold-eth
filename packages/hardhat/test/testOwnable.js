const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Ownable", function () {
  let myContract;

  describe("YourContract", function () {
    it("Should deploy YourContract", async function () {
      const YourContract = await ethers.getContractFactory("YourContract");

      myContract = await YourContract.deploy();
    });

    describe("amIOwner()", function () {
      it("should say I'm the owner", async function () {

        await myContract.setPurpose(newPurpose);
        expect(await myContract.purpose()).to.equal(newPurpose);
      });
    });

    
  });
});