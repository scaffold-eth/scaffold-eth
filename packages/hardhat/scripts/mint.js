/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

const delayMS = 1000 //sometimes xDAI needs a 6000ms break lol 😅

const main = async () => {

  // ADDRESS TO MINT TO:
  const toAddress = "0x8760Db2223686B352D4993DEb77A47982C502992"

  console.log("\n\n 🎫 Minting to "+toAddress+"...\n");

  const { deployer } = await getNamedAccounts();
  const yourCollectible = await ethers.getContract("YourCollectible", deployer);

  await yourCollectible.mint(toAddress,0,4, [],{gasLimit:400000})
  await yourCollectible.mint(toAddress,1,10, [],{gasLimit:400000})
  await yourCollectible.mint(toAddress,2,2, [],{gasLimit:400000})
  await yourCollectible.mint(toAddress,3,5, [],{gasLimit:400000})
  await yourCollectible.mint(toAddress,4,6, [],{gasLimit:400000})
  await yourCollectible.mint(toAddress,5,1, [],{gasLimit:400000})

  await sleep(delayMS)

  // console.log("Transferring Ownership of YourCollectible to "+toAddress+"...")

  // await yourCollectible.transferOwnership(toAddress)

  // await sleep(delayMS)

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
