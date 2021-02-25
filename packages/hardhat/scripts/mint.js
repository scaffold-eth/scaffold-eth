/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

const main = async () => {

  const toAddress = "0x6F8b07a67d45FC8F40907eEFCd3A3C82C888b206"

  console.log("\n\n 🎫 Minting to "+toAddress+"...\n");

  const yourCollectible = await ethers.getContractAt('YourCollectible', fs.readFileSync("./artifacts/YourCollectible.address").toString())


  const buffalo = {
    "description": "It's actually a bison?",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": "https://austingriffith.com/images/paintings/buffalo.jpg",
    "name": "Buffalo",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "green"
       },
       {
         "trait_type": "Eyes",
         "value": "googly"
       }
    ]
  }
  console.log("Uploading buffalo...")
  const uploaded = await ipfs.add(JSON.stringify(buffalo))

  console.log("Minting buffalo with IPFS hash ("+uploaded.path+")")
  await yourCollectible.mintItem(toAddress,uploaded.path,{gasLimit:400000})


  await sleep(10000)


  const zebra = {
    "description": "What is it so worried about?",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": "https://austingriffith.com/images/paintings/zebra.jpg",
    "name": "Zebra",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "blue"
       },
       {
         "trait_type": "Eyes",
         "value": "googly"
       }
    ]
  }
  console.log("Uploading zebra...")
  const uploadedzebra = await ipfs.add(JSON.stringify(zebra))

  console.log("Minting zebra with IPFS hash ("+uploadedzebra.path+")")
  await yourCollectible.mintItem(toAddress,uploadedzebra.path,{gasLimit:400000})



    await sleep(10000)


    const rhino = {
      "description": "What a horn!",
      "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
      "image": "https://austingriffith.com/images/paintings/rhino.jpg",
      "name": "Rhino",
      "attributes": [
         {
           "trait_type": "BackgroundColor",
           "value": "pink"
         },
         {
           "trait_type": "Eyes",
           "value": "googly"
         }
      ]
    }
    console.log("Uploading rhino...")
    const uploadedrhino = await ipfs.add(JSON.stringify(rhino))

    console.log("Minting rhino with IPFS hash ("+uploadedrhino.path+")")
    await yourCollectible.mintItem(toAddress,uploadedrhino.path,{gasLimit:400000})


  /*


  console.log("Minting zebra...")
  await yourCollectible.mintItem("0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1","zebra.jpg")


  console.log("Giving up Ownership...")
  await yourCollectible.transferOwnership("0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1")
  */


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

};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
