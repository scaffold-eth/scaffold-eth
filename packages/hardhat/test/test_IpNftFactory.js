const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const { it } = require("mocha");

require("chai").use(require("chai-as-promised")).should();

use(solidity);

describe("Royalty Free NFT", function () {
  let IpNftFactory;
  let childContractAddress1;
  let childContract1;
  let owner;
  let licensor;
  let licensee;
  let nonLicensee;

  beforeEach(async function () {
    [owner, licensor, licensee, nonLicensee] = await ethers.getSigners();
    const parentContract = await ethers.getContractFactory("IpNftFactory");
    IpNftFactory = await parentContract.deploy();
  });

  describe("Factory of IpNft contracts deployment", function () {
    it("Should have proper owner", async function () {
      expect(await IpNftFactory.owner()).to.equal(owner.address);
    });
  });
  describe("Deploy Child Contract", function () {
    it("Should generate new contract", async function () {
      const newIpNftArgs = [
        "Test",
        "Test",
        "QmTwx4sLHk432eDqe54CX3Jij2isStJDpe6ey8eBRTYFZq"
      ];
      await IpNftFactory.connect(licensor).newIpNft(...newIpNftArgs);
      childContractAddress1 = await IpNftFactory.getChildren();
      expect(
        await IpNftFactory.IpNftContracts(childContractAddress1[0])
      ).to.equal(true);
    });
    it("Should have proper owner", async function () {
      childContract1 = await ethers.getContractAt(
        "IpNft",
        childContractAddress1[0]
      );
      expect(await childContract1.owner()).to.equal(licensor.address);
    });
    it("Should have proper name", async function () {
      expect(await childContract1.name()).to.equal("Test");
    });
    it("Should have proper symbol", async function () {
      expect(await childContract1.symbol()).to.equal("Test");
    });
  });
  describe("Should mint NFT as a license", async function () {
    it("Should mint a license for correct price", async function () {
      await childContract1.connect(licensee).licenseIP({
        value: BigInt(ethers.utils.parseEther("0.01"))
      }).should.be.fulfilled;
    });

    it("Should reject a license for to low of price", async function () {
      await childContract1.connect(licensee).licenseIP({
        value: BigInt(ethers.utils.parseEther("0.009"))
      }).should.be.rejected;
    });
    it("Should reject a license for to high of price", async function () {
      await childContract1.connect(licensee).licenseIP({
        value: BigInt(ethers.utils.parseEther("0.011"))
      }).should.be.rejected;
    });
    it("Should have proper token URI", async function () {
      expect(await childContract1.tokenURI(1)).to.equal(
        "ipfs://QmTwx4sLHk432eDqe54CX3Jij2isStJDpe6ey8eBRTYFZq"
      );
    });
    it("Should have license owned by licensee address", async function () {
      expect(await childContract1.ownerOf("1")).to.equal(licensee.address);
    });

    it("Should have Transfer function disabled", async function () {
      await childContract1.connect(licensee).transferFrom({
        from: licensee.address,
        to: nonLicensee.address,
        tokenId: 1
      }).should.be.rejected;
    });

    it("Should have safeTransfer function disabled", async function () {
      await childContract1.connect(licensee).transferOwnership({
        from: licensee.address,
        to: nonLicensee.address,
        tokenId: 1
      }).should.be.rejected;
    });
  });
});
