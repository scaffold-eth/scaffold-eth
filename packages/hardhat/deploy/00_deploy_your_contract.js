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

  const waitConfirmations = 5;

  const subscriptionId = 2801;
  const collectInterval = 60; // 1 minute, block.timestamp is in UNIX seconds

  console.log(
    `Attempting to deploy Game.sol to network number ${chainId} from ${deployer.address}`
  );

  const gameContract = await deploy("Game", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [subscriptionId, collectInterval],
    log: true,
    waitConfirmations: waitConfirmations,
  });

  console.log(`Game contract deployed to ${gameContract.address}`);
  console.log(
    `Don't forget to add this contract as consumer at https://vrf.chain.link`
  );

  const gldInitialSupply = ethers.utils.parseEther("1000000");

  console.log(
    `Attempting to deploy GoldToken.sol to network number ${chainId} from ${deployer.address}`
  );

  const gldTokenContract = await deploy("GLDToken", {
    from: deployer,
    args: [gldInitialSupply, gameContract.address],
    log: true,
    waitConfirmations: waitConfirmations,
  });

  console.log(`GLD Token contract deployed to ${gldTokenContract.address}`);

  const GameContract = await ethers.getContract("Game", deployer);

  await GameContract.setGldToken(gldTokenContract.address);

  console.log(
    `Attempting to deploy NFTAvatar.sol to network number ${chainId} from ${deployer.address}`
  );

  console.log("deploying nftAvatar with game contract", gameContract.address);

  const nftAvatarContract = await deploy("NFTAvatar", {
    from: deployer,
    args: [gameContract.address],
    log: true,
    waitConfirmations: waitConfirmations,
    gasPrice: 3000000000,
    gasLimit: 4000000,
  });

  console.log(`NFT Avatar contract deployed to ${nftAvatarContract.address}`);

  await GameContract.setNftAvatar(nftAvatarContract.address);

  console.log(
    `Attempting to deploy Keeper.sol to network number ${chainId} from ${deployer.address}`
  );

  const updateInterval = 150;

  const keeperContract = await deploy("Keeper", {
    from: deployer,
    args: [updateInterval, gameContract.address, subscriptionId],
    log: true,
    waitConfirmations: waitConfirmations,
    gasPrice: 4000000000,
    gasLimit: 2000000,
  });

  console.log(`Keeper contract deployed to ${keeperContract.address}`);
  console.log(
    `Don't forget to add this contract as consumer at https://vrf.chain.link`
  );

  await GameContract.setKeeper(keeperContract.address);

  const VRFCoordinatorV2 = await ethers.getContractAt(
    "VRFCoordinatorV2",
    "0x6168499c0cFfCaCD319c818142124B7A15E857ab"
  );

  await VRFCoordinatorV2.addConsumer(subscriptionId, gameContract.address);
  await VRFCoordinatorV2.addConsumer(subscriptionId, keeperContract.address);

  await GameContract.transferOwnership(
    "0x34aA3F359A9D614239015126635CE7732c18fDF3"
  );
  await GameContract.setKeeper("0x34aA3F359A9D614239015126635CE7732c18fDF3");

  //await GameContract.start();
  /*
  try {
    await run("verify:verify", {
      address: gameContract.address,
      contract: "contracts/Game.sol:Game",
      constructorArguments: [subscriptionId, collectInterval],
    });

    await run("verify:verify", {
      address: gldTokenContract.address,
      contract: "contracts/GoldToken.sol:GLDToken",
      constructorArguments: [gldInitialSupply, gameContract.address],
    });

    await run("verify:verify", {
      address: nftAvatarContract.address,
      contract: "contracts/NFTAvatar.sol:NFTAvatar",
      constructorArguments: [gameContract.address],
    });

    await run("verify:verify", {
      address: keeperContract.address,
      contract: "contracts/Keeper.sol:Keeper",
      constructorArguments: [
        updateInterval,
        gameContract.address,
        subscriptionId,
      ],
    });
  } catch (error) {
    console.error(error);
  }

  // Getting a previously deployed contract
  // const YourContract = await ethers.getContract("YourContract", deployer);
  /*  await YourContract.setPurpose("Hello");

    To take ownership of yourContract using the ownable library uncomment next line and add the
    address you want to be the owner.
    // await yourContract.transferOwnership(YOUR_ADDRESS_HERE);

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

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
  //       contractArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};
module.exports.tags = ["YourContract"];
