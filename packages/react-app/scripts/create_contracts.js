const fs = require("fs");

// create contracts dir if it does not exist
if (!fs.existsSync("./src/contracts")) {
  try {
    fs.mkdirSync("./src/contracts");
    console.log("src/contracts directory created.");
  } catch (error) {
    console.error(error);
  }
}

// create hardhat_contracts.json file if it does not exist
if (!fs.existsSync("./src/contracts/hardhat_contracts.json")) {
  try {
    fs.writeFileSync("./src/contracts/hardhat_contracts.json", JSON.stringify({}));

    console.log("src/contracts/hardhat_contracts.json created.");
  } catch (error) {
    console.log(error);
  }
}
