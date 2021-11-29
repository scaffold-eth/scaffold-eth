// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  //! prod GTC address
  let GTC = { address: "0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F" };

  // deploy mock token contract ~ if not on mainnet
  if (chainId !== "1") {
    // deploy mock GTC
    GTC = await deploy("GTC", {
      from: deployer,
      // front-end address vvvvvvvvvvvvvvv replace with args: [admins[0]], for deploy
      args: [process.env.DEVELOPER],
      log: true,
    });
  }

  // deploy Staking Contract ~ any network
  await deploy("StakingGTC", {
    from: deployer,
    args: [GTC.address],
    log: true,
  });

  // Getting a previously deployed contract
  const StakeGTCContract = await ethers.getContract("StakingGTC", deployer);

  // create sample pool
  if (chainId === "31337") {
    const stakeDemo = await StakeGTCContract.createPool(
      "QmUfQaJQuqQZNhyKDmgxFtqo6oEdo8s9peXjTenz9cPm4m"
    );
    await stakeDemo.wait(1);
  }

  // log the GTC and StreamFactory addresses
  console.log({
    GTC: GTC.address,
    StakingContract: StakeGTCContract.address,
  });

  // make sure were not on the local chain...
  if (chainId !== "31337") {
    // verigy the staking contract
    await run("verify:verify", {
      address: StakeGTCContract.address,
      contract: "contracts/StakingGTC.sol:StakingGTC",
      constructorArguments: [GTC.address],
    });
  }
};

module.exports.tags = ["GTC", "StakingGTC"];
