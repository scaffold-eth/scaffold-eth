const { ethers, upgrades } = require("hardhat");

// Plug in the address of the contract you want to upgrade
const YourContractAddress = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82";

async function main() {
  const YourContractV2Factory = await ethers.getContractFactory(
    "YourContractV2"
  );
  await upgrades.upgradeProxy(YourContractAddress, YourContractV2Factory);
  console.log("Contract upgraded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
