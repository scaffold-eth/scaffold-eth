const { ethers, upgrades } = require("hardhat");

// Plug in the address of the contract you want to upgrade
const YourContractAddress = "";

async function main() {
  const YourContract = await ethers.getContractFactory("YourContract");
  const yourcontract = await upgrades.upgradeProxy(
    YourContractAddress,
    YourContract
  );
  console.log("Contract upgraded");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
