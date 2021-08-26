/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

const delayMS = 8000 //sometimes Fuse needs a 8000ms break lol 😅

const main = async () => {

  // ADDRESS TO MINT TO:
  const toAddress = "0xD91e3B39189f643732C0686291D4742ebB487b5d"

  console.log("\n\n 🎫 Minting to "+toAddress+"...\n");

  const { deployer } = await getNamedAccounts();
  const mishaCollectible = await ethers.getContract("MishaCollectible", deployer);

  const fuseassembly = {
    "description": "FUSE Assembly",
    "external_url": "https://forum.fuse.io/",// <-- this can link to a page for the specific file too
    "image": "https://ipfs.io/ipfs/QmaUXuiKcaPSAFbBvzb3n6G9BqjYUDnjiimMg4rrVcsLr7/Fuse%20Assembly%20%20logos%20%281%29/2.jpg",
    "name": "Anonymous",
    "attributes": [
       {
         "trait_type": "Shape",
         "value": "square"
       },
       {
         "trait_type": "Generation",
         "value": 0
       }
    ]
  }
  console.log("Uploading FUSE Assembly...")
  const uploadedfuseassembly = await ipfs.add(JSON.stringify(fuseassembly))

  console.log("Minting FUSE Assembly with IPFS hash ("+uploadedfuseassembly.path+")")
  await mishaCollectible.mintItem(toAddress,uploadedfuseassembly.path,{gasLimit:400000})

  await sleep(delayMS)

  console.log("Transferring Ownership of MishaCollectible to "+toAddress+"...")

  await mishaCollectible.transferOwnership(toAddress)

  await sleep(delayMS)

  /*


  console.log("Minting business...")
  await mishaCollectible.mintItem("0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1","business.jpg")

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
