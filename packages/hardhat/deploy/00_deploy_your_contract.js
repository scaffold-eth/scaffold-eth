// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");
const { starknet } = require("hardhat");

// https://starknet.io/documentation/chain-ids/
const localChainId = "SN_GOERLI";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  /*
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  */

  // see: https://www.npmjs.com/package/@shardlabs/starknet-hardhat-plugin#Account
  const accountName = "OpenZeppelin";

  const CREATE_NEW_ACCOUNT = false;
  const FETCH_EXISTING_ACCOUNT = !CREATE_NEW_ACCOUNT;

  let account = null;

  console.log("");

  if (CREATE_NEW_ACCOUNT) {
    console.log(`now creating account with name: ${accountName}`);
    account = await starknet.deployAccount(accountName);
  }

  if (FETCH_EXISTING_ACCOUNT) {
    // fetch account if already generated
    // TODO:
    const accountAddress =
      "0x0358576968ff2ea1e9537e0fb8f063b4d047bb8958fdd57485782a9d37ecb9ee";
    const privateKey =
      "0x262f5da99e4d1a0a98e2a21eb3cd75784468ae7d38877c7d743523374070d4e";

    console.log(`now fetching account at address: ${accountAddress}`);
    account = await starknet.getAccountFromAddress(
      accountAddress,
      privateKey,
      accountName
    );
  }

  console.log(
    "---------------------------------------------------------------------------------------"
  );
  console.log("account:");
  console.log("");
  console.log("starknetContract address:", account.starknetContract.address);
  console.log("publicKey:", account.publicKey);
  console.log("privateKey:", account.privateKey);
  console.log(
    "---------------------------------------------------------------------------------------"
  );

  console.log("now deploying contract");
  const contractFactory = await starknet.getContractFactory("ERC721");
  const contract = await contractFactory.deploy({
    name: 100, // "MyNFT",
    symbol: 100, // "MNFT",
    base_uri: {
      prefix: 100, // "ipfs://myNFT",
      suffix: 100, // ".com",
    },
  });
  console.log("deployed to:", contract.address);
  console.log(
    "block explorer:",
    `https://goerli.voyager.online/contract/${contract.address}`
  );

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  // try {
  //   if (chainId !== localChainId) {
  //     await run("verify:verify", {
  //       address: YourContract.address,
  //       contract: "contracts/YourContract.sol:YourContract",
  //       constructorArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};
module.exports.tags = ["MyContracts"];
