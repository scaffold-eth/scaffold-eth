// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const collectInterval = 60; // 1 minute, block.timestamp is in UNIX seconds

  const emoticoin = await deploy("Emoticoin", {
    from: deployer,
    log: true,
  });

  const renderEyes = await deploy("EmotilonRenderEyes", {
    from: deployer,
    log: true,
  });

  const renderMouth = await deploy("EmotilonRenderMouth", {
    from: deployer,
    log: true,
  });

  const metadata = await deploy("EmotilonMetadata", {
    from: deployer,
    libraries: {
      EmotilonRenderEyes: renderEyes.address,
      EmotilonRenderMouth: renderMouth.address,
    },
    log: true,
  });

  const emotilon = await deploy("Emotilon", {
    from: deployer,
    args: [emoticoin.address],
    libraries: { EmotilonMetadata: metadata.address },
    log: true,
  });

  const game = await deploy("EmotilonBoardGame", {
    from: deployer,
    args: [collectInterval, emotilon.address, emoticoin.address],
    log: true,
  });

  const gameAddress = game.address;
  const emotilonAddress = emotilon.address;

  const emoticoinContract = await ethers.getContract("Emoticoin", deployer);
  const emotilonContract = await ethers.getContract("Emotilon", deployer);

  await emoticoinContract.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
    gameAddress
  );

  await emoticoinContract.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("BURNER_ROLE")),
    emotilonAddress
  );

  await emotilonContract.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("HEALTH_ROLE")),
    gameAddress
  );

  await emotilonContract.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("COINS_ROLE")),
    gameAddress
  );

  await emotilonContract.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("KILL_ROLE")),
    gameAddress
  );

  await emotilonContract.setEmotilonBoardGameContract(gameAddress);

  const GameContract = await ethers.getContract("EmotilonBoardGame", deployer);

  await GameContract.setDropOnCollect(true);

  await GameContract.shufflePrizes(1, 1);
  await GameContract.shufflePrizes(2, 2);

  await GameContract.transferOwnership(
    "0x5dCb5f4F39Caa6Ca25380cfc42280330b49d3c93"
  );

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

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
module.exports.tags = ["YourContract"];
