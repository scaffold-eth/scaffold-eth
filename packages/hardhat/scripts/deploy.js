/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers, tenderly, run } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const hre = require("hardhat");
const ipfsApi = require('../../react-app/src/helpers/ipfsGraph');
const constants = require('../../react-app/src/constants');
const generateTokens = require('./mintTestTokens');
const { feedData, fundData } = require('./feedData');
const erc20 = require('./erc20Helpers');
const goodDataFeedAbi = require('../artifacts/contracts/GoodDataFeed.sol/GoodDataFeed.json').abi;
const graphDir = "../subgraph";

const theGraphNode = constants.THEGRAPH[hre.network.name === 'localhost' ? 'localhost' : 'hosted'].ipfsUri;
const ipfs = ipfsApi(theGraphNode)

function publishNetwork() {
  const graphConfigPath = `${graphDir}/config/config.json`
  let graphConfig
  try {
    if (fs.existsSync(graphConfigPath)) {
      graphConfig = fs
        .readFileSync(graphConfigPath)
        .toString();
    } else {
      graphConfig = '{}'
    }
  } catch (e) {
    console.log(e)
  }
  graphConfig = JSON.parse(graphConfig)
  graphConfig.network = hre.network.name
  const folderPath = graphConfigPath.replace("/config.json","")
  if (!fs.existsSync(folderPath)){
    fs.mkdirSync(folderPath);
  }
  fs.writeFileSync(
    graphConfigPath,
    JSON.stringify(graphConfig, null, 2)
  ); 
}

async function verifyContract(addr, constructorArgs){
  await run("verify:verify", {
    address: addr,
    constructorArguments: constructorArgs
  });
}


async function deployGoodDataFeed() {
  const goodDataFeed = await deploy("GoodDataFeed");
  await goodDataFeed.deployed();
  // Register apis
  for(let i = 0; i < feedData.length; i++) {
    const feed = feedData[i];
    const exists = await goodDataFeed.feedExists(feed.symbol);
    if(!exists) {
      await goodDataFeed.registerApi(
        feed.symbol,
        feed.apiUrl,
        feed.apiValueParseMap,
        feed.name,
        feed.description,
        feed.yearOffset
      ).then(tx => tx.wait);
    }
  }
  const accounts = await ethers.getSigners();
  // try and transfer link to contract and to update feeds if not localhost
  if(hre.network.name !== 'localhost') {
    const lnkAddress = constants.LINK_ADDRESS[hre.network.name];
    try{  
      const lnkContract = erc20(lnkAddress);
      console.log('Funding dada feed with LINK');
      const tx = await lnkContract.connect(accounts[0]).transfer(
        goodDataFeed.address,
        ethers.constants.WeiPerEther.mul(1)
      );
      await tx.wait();

      console.log('requesting latest data');
      // update feeds for each 
      for(let i = 0; i < feedData.length; i++) {
        await goodDataFeed.connect(accounts[0]).requestLatestFeedData(feedData[i].symbol);
      }
    }catch (e){
      console.log(e);
    }
  }

  return goodDataFeed;
}

async function deployGoodTokenFund(dataFeedContract) {
  const goodTokenFund = await deploy("GoodTokenFund", [dataFeedContract.address]);
  await goodTokenFund.deployed();

  // for now set beneficiary as main account
  const accounts = await ethers.getSigners();
  const beneficiary = accounts[0].address;
  // add in feeds
  for(let i = 0; i < fundData.length; i++) {
    const fund = fundData[i];

    // push fund metadata to ipfs
    const fundCid = await ipfs.addJson(fund);

    await goodTokenFund.createNewToken(
      beneficiary, // for now just account as beneficiary
      fund.symbol,
      fund.targetFeedId,
      fundCid.path,
      ethers.BigNumber.from(10).pow(18).mul(fund.rangeMin),
      ethers.BigNumber.from(10).pow(18).mul(fund.rangeMax)
    ).then(tx => tx.wait)
  }

  return goodTokenFund;
}


