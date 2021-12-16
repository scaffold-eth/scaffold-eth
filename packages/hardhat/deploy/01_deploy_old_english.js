// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("EightPack", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
  });

  // Getting a previously deployed contract
  const OldEnglish = await ethers.getContract("EightPack", deployer);

  const Buzz = await ethers.getContract("Buzz", deployer);

  await Buzz.setMinter(OldEnglish.address);
  console.log(`Old English (${OldEnglish.address}) set as a Buzz minter`);

  await OldEnglish.setBuzz(Buzz.address);

  console.log(`Buzz set to ${Buzz.address} in OldEnglish`);
};
module.exports.tags = ["OldEnglish"];
