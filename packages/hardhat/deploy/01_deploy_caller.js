// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer, registry, adamLocal } = await getNamedAccounts();

  const YourContract = await ethers.getContract("YourContract_Proxy", deployer);

  await deploy("Caller", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [YourContract.address, adamLocal],
    log: true,
  });
};
module.exports.tags = ["Caller"];
