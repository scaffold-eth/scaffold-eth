const fs = require("fs");

if (!fs.existsSync("./src/contracts/hardhat_contracts.json")) {
  fs.open("./src/contracts/hardhat_contracts.json", "w", function (err, file) {
    if (err) throw err;
    console.log("Creating file for local contracts");
  });
}
