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
  const toAddress = "0x6Da074C23543144D865061EFC6Fd1bc72afCE82d"

  console.log("\n\n 🎫 Minting to "+toAddress+"...\n");

  const { deployer } = await getNamedAccounts();
  const yourCollectible = await ethers.getContract("YourCollectible", deployer);

  const mobile = {
    "description": "Mobile money",
    "external_url": "https://fuse.io/",// <-- this can link to a page for the specific file too
    "image": "https://ipfs.io/ipfs/Qma9ktzT3n9DFsV4vVdh7RDDrjNPxphajiyo2sgeJsWHKW/Fuse/mobile_money.png",
    "name": "Mobile",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "black"
       },
       {
         "trait_type": "Shape",
         "value": "circle"
        },
        {
          "trait_type": "Generation",
          "value": 0
        }
    ]
  }
  console.log("Uploading mobile...")
  const uploaded = await ipfs.add(JSON.stringify(mobile))

  console.log("Minting mobile with IPFS hash ("+uploaded.path+")")
  await yourCollectible.mintItem(toAddress,uploaded.path,{gasLimit:400000})


  await sleep(delayMS)


  const business = {
    "description": "Plug and Play",
    "external_url": "https://fuse.io/",// <-- this can link to a page for the specific file too
    "image": "https://ipfs.io/ipfs/Qma9ktzT3n9DFsV4vVdh7RDDrjNPxphajiyo2sgeJsWHKW/Fuse/business_tools.png",
    "name": "Business",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "black"
       },
       {
         "trait_type": "Shape",
         "value": "circle"
        },
        {
          "trait_type": "Generation",
          "value": 0
        }
    ]
  }
  console.log("Uploading business...")
  const uploadedbusiness = await ipfs.add(JSON.stringify(business))

  console.log("Minting business with IPFS hash ("+uploadedbusiness.path+")")
  await yourCollectible.mintItem(toAddress,uploadedbusiness.path,{gasLimit:400000})



  await sleep(delayMS)


  const scale = {
    "description": "Built for Scale",
    "external_url": "https://fuse.io/",// <-- this can link to a page for the specific file too
    "image": "https://ipfs.io/ipfs/Qma9ktzT3n9DFsV4vVdh7RDDrjNPxphajiyo2sgeJsWHKW/Fuse/paymets_network.png",
    "name": "Scale",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "black"
       },
       {
         "trait_type": "Shape",
         "value": "circle"
        },
        {
          "trait_type": "Generation",
          "value": 0
        }
    ]
  }
  console.log("Uploading scale...")
  const uploadedscale = await ipfs.add(JSON.stringify(scale))

  console.log("Minting scale with IPFS hash ("+uploadedscale.path+")")
  await yourCollectible.mintItem(toAddress,uploadedscale.path,{gasLimit:400000})



  await sleep(delayMS)


  const studio = {
    "description": "Fuse Studio",
    "external_url": "https://fuse.io/",// <-- this can link to a page for the specific file too
    "image": "https://ipfs.io/ipfs/Qma9ktzT3n9DFsV4vVdh7RDDrjNPxphajiyo2sgeJsWHKW/Fuse/fuse_studio.svg",
    "name": "Studio",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "black"
       },
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
  console.log("Uploading studio...")
  const uploadedstudio = await ipfs.add(JSON.stringify(studio))

  console.log("Minting studio with IPFS hash ("+uploadedstudio.path+")")
  await yourCollectible.mintItem(toAddress,uploadedstudio.path,{gasLimit:400000})



  await sleep(delayMS)


  const fwallet = {
    "description": "Fuse Wallet",
    "external_url": "https://fuse.io/",// <-- this can link to a page for the specific file too
    "image": "https://ipfs.io/ipfs/Qma9ktzT3n9DFsV4vVdh7RDDrjNPxphajiyo2sgeJsWHKW/Fuse/fuse_wallet.png",
    "name": "Wallet",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "black"
       },
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
  console.log("Uploading fwallet...")
  const uploadedfwallet = await ipfs.add(JSON.stringify(fwallet))

  console.log("Minting fwallet with IPFS hash ("+uploadedfwallet.path+")")
  await yourCollectible.mintItem(toAddress,uploadedfwallet.path,{gasLimit:400000})



  await sleep(delayMS)


  const fswap = {
    "description": "Fuse Swap",
    "external_url": "https://fuse.io/",// <-- this can link to a page for the specific file too
    "image": "https://ipfs.io/ipfs/Qma9ktzT3n9DFsV4vVdh7RDDrjNPxphajiyo2sgeJsWHKW/Fuse/fuse_swap.png",
    "name": "Swap",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "green"
       },
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
  console.log("Uploading fswap...")
  const uploadedfswap = await ipfs.add(JSON.stringify(fswap))

  console.log("Minting fswap with IPFS hash ("+uploadedfswap.path+")")
  await yourCollectible.mintItem(toAddress,uploadedfswap.path,{gasLimit:400000})



  await sleep(delayMS)


  const fuse = {
    "description": "Fuse Infrastructure",
    "external_url": "https://fuse.io/",// <-- this can link to a page for the specific file too
    "image": "https://ipfs.io/ipfs/Qma9ktzT3n9DFsV4vVdh7RDDrjNPxphajiyo2sgeJsWHKW/Fuse/fuse.png",
    "name": "Fuse",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "black"
       },
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
  console.log("Uploading fuse...")
  const uploadedfuse = await ipfs.add(JSON.stringify(fuse))

  console.log("Minting fuse with IPFS hash ("+uploadedfuse.path+")")
  await yourCollectible.mintItem(toAddress,uploadedfuse.path,{gasLimit:400000})



  await sleep(delayMS)


  const gooddollar = {
    "description": "Good Dollar",
    "external_url": "https://www.gooddollar.org/",// <-- this can link to a page for the specific file too
    "image": "https://ipfs.io/ipfs/Qma9ktzT3n9DFsV4vVdh7RDDrjNPxphajiyo2sgeJsWHKW/Fuse/gooddollar.png",
    "name": "GoodDollar",
    "attributes": [
       {
         "trait_type": "BackgroundColor",
         "value": "blue"
       },
       {
         "trait_type": "Shape",
         "value": "circle"
       },
       {
         "trait_type": "Generation",
         "value": 0
       }
    ]
  }
  console.log("Uploading gooddollar...")
  const uploadedgooddollar = await ipfs.add(JSON.stringify(gooddollar))

  console.log("Minting gooddollar with IPFS hash ("+uploadedgooddollar.path+")")
  await yourCollectible.mintItem(toAddress,uploadedgooddollar.path,{gasLimit:400000})


  await sleep(delayMS)

  console.log("Transferring Ownership of YourCollectible to "+toAddress+"...")

  await yourCollectible.transferOwnership(toAddress)

  await sleep(delayMS)

  /*


  console.log("Minting business...")
  await yourCollectible.mintItem("0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1","business.jpg")

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
