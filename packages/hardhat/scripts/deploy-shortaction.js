// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.

  // We get the contract to deploy
  const ShortAction = await hre.ethers.getContractFactory('ShortOTokenActionWithSwap');
  const shortAction = await ShortAction.deploy(
    '0x7be599509B43A3A01A8b1b3BF1862Af0997366A4', // vault
    '0xd0a1e359811322d97991e03f863a0c30c2cf029c', // asset
    '0x79fb4604f2D7bD558Cda0DFADb7d61D98b28CA9f', // swap
    '0x9164eb40a1b59512f1803ab4c2d1de4b89627a93', // whitelist
    '0xdee7d0f8ccc0f7ac7e45af454e5e7ec1552e8e4e', // controller
    0 // vault type
  );

  await shortAction.deployed();

  console.log('ShortAction contract deployed at:', shortAction.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
