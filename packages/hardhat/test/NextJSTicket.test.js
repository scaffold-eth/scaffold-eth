const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function () {
  let NextJSTicketContract;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("NextJSTicket", function () {
    it("Should deploy NextJSTicket", async function () {
      const NextJSTicket = await ethers.getContractFactory("NextJSTicket");

      NextJSTicketContract = await NextJSTicket.deploy();
    });

    // describe("setPurpose()", function () {
    //   it("Should be able to set a new purpose", async function () {
    //     const newPurpose = "Test Purpose";

    //     await NextJSTicketContract.setPurpose(newPurpose);
    //     expect(await NextJSTicketContract.purpose()).to.equal(newPurpose);
    //   });
    // });
  });
});
