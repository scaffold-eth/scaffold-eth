/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");

const { createStorage } = require("../../react-app/src/storage");


const delayMS = 1000 //sometimes xDAI needs a 6000ms break lol 😅

const main = async () => {
  const storage = await createStorage()
  const storageId = storage.name === "akord" ? "Arweave id" : "IPFS hash"

  // ADDRESS TO MINT TO:
  const toAddress = "0x34aA3F359A9D614239015126635CE7732c18fDF3"

  console.log("\n\n 🎫 Minting to "+toAddress+"...\n");

  const { deployer } = await getNamedAccounts();
  const yourCollectible = await ethers.getContract("YourCollectible", deployer);

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
       },
       {
         "trait_type": "Stamina",
         "value": 42
       }
    ]
  }
  console.log("Uploading buffalo...")
  const uploaded = await storage.upload(JSON.stringify(buffalo), "buffalo.json")

  console.log(`Minting buffalo with ${storageId} (${uploaded.path})`)
  await yourCollectible.mintItem(toAddress,uploaded.path,{gasLimit:400000})


  await sleep(delayMS)


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
       },
       {
         "trait_type": "Stamina",
         "value": 38
       }
    ]
  }
  console.log("Uploading zebra...")
  const uploadedzebra = await storage.upload(JSON.stringify(zebra), "zebra.json")

  console.log(`Minting zebra with ${storageId} (${uploadedzebra.path})`)
  await yourCollectible.mintItem(toAddress,uploadedzebra.path,{gasLimit:400000})



  await sleep(delayMS)


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
       },
       {
         "trait_type": "Stamina",
         "value": 22
       }
    ]
  }
  console.log("Uploading rhino...")
  const uploadedrhino = await storage.upload(JSON.stringify(rhino), "rhino.json")

  console.log(`Minting rhino with ${storageId} (${uploadedrhino.path})`)
  await yourCollectible.mintItem(toAddress,uploadedrhino.path,{gasLimit:400000})



  await sleep(delayMS)


  const fish = {
    "description": "Is that an underbyte?",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": "https://austingriffith.com/images/paintings/fish.jpg",
    "name": "Fish",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "blue"
       },
       {
         "trait_type": "Eyes",
         "value": "googly"
       },
       {
         "trait_type": "Stamina",
         "value": 15
       }
    ]
  }
  console.log("Uploading fish...")
  const uploadedfish = await storage.upload(JSON.stringify(fish), "fish.json")

  console.log(`Minting fish with ${storageId} (${uploadedfish.path})`)
  await yourCollectible.mintItem(toAddress,uploadedfish.path,{gasLimit:400000})



  await sleep(delayMS)


  const flamingo = {
    "description": "So delicate.",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": "https://austingriffith.com/images/paintings/flamingo.jpg",
    "name": "Flamingo",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "black"
       },
       {
         "trait_type": "Eyes",
         "value": "googly"
       },
       {
         "trait_type": "Stamina",
         "value": 6
       }
    ]
  }
  console.log("Uploading flamingo...")
  const uploadedflamingo = await storage.upload(JSON.stringify(flamingo), "flamingo.json")

  console.log(`Minting flamingo with ${storageId} (${uploadedflamingo.path})`)
  await yourCollectible.mintItem(toAddress,uploadedflamingo.path,{gasLimit:400000})





  const godzilla = {
    "description": "Raaaar!",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": "https://austingriffith.com/images/paintings/godzilla.jpg",
    "name": "Godzilla",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "orange"
       },
       {
         "trait_type": "Eyes",
         "value": "googly"
       },
       {
         "trait_type": "Stamina",
         "value": 99
       }
    ]
  }
  console.log("Uploading godzilla...")
  const uploadedgodzilla = await storage.upload(JSON.stringify(godzilla), "godzilla.json")

  console.log(`Minting godzilla with ${storageId} (${uploadedgodzilla.path})`)
  await yourCollectible.mintItem(toAddress,uploadedgodzilla.path,{gasLimit:400000})




  await sleep(delayMS)

  console.log("Transferring Ownership of YourCollectible to "+toAddress+"...")

  await yourCollectible.transferOwnership(toAddress, { gasLimit: 400000 });

  await sleep(delayMS)

  /*


  console.log("Minting zebra...")
  await yourCollectible.mintItem("0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1","zebra.jpg")

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
