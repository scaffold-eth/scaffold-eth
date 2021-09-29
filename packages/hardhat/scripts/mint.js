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

  const name = "Whole Earth Catalog (Aging)"
  const desc = "This Whole Earth Catalog NFT slowly ages over time so that it looks like the aged artifact of today. Over the next 100 years, this generative art project will reward patience and long term thinking. On a dozen intervaled Earth Days (starting April 22nd 2022) over the next 100 years, The NFT will generate new Whole Earth Catalog cover in your wallet.  For the next century, this NFT will continually morph into new and surprising animated versions of the Catalog, capturing the spirit of Stewart’s original publication, and conferring value to the artpiece for the next century. Can you think long term? If so, this one's for you."

  let files = await fs.readdirSync("./Loops")

  console.log("uploading",files.length,"files")

  let ages = []

  for(let f in files){
    console.log("uploading file:",files[f])
    const uploaded = await ipfs.add(fs.readFileSync("./Loops/"+files[f]))
    console.log("uploaded",uploaded)

    const manifest = {
      "name": name,
      "description": desc,
      //"external_url": "https://www.weareasgods.film/3",// <-- this can link to a page for the specific file too
      "image": "https://ipfs.io/ipfs/"+uploaded.path,
      /*"attributes": [
        {
          "trait_type": "year",
          "value": 2021
        }
      ]*/
    }

    console.log("manifest",manifest)
    const manifestUpload = await ipfs.add(JSON.stringify(manifest))

    console.log("manifestUpload",manifestUpload)
    //ages
    ages.push(manifestUpload.path)
  }

  console.log("AGES",ages)


/*
  // ADDRESS TO MINT TO:
  const toAddress = "0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1"

  console.log("\n\n 🎫 Minting to "+toAddress+"...\n");

  const yourCollectible = await ethers.getContractAt('YourCollectible', fs.readFileSync("./artifacts/YourCollectible.address").toString())

  console.log(" 🛰 Uploading ghostCoinOn to IPFS...")
  const coinOnImage = await ipfs.add(fs.readFileSync("../../packages/react-app/public/ghostCoinOn.png"))

  console.log(" 🔖 "+coinOnImage.path)

  console.log(" 🛰 Uploading ghostCoinOff to IPFS...")
  const coinOffImage = await ipfs.add(fs.readFileSync("../../packages/react-app/public/ghostCoinOff.png"))

  console.log(" 🔖 "+coinOffImage.path)



  const coinOnManifest = {
    "description": "The GhostedCoin is an example of swapping out the tokenURI in the smart contract. Currently, the coin is 'on'!",
    "external_url": "https://github.com/austintgriffith/scaffold-eth",// <-- this can link to a page for the specific file too
    "image": "https://ipfs.io/ipfs/"+coinOnImage.path,
    "name": "GhostedCoin",
    "attributes": [
      {
        "trait_type": "Ghosted",
        "value": false
      },
      {
        "trait_type": "brightness",
        "value": 10
      },
      {
       "trait_type": "BackgroundColor",
       "value": "blueCheckered"
      },
      {
       "trait_type": "CoinColor",
       "value": "Cyan"
      }
    ]
  }

  console.log("Uploading coinOnManifest...")
  const uploadedCoinOn = await ipfs.add(JSON.stringify(coinOnManifest))

  let coinOffManifest = coinOnManifest

  coinOffManifest.description = "The GhostedCoin is an example of swapping out the tokenURI in the smart contract. Currently, the coin is 'off'!"
  coinOffManifest.image = "https://ipfs.io/ipfs/"+coinOffImage.path,
  coinOffManifest.attributes[0].value = true;//ghosted
  coinOffManifest.attributes[1].value = 0;//brightness

  console.log("Uploading coinOffManifest...")
  const uploadedCoinOff = await ipfs.add(JSON.stringify(coinOffManifest))

  console.log("Minting GhostedToken with IPFS hashes ("+uploadedCoinOn.path+","+uploadedCoinOff.path+")")
  let result = await yourCollectible.mintItem(toAddress,uploadedCoinOn.path,uploadedCoinOff.path,{gasLimit:1000000})

  console.log("result",result)

  //await sleep(delayMS)

  console.log("Transferring Ownership of YourCollectible to "+toAddress+"...")

  await yourCollectible.transferOwnership(toAddress)

  //await sleep(delayMS)
*/
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
