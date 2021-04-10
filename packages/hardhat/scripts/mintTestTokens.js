/* eslint no-use-before-define: "warn" */
const hre = require("hardhat");
const ipfsApi = require('../../react-app/src/helpers/ipfsGraph');
const constants = require('../../react-app/src/constants');
const { ethers, tenderly, run } = require("hardhat");
const goodTokenAbi = require("../artifacts/contracts/GoodToken.sol/GoodToken.json").abi;
const goodTokenFundAbi = require("../artifacts/contracts/GoodTokenFund.sol/GoodTokenFund.json").abi;
const fs = require('fs');

const { fundData } = require('./feedData');
const testTokenData = require('./testTokenData');

//fs.readSync("../artifacts/contracts/GoodToken"))

const graphDir = "../subgraph";

const theGraphNode = constants.THEGRAPH[hre.network.name === 'localhost' ? 'localhost' : 'hosted'].ipfsUri;
const ipfs = ipfsApi(theGraphNode)

function randomNumber(min, max){
    const r = Math.random()*(max-min) + min
    return Math.floor(r)
}

const nameAddons = [
    'Spunky',
    'Funky',
    'Rad',
    'Chipry',
    'Peckish',
    'Hyper',
    'Squishy',
    'Fluffy',
    'Angry',
    'Happy',
    'Funny'
]

const artistNames = [
    "Jasper",
    "Birdman",
    "Barak",
    "WingDing",
    "FlyinHigh",
    "BadBird"
]

const revokedImg = 'http://clipartmag.com/images/big-bird-clipart-24.png';




const mintTestTokens = async (
    accounts,
    goodTokenContract, 
    goodTokenFundContract) => {

    for(let i = 0; i < testTokenData.length; i++) {

        // creata dummy data
        const artistIdx = randomNumber(0, accounts.length)
        const artistAccount = accounts[artistIdx];    
        
        const targetAccount = accounts[randomNumber(0, accounts.length)];
        
        const tokenData = testTokenData[i];
        const requiredBalance = tokenData.balanceRequirement;
        const ownershipModel = tokenData.ownershipModel;

        // generate metadata
        const tokenName = tokenData.name;
        const price = ethers.constants.WeiPerEther.mul((i+ 1)).div(10);
        const targetFund = fundData[i % fundData.length];
        const targetFeedTokenId = (i % fundData.length) + 1; // 1 indexed
        const fundName = targetFund.name
        const fundSymbol = targetFund.symbol;
        const tokenMetadata = {
            "name": tokenName,
            "artist": artistAccount.address,
            "artistName": tokenData.artistName,
            "description": `${tokenData.description} This token supports the ${fundName}.`,
            "image": tokenData.img,
            "date": Date.now(),
            "price": price,
            "fundName": fundName,
            "fundSymbol": fundSymbol,
            "attributes": [
                {
                    "trait_type": "Fund Supported",
                    "value": fundName
                }
            ]
        }

        // pin metadata
        const pin = await ipfs.addJson(tokenMetadata);
        // pin revoked metadata
        tokenMetadata.description = `This artwork has been revoked from the owner! Please visit the GoodTokens website for information on how to buy this artwork. ${tokenMetadata.description}`;
        const pinRevoked = await ipfs.addJson(tokenMetadata);
       
        // deposit funds into the fund contract from the user
        const balanceExchange = ethers.BigNumber.from(10).pow(16);
    
        
        // eslint-disable-next-line no-await-in-loop
        const tx = await goodTokenContract.connect(artistAccount).createArtwork(
            pin.path,
            pinRevoked.path,
            ownershipModel,
            goodTokenFundContract.address,
            targetFeedTokenId,
            balanceExchange.mul(tokenData.balanceRequirement),
            randomNumber(1, 30),
            price
            );
            
            // eslint-disable-next-line no-await-in-loop
            await tx.wait();  
            
        // add funds
        // await goodTokenFundContract.connect(targetAccount)
        //   .mintFeedToken(fundSymbol, i, {value: balanceInWei}).then(tx => tx.wait);
        
        if(targetAccount !== artistAccount && Math.random() > 0.5){
        // have random account purchase token
            const purchase = await goodTokenContract.connect(targetAccount)
            .buyArtwork(i, {value: price});

            await purchase.wait();
        }

    }
    //await checkRevoked(goodTokenContract);
  }

  async function checkRevoked(goodTokenContract) {
      const numTokens = await goodTokenContract.totalSupply();
      for(let i = 0; i < numTokens; i++) {
          const isRevoked = await goodTokenContract.isRevoked(i);
          console.log(`Token ${i} is ${isRevoked ? 'revoked' : 'not revoked'}`);
      }
  }


  async function generateTokens(goodTokenAddress, goodTokenFundAddress){
      //const goodTokenAddress = "0xc5657b5f5F14811A231e1230DA9199e9510a0882";
      //const goodTokenFundAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
      const accounts = await ethers.getSigners();
      
      const goodTokenContract = new ethers.Contract(goodTokenAddress, goodTokenAbi, accounts[0]);
      const goodTokenFundContract = new ethers.Contract(goodTokenFundAddress, goodTokenFundAbi, accounts[0]);
      await mintTestTokens(accounts, goodTokenContract, goodTokenFundContract);

  }

 // main();

module.exports = generateTokens