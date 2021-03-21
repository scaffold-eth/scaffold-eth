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
  },
  {
    img: 'https://www.nerjarob.com/nature/wp-content/uploads/2019/09/Barbet-Black-billed-10.jpg',
    name: 'Barbet Black Billed'
  },
  {
    img: 'https://www.nerjarob.com/nature/wp-content/uploads/2018/12/BrownBabbler-Nov-3.jpg',
    name: 'Brown Babbler'
  },
  {
    img: 'https://www.nerjarob.com/nature/wp-content/uploads/2018/01/Barbet-Double-toothed-1.jpg',
    name: 'Barbet Double Toothed'
  },
  {
    img: 'https://www.nerjarob.com/nature/wp-content/uploads/Little-Bee-Eater-2.jpg',
    name: 'Little Bee Eater'
  }
];

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




const bootstrapLocalData = async (
    goodTokenContract, 
    goodTokenFunds,
    numTokens) => {

    const accounts = await ethers.getSigners();
        
    for(let i = 0; i < numTokens; i++) {

        // creata dummy data
        const artistIdx = randomNumber(0, accounts.length)
        const artistAccount = accounts[artistIdx];
        
       
    
        
        const targetAccount = accounts[randomNumber(0, accounts.length)];
        const requiredBalance = randomNumber(500, 1000);
        
        const ownershipModel = (i % 2) === 0 ? 0 : 1;

        // deposit funds into the fund contract from the user
        const balance = requiredBalance + randomNumber(-300, 300);
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
        const price = ethers.constants.WeiPerEther.mul((i+ 1)).div(10);
        const targetFund = goodTokenFunds[i % goodTokenFunds.length];
        const fundName = await targetFund.name();
        const tokenMetadata = {
            "name": tokenName,
            "artist": artistAccount.address,
            "artistName": artistNames[artistIdx % artistNames.length],
            "description": "Ever seen a " + tokenName + "? They are amazing!. For the love of birds, one must fly. This token supports the " + fundName + ":)",
            "image": baseBird.img,
            "date": Date.now(),
            "price": price,
        }

        console.log(tokenMetadata);

        // pin metadata
        const pin = await ipfs.addJson(tokenMetadata);
        // pin revoked metadata
        tokenMetadata.image = revokedImg;
        const pinRevoked = await ipfs.addJson(tokenMetadata);
       
       
        // eslint-disable-next-line no-await-in-loop
    
        // add funds
        await targetFund.connect(targetAccount)
            .mint({value: balanceInWei}).then(tx => tx.wait);



        // eslint-disable-next-line no-await-in-loop
        const tx = await goodTokenContract.connect(artistAccount).createArtwork(
            pin.path,
            pinRevoked.path,
            ownershipModel,
            targetFund.address,
            ethers.constants.WeiPerEther.mul(requiredBalance).div(divisor),
            randomNumber(1, 1000),
            price
        );
    
        // eslint-disable-next-line no-await-in-loop
        await tx.wait();  

        if(targetAccount !== artistAccount && Math.random() > 0.5){
        // have random account purchase token
            const purchase = await goodTokenContract.connect(targetAccount)
            .buyArtwork(i, {value: price});

            await purchase.wait();
        }

    }
    await checkRevoked(goodTokenContract);
  }

  async function checkRevoked(goodTokenContract) {
      const numTokens = await goodTokenContract.totalSupply();
      for(let i = 0; i < numTokens; i++) {
          const isRevoked = await goodTokenContract.isRevoked(i);
          console.log(`Token ${i} is ${isRevoked ? 'revoked' : 'not revoked'}`);
      }
  }


  async function generateTokens(goodTokenAddress, goodTokenFunds){
      //const goodTokenAddress = "0xc5657b5f5F14811A231e1230DA9199e9510a0882";
      //const goodTokenFundAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
      const accounts = await ethers.getSigners();
      const goodTokenContract = new ethers.Contract(goodTokenAddress, goodTokenAbi, accounts[0]);
      await bootstrapLocalData(goodTokenContract, goodTokenFunds, 10);

  }

 // main();

module.exports = generateTokens