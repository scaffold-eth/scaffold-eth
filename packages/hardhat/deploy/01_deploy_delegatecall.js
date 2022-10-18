const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await getChainId();

    await deploy("Delegatecall", {
        // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
        from: deployer,
        // args: [ "Hello", ethers.utils.parseEther("1.5") ],
        log: true,
        waitConfirmations: 5,
    });

    // Getting a previously deployed contract
    //const Delegatecall = await ethers.getContract("Delegatecall", deployer);
};
module.exports.tags = ["Delegatecall"];
