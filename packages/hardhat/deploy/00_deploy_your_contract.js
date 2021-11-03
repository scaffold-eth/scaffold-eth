/* eslint-disable prettier/prettier */
// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const admins = [];

  //! prod GTC
  let GTC = { address: "0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F" };

  // todo: need a mock token
  // mock token contract
  if (chainId !== "1") {
    admins[0] = process.env.DEVELOPER;

    GTC = await deploy("GTC", {
      from: deployer,
      args: [admins[0]],
      log: true,
    });
  }

  // Staking Contract
  await deploy("StakingGTC", {
    from: deployer,
    args: ["0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F"],
    log: true,
  });

  // Getting a previously deployed contract
  const StakeGTCContract = await ethers.getContract("StakingGTC", deployer);

  // log the GTC and StreamFactory addresses
  console.log({
    GTC: GTC.address,
    streamFactory: StakeGTCContract.address,
  });

  // if (chainId !== "31337") {
  //   await run("verify:verify", {
  //     address: StakeGTCContract.address,
  //     contract: "contracts/StakingGTC.sol:StakingGTC",
  //     constructorArguments: [GTC.address],
  //   });
  // }
};
module.exports.tags = ["YourContract"];
