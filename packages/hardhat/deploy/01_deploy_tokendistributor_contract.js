// deploy/00_deploy_tokendistributor_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const frontendAddress = "0xC8a0797F73a5b03AC135b6fc7843D78a6DE5Ce32";

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("TokenDistributor", {
    from: deployer,
    log: true,
  });

  await deploy("DummyToken", {
    from: deployer,
    log: true,
  });

  const tokenDistributorContract = await ethers.getContract(
    "TokenDistributor",
    deployer
  );
  const dummyTokenContract = await ethers.getContract("DummyToken", deployer);

  // transfer ownership to UI owner if needed
  tokenDistributorContract.transferOwnership(frontendAddress);

  const mintedBalance = await dummyTokenContract.balanceOf(deployer);
  const splitValue = mintedBalance.div(ethers.BigNumber.from(2));

  // split tokens between frontendAddress and tokenDistributorContract for later distribution
  await dummyTokenContract.transfer(frontendAddress, splitValue);
  await dummyTokenContract.transfer(
    tokenDistributorContract.address,
    splitValue
  );

  // allow tokenDistributor to spend frontendAddress balance

  const frontendBalance = await dummyTokenContract.balanceOf(frontendAddress);
  const distributorBalance = await dummyTokenContract.balanceOf(
    tokenDistributorContract.address
  );

  console.log({
    frontend: frontendBalance.toString(),
    distributor: distributorBalance.toString(),
  });
};
module.exports.tags = ["TokenDistributor", "DummyToken"];
