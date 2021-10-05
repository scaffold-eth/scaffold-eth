const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("My Dapp", function () {
  let addressList;
  let signers;
  let listName;

  describe("AddressList", function () {
    it("Should deploy AddressList", async function () {
      const AddressListContract = await ethers.getContractFactory(
        "AddressList"
      );

      signers = (await ethers.getSigners()).map((x) => x.address);

      addressList = await AddressListContract.deploy();
    });

    // createList
    describe("createList()", function () {
      it("Should be able to create a new List", async function () {
        listName = "SamplePayList";
        const listUsers = signers.slice(1, 5);

        await addressList.createList(listName, listUsers, true);
        expect(await addressList.getList(listName)).to.eql(listUsers);
      });
    });

    // getListMeta
    describe("getListMeta()", function () {
      it("Should be able to fetch a lists' meta data", async function () {
        const meta = await addressList.getListMeta(listName);

        expect(meta.owner).to.equal(signers[0]);
        expect(meta.joinable).to.be.true;
      });
    });

    // addUserToList
    describe("addUserToList()", function () {
      it("Should be able to add a new user to list", async function () {
        const user = signers[5];

        await addressList.addUserToList(listName, user);
        const users = await addressList.getList(listName);
        const expectedUsers = signers.slice(1, 6);

        expect(users).to.eql(expectedUsers);
      });
    });

    // joinList
    describe("joinList()", function () {
      it("Should be able to join a list", async function () {
        const user = signers[0];

        await addressList.joinList(listName);
        const users = await addressList.getList(listName);
        const expectedUsers = signers.slice(1, 6);

        expect(users).to.eql([...expectedUsers, user]);
      });
    });

    // leaveList
    describe("leaveList()", function () {
      it("Should be able to join a list", async function () {
        await addressList.leaveList(listName);
        const users = await addressList.getList(listName);
        const expectedUsers = signers.slice(1, 6);

        expect(users).to.eql(expectedUsers);
      });
    });

    // transfer
    describe("transfer()", function () {
      it("Should be able to transfer list ownership", async function () {
        await addressList.transfer(listName, signers[1]);
        const meta = await addressList.getListMeta(listName);

        expect(meta.owner).to.equal(signers[1]);
      });
    });
  });
});
