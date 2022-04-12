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

  const loogieCoin = await deploy("LoogieCoin", {
    from: deployer,
    log: true,
  });

  const metadata = await deploy("LoogieShipMetadata", {
    from: deployer,
    log: true,
  });

  const render = await deploy("LoogieShipRender", {
    from: deployer,
    log: true,
  });

  const loogieShip = await deploy("LoogieShip", {
    from: deployer,
    args: [
      "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
      "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
      "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
      loogieCoin.address,
    ],
    libraries: {
      LoogieShipMetadata: metadata.address,
      LoogieShipRender: render.address,
    },
    log: true,
  });

  const LoogieCoin = await ethers.getContract("LoogieCoin", deployer);

  await LoogieCoin.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
    loogieShip.address
  );

  const award1Render = await deploy("SailorLoogiesGameAward1Render", {
    from: deployer,
    log: true,
  });

  const award2Render = await deploy("SailorLoogiesGameAward2Render", {
    from: deployer,
    log: true,
  });

  const award3Render = await deploy("SailorLoogiesGameAward3Render", {
    from: deployer,
    log: true,
  });

  const sailorLoogiesGameAward = await deploy("SailorLoogiesGameAward", {
    from: deployer,
    libraries: {
      SailorLoogiesGameAward1Render: award1Render.address,
      SailorLoogiesGameAward2Render: award2Render.address,
      SailorLoogiesGameAward3Render: award3Render.address,
    },
    log: true,
  });

  const SailorLoogiesGameAward = await ethers.getContract(
    "SailorLoogiesGameAward",
    deployer
  );

  const sailorLoogiesGame = await deploy("SailorLoogiesGame", {
    from: deployer,
    args: [
      1648751958,
      loogieShip.address,
      loogieCoin.address,
      "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
      "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
      "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
      SailorLoogiesGameAward.address,
    ],
    log: true,
  });

  await LoogieCoin.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
    sailorLoogiesGame.address
  );

  await LoogieCoin.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("BURNER_ROLE")),
    sailorLoogiesGame.address
  );

  await SailorLoogiesGameAward.grantRole(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE")),
    sailorLoogiesGame.address
  );

  /*
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
module.exports.tags = ["LoogieShip"];
