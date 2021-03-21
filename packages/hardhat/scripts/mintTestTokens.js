/* eslint no-use-before-define: "warn" */
const hre = require("hardhat");
const ipfsApi = require('../../react-app/src/helpers/ipfsGraph');
const constants = require('../../react-app/src/constants');
const { config, ethers, tenderly, run } = require("hardhat");
const goodTokenAbi = require("../artifacts/contracts/GoodToken.sol/GoodToken.json").abi;
const goodFundAbi = require("../artifacts/contracts/GoodTokenFund.sol/GoodTokenFund.json").abi;
const fs = require('fs');

//fs.readSync("../artifacts/contracts/GoodToken"))

const graphDir = "../subgraph";

const theGraphNode = constants.THEGRAPH[hre.network.name === 'localhost' ? 'localhost' : 'hosted'].ipfsUri;
const ipfs = ipfsApi(theGraphNode)

function randomNumber(min, max){
    const r = Math.random()*(max-min) + min
    return Math.floor(r)
}


const imgListings = [
  { 
    img: 'https://www.nerjarob.com/nature/wp-content/uploads/African-Wattled-Lapwing-2015-17.jpg',
    name: 'African Wattler'
  },
  {
    img: 'https://www.nerjarob.com/nature/wp-content/uploads/New-Guinea-Masked-Lapwing-5.jpg',
    name: 'Masked Lapwig'
  },
  {
    img: 'https://www.nerjarob.com/nature/wp-content/uploads/Lapwing-MGL-2-sized.jpg',
    name: 'Northern Lapwig'
  },
  {
    img: 'https://www.nerjarob.com/nature/wp-content/uploads/Spur-winged-Lapwing-11.jpg',
    name: 'Spur-winged-Lapwing'
  },
  {
    img: 'https://www.nerjarob.com/nature/wp-content/uploads/2016/03/Linnet-March30th-2.jpg',
    name: 'Linnet'
  },
  {
    img: 'https://www.nerjarob.com/nature/wp-content/uploads/2016/11/Bird-Castellar-5.jpg',
    name: 'Bird-Castellar'
  }
];

const nameAddons = [
    'Spunky',
    'Funky',
    'Rad',
    'Chipry',
    'Peckish',
    'Hyper'
]

const revokedImg = 'http://clipartmag.com/images/big-bird-clipart-24.png';




const bootstrapLocalData = async (
    goodTokenContract, 
    goodTokenFundContract,
    numTokens) => {

        
    for(let i = 0; i < numTokens; i++) {

        // creata dummy data
        const accounts = await ethers.getSigners();
        const artistAccount = accounts[1 % accounts.length];
    
       
    
        
        const targetAccount = accounts[randomNumber(0, accounts.length)];
        const requiredBalance = randomNumber(500, 1000);
        
        const ownershipModel = (i % 2) === 0 ? 0 : 1;

        // deposit funds into the fund contract from the user
        const balance = requiredBalance - randomNumber(-300, 300);
        const divisor = 100;
        const balanceInWei = ethers.constants.WeiPerEther.mul(balance.toString()).div(divisor);
        // eslint-disable-next-line no-await-in-loop
        
        // const artworkMetadata = {
        //     artist: address,
        //     "artistName": artistName,
        //     name: artworkTitle,
        //     description: artworkDescription,
        //     image: artworkUrl,
        //     date: Date.now(),
        //     price: priceInWei.toString(),
        //   };

        // generate metadata
        const baseBird = imgListings[i % imgListings.length];
        const tokenName = nameAddons[randomNumber(0, nameAddons.length)] + ' ' + baseBird.name;
        const price = ethers.constants.WeiPerEther.mul(i).div(10);
        const tokenMetadata = {
            "name": tokenName,
            "artist": artistAccount.address,
            "artistName": "Birdman",
            "description": "For the love of birds, one must fly.",
            "image": baseBird.img,
            "date": Date.now(),
            "price": price
        }

        // pin metadata
        const pin = await ipfs.addJson(tokenMetadata);
        // pin revoked metadata
        tokenMetadata.image = revokedImg;
        const pinRevoked = await ipfs.addJson(tokenMetadata);
       
       
        // eslint-disable-next-line no-await-in-loop
    
        // add funds
        await goodTokenFundContract.connect(targetAccount)
            .mint({value: balanceInWei}).then(tx => tx.wait);



        // eslint-disable-next-line no-await-in-loop
        const tx = await goodTokenContract.connect(artistAccount).createArtwork(
            pin.path,
            pinRevoked.path,
            ownershipModel,
            goodTokenFundContract.address,
            ethers.constants.WeiPerEther.mul(requiredBalance).div(divisor),
            randomNumber(1, 1000),
            price
        );
    
        // eslint-disable-next-line no-await-in-loop
        await tx.wait();  

        
        // have random account purchase token
        const purchase = await goodTokenContract.connect(targetAccount)
            .buyArtwork(i, {value: price});

        await purchase.wait();



    }
  }


  async function generateTokens(goodTokenAddress, goodTokenFundAddress){
      //const goodTokenAddress = "0xc5657b5f5F14811A231e1230DA9199e9510a0882";
      //const goodTokenFundAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
      const accounts = await ethers.getSigners();
      const goodTokenContract = new ethers.Contract(goodTokenAddress, goodTokenAbi, accounts[0]);
      const goodTokenFundContract = new ethers.Contract(goodTokenFundAddress, goodFundAbi, accounts[0]);
      await bootstrapLocalData(goodTokenContract, goodTokenFundContract, 30);

  }

 // main();

module.exports = generateTokens