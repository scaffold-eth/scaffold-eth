/* eslint no-use-before-define: "warn" */
const hre = require("hardhat");
const ipfsApi = require('../../react-app/src/helpers/ipfsGraph');
const constants = require('../../react-app/src/constants');
const { config, ethers, tenderly, run } = require("hardhat");
const goodTokenAbi = require("../artifacts/contracts/GoodToken.sol/GoodToken.json").abi;


const graphDir = "../subgraph";

const theGraphNode = constants.THEGRAPH[hre.network.name === 'localhost' ? 'localhost' : 'hosted'].ipfsUri;
const ipfs = ipfsApi(theGraphNode)


const bootstrapLocalData = async (goodTokenContract, goodTokenFundAddress) => {
    // pin metadata
    const pin = await ipfs.addJson({
      "description": "Good Token IPFS test.", 
      "external_url": "https://openseacreatures.io/3", 
      "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png", 
      "name": "Good Token #0"
    })
  
  
    // creata dummy data
    const accounts = await ethers.getSigners();
    const artistAccount = accounts[1 % accounts.length];
    // whitelist artist
    await goodTokenContract.whitelistArtist(artistAccount.address, true);
    console.log("whitelisted artists");
  
    // generate sample tokens
    const numTokens = 10;
    
    const artworkUrl = pin.path
    const artworkRevokedUrl = pin.path
  
    const fundAddress = goodTokenFundAddress;
    let ownershipModel = 0;
    const balanceRequired = 10;
    const balanceDuration = 1000 * 60;
    let price = 1;
    for(let i = 0; i < numTokens; i++) {
      // eslint-disable-next-line no-await-in-loop
      const tx = await goodTokenContract.connect(artistAccount).createArtwork(
        artworkUrl,
        artworkRevokedUrl,
        ownershipModel,
        fundAddress,
        balanceRequired,
        balanceDuration,
        ethers.constants.WeiPerEther.mul(price)
      );
  
      // eslint-disable-next-line no-await-in-loop
      await tx.wait();
      
      price++;
      ownershipModel = (ownershipModel + 1) % 2;
    }
  }


  async function main(){
      const goodTokenAddress = "0xc5657b5f5F14811A231e1230DA9199e9510a0882";
      const goodTokenFundAddress = "0xc5657b5f5F14811A231e1230DA9199e9510a0882";
      const accounts = await ethers.getSigners();
      const goodTokenContract = new ethers.Contract(goodTokenAddress, goodTokenAbi, accounts[0]);
      bootstrapLocalData(goodTokenContract, goodTokenFundAddress);

  }

  main();