import { ethers } from "hardhat";
import { use, expect } from "chai";
import { solidity } from "ethereum-waffle";

import { YourContract, YourContract__factory } from "../typechain";

use(solidity);

describe("My Dapp", function () {
  let myContract: YourContract;

  describe("YourContract", function () {
    it("Should deploy YourContract", async function () {
      const YourContract = (await ethers.getContractFactory(
        "YourContract"
      )) as YourContract__factory;

      myContract = await YourContract.deploy();
    });

    describe("setPurpose()", function () {
      it("Should be able to set a new purpose", async function () {
        const newPurpose = "Test Purpose";

        await myContract.setPurpose(newPurpose);
        expect(await myContract.purpose()).to.equal(newPurpose);
      });
    });
  });
});
