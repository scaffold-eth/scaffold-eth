// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const RINKEBY_DAI_ADDRESS = "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa";
const targetAddress = "0x1e2Ce012b27d0c0d3e717e943EF6e62717CEc4ea";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("PublicGoodToken", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  const PublicGoodToken = await ethers.getContract("PublicGoodToken", deployer);
  await deploy("Weightage", {
    from: deployer,
    log: true,
    args: [[PublicGoodToken.address], RINKEBY_DAI_ADDRESS],
  });

  // const TokenAsOwner = await ethers.getContract("PublicGoodToken", deployer);
  // await TokenAsOwner.transfer(targetAddress, ethers.utils.parseEther("1000"));
};

module.exports.tags = ["YourContract"];
