// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
/*
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

  await deploy("EmotilonVoucher", {
    from: deployer,
    log: true,
  });
*/
  const gameAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

  const emoticoin = await ethers.getContract("Emoticoin", deployer);
  const emotilon = await ethers.getContract("Emotilon", deployer);

  await emoticoin.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
    gameAddress
  );

  await emotilon.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("HEALTH_ROLE")),
    gameAddress
  );

  await emotilon.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("COINS_ROLE")),
    gameAddress
  );

  await emotilon.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("KILL_ROLE")),
    gameAddress
  );

/*
  const eyelash = await deploy("Eyelash", {
    from: deployer,
    log: true,
  });

  const mustache = await deploy("Mustache", {
    from: deployer,
    log: true,
  });

  const contactLenses = await deploy("ContactLenses", {
    from: deployer,
    log: true,
  });

  await deploy("FancyLoogie", {
    from: deployer,
    args: [loogies.address],
    log: true,
  });

  const FancyLoogie = await ethers.getContract("FancyLoogie", deployer);
  await FancyLoogie.addNft(bow.address);
  await FancyLoogie.addNft(mustache.address);
  await FancyLoogie.addNft(contactLenses.address);
  await FancyLoogie.addNft(eyelash.address);
*/
  /*
    To take ownership of yourContract using the ownable library uncomment next line and add the 
    address you want to be the owner. 
    // yourContract.transferOwnership(YOUR_ADDRESS_HERE);

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

  // Verify your contracts with Etherscan
  // You don't want to verify on localhost
  /*
  if (chainId !== localChainId) {
    await run("verify:verify", {
      address: YourCollectible.address,
      contract: "contracts/YourCollectible.sol:YourCollectible",
      contractArguments: [],
    });
  }
  */
};
module.exports.tags = ["YourCollectible"];
