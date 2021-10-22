/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

const main = async () => {

  let allAssets = {}

  console.log("\n\n Loading artwork.json...\n");
  const artwork = JSON.parse(fs.readFileSync("../../artwork.json").toString())

  for(let a in artwork){
    console.log("  Uploading "+artwork[a].name+"...")
    const stringJSON = JSON.stringify(artwork[a])
    const uploaded = await ipfs.add(stringJSON)
    console.log("   "+artwork[a].name+" ipfs:",uploaded.path)
    allAssets[uploaded.path] = artwork[a]
  }

  console.log("\n Injecting assets into the frontend...")
  const finalAssetFile = "export default "+JSON.stringify(allAssets)+""
  fs.writeFileSync("../react-app/src/assets.js",finalAssetFile)
  fs.writeFileSync("./uploaded.json",JSON.stringify(allAssets))



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