const main = async () => {

  console.log("\n\n 📡 Deploying...\n");
  
  // Deploy the GoodDataFeed contract
  const goodDataFeed = await deployGoodDataFeed();
  await goodDataFeed.deployed();

  // // const yourContract = await deploy("YourContract") // <-- add in constructor args like line 19 vvvv
  const goodToken = await deploy("GoodToken") // <-- add in constructor args like line 19 vvvv
  await goodToken.deployed();
  const gTx = goodToken.deployTransaction;
  await gTx.wait();
  // Deploy the GoodTokenFund contract
  const goodTokenFund = await deployGoodTokenFund(goodDataFeed);

  // console.log(hre.network);
  publishNetwork();

  // verify contracts


  console.log('NETWORK NAME: ' + hre.network.name)

  // create test tokens!
  await generateTokens(goodToken.address, goodTokenFund.address);


  if(hre.network.name === 'localhost') {
    //await bootstrapLocalData(goodToken, goodTokenFund)
  } else {
    //await bootstrapLocalData(goodToken, goodTokenFund)
    await verifyContract(goodToken.address);
    await verifyContract(goodDataFeed.address);
    await verifyContract(goodTokenFund.address, [goodDataFeed.address]);
  }




  //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  //const secondContract = await deploy("SecondContract")

  // const exampleToken = await deploy("ExampleToken")
  // const examplePriceOracle = await deploy("ExamplePriceOracle")
  // const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])

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


  //If you want to verify your contract on tenderly.co (see setup details in the scaffold-eth README!)
  /*
  await tenderlyVerify(
    {contractName: "YourContract",
     contractAddress: yourContract.address
  })
  */

  // If you want to verify your contract on etherscan
  /*
  console.log(chalk.blue('verifying on etherscan'))
  await run("verify:verify", {
    address: yourContract.address,
    // constructorArguments: args // If your contract has constructor arguments, you can pass them as an array
  })
  */

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );
};

const deploy = async (contractName, _args = [], overrides = {}, libraries = {}) => {
  console.log(` 🛰  Deploying: ${contractName}`);

  const contractArgs = _args || [];
  const contractArtifacts = await ethers.getContractFactory(contractName,{libraries: libraries});
  const deployed = await contractArtifacts.deploy(...contractArgs, overrides);
  const encoded = abiEncodeArgs(deployed, contractArgs);
  fs.writeFileSync(`artifacts/${contractName}.address`, deployed.address);

  let extraGasInfo = ""
  if(deployed&&deployed.deployTransaction){
    const gasUsed = deployed.deployTransaction.gasLimit.mul(deployed.deployTransaction.gasPrice)
    extraGasInfo = `${utils.formatEther(gasUsed)} ETH, tx hash ${deployed.deployTransaction.hash}`
  }

  console.log(
    " 📄",
    chalk.cyan(contractName),
    "deployed to:",
    chalk.magenta(deployed.address)
  );
  console.log(
    " ⛽",
    chalk.grey(extraGasInfo)
  );

  await tenderly.persistArtifacts({
    name: contractName,
    address: deployed.address
  });

  if (!encoded || encoded.length <= 2) return deployed;
  fs.writeFileSync(`artifacts/${contractName}.args`, encoded.slice(2));

  return deployed;
};


// ------ utils -------

// abi encodes contract arguments
// useful when you want to manually verify the contracts
// for example, on Etherscan
const abiEncodeArgs = (deployed, contractArgs) => {
  // not writing abi encoded args if this does not pass
  if (
    !contractArgs ||
    !deployed ||
    !R.hasPath(["interface", "deploy"], deployed)
  ) {
    return "";
  }
  const encoded = utils.defaultAbiCoder.encode(
    deployed.interface.deploy.inputs,
    contractArgs
  );
  return encoded;
};

// checks if it is a Solidity file
const isSolidity = (fileName) =>
  fileName.indexOf(".sol") >= 0 && fileName.indexOf(".swp") < 0 && fileName.indexOf(".swap") < 0;

const readArgsFile = (contractName) => {
  let args = [];
  try {
    const argsFile = `./contracts/${contractName}.args`;
    if (!fs.existsSync(argsFile)) return args;
    args = JSON.parse(fs.readFileSync(argsFile));
  } catch (e) {
    console.log(e);
  }
  return args;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// If you want to verify on https://tenderly.co/
const tenderlyVerify = async ({contractName, contractAddress}) => {

  let tenderlyNetworks = ["kovan","goerli","mainnet","rinkeby","ropsten","matic","mumbai","xDai","POA"]
  let targetNetwork = process.env.HARDHAT_NETWORK || config.defaultNetwork

  if(tenderlyNetworks.includes(targetNetwork)) {
    console.log(chalk.blue(` 📁 Attempting tenderly verification of ${contractName} on ${targetNetwork}`))

    await tenderly.persistArtifacts({
      name: contractName,
      address: contractAddress
    });

    let verification = await tenderly.verify({
        name: contractName,
        address: contractAddress,
        network: targetNetwork
      })

    return verification
  } else {
      console.log(chalk.grey(` 🧐 Contract verification not supported on ${targetNetwork}`))
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
