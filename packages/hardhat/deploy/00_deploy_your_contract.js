// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("DiceGame", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    //args: [ ethers.utils.parseEther(".05") ],
    log: true,
  });

  // Getting a previously deployed contract
  const DiceGame = await ethers.getContract("DiceGame", deployer);
  //Send .05 ether to the DiceGame contract for the initial prize money
  DiceGame.fundContract({value: ethers.utils.parseEther(".05")});

};
module.exports.tags = ["DiceGame"];
