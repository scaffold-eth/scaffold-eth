/* eslint no-use-before-define: "warn" */
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");

const main = async () => {
  console.log("\n\n ⏳ ff...\n");
  console.log("increasing time....")
  await time.increase(3600);

};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
