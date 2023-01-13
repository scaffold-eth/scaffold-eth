const { ethers, upgrades } = require("hardhat");

// Plug in the address of the contract you want to upgrade
const YourContractAddress = "0x09635F643e140090A9A8Dcd712eD6285858ceBef";

async function main() {
  const YourContractV2Factory = await ethers.getContractFactory(
    "YourContractV2"
  );
  console.log(await upgrades.upgradeProxy(YourContractAddress, YourContractV2Factory));
  console.log("Contract upgraded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
