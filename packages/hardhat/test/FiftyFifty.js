const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("FiftyFifty testing", function () {
  let splitMain;
  let myContract;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe("YourContract", function () {
    /**
     * Testing partitons
     * 1) adding new contract vs claiming existing contract
     * 2) nonzero vs zero community pool
     */

    it("Should deploy SplitMain", async function () {
      const SplitMain = await ethers.getContractFactory("SplitMain");
      splitMain = await SplitMain.deploy();
    });

    it("Should deploy YourContract", async function () {
      const YourContract = await ethers.getContractFactory("YourContract");
      myContract = await YourContract.deploy(500000, 5000, splitMain.address);
    });

    describe("Adding two projects", function () {
      let cabalSplitAddress;

      it("add first project with a pool", async function () {
        await myContract.addProjectToSystem(
          "https://github.com/dizkus/heyanon",
          "0xEf4D00efF106727524453A48680EA968498AFF4c",
          [
            "https://github.com/nalinbhardwaj/stealthdrop",
            "https://github.com/0xPARC/circom-ecdsa",
            "https://github.com/0xPARC/cabal",
          ],
          [150000, 200000, 100000],
          50000,
          "0x7162C2F74a1b968aa33E3DCFd15366264E9eC53c"
        );

        cabalSplitAddress = await myContract.getSplitAddress(
          "https://github.com/0xPARC/cabal"
        );
      });

      it("add second project without a pool, update split", async function () {
        await myContract.addProjectToSystem(
          "https://github.com/0xPARC/cabal",
          "0x020d3d11a4003817AdE92D060a6653e4E21Bb16e",
          ["https://github.com/0xPARC"],
          [500000],
          0,
          "0x0000000000000000000000000000000000000000"
        );

        const newCabalSplitAdress = await myContract.getSplitAddress(
          "https://github.com/0xPARC/cabal"
        );

        expect(newCabalSplitAdress).to.equal(cabalSplitAddress);
      });
    });
  });
});
