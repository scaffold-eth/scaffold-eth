
const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const metadata = await deploy("MandalaMetadata", {
    from: deployer,
    log: true,
  });

  await deploy("MandalaMerge", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    libraries: { MandalaMetadata: metadata.address },
    log: true,
  });
};
module.exports.tags = ["MandalaMerge"];
