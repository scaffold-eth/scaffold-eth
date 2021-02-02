const { ethers } = require('hardhat');
const { use, expect } = require('chai');
const { solidity } = require('ethereum-waffle');

use(solidity);

describe('My Dapp', function() {
  let myContract;

  describe("Ownable", function() {
    
    it('Should deploy Ownable.', async function () {
      const Ownable = await ethers.getContractFactory('Ownable');
      myContract = await Ownable.deploy();
    });

    it("Should know I'm the owner.", async function () {
      const Ownable = await ethers.getContractFactory('Ownable');
      myContract = await Ownable.deploy();
      expect(await myContract.amIOwner()).to.equal(true);
    });


  })
})