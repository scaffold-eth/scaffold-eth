const fs = require("fs");
const chalk = require("chalk");
const bre = require("@nomiclabs/buidler");
const contractDir = "./contracts";
async function main() {
  const publishDir = "../react-app/src/contracts";
  const graphDir = "../niftygraph";
  if (!fs.existsSync(publishDir)) {
    fs.mkdirSync(publishDir);
  }
  let finalContractList = [];
  fs.readdirSync(contractDir).forEach((file) => {
    if (
      file.indexOf(".sol") >= 0 &&
      file.indexOf("IERC1271") < 0 &&
      file.indexOf("SignatureChecker") < 0
    ) {
      let contractName = file.replace(".sol", "");
      console.log(
        "Publishing",
        chalk.cyan(contractName),
        "to",
        chalk.yellow(publishDir)
      );
      try {
        let contract = fs
          .readFileSync(
            bre.config.paths.artifacts + "/" + contractName + ".json"
          )
          .toString();
        let address = fs
          .readFileSync(
            bre.config.paths.artifacts + "/" + contractName + ".address"
          )
          .toString();
        contract = JSON.parse(contract);

        let graphConfigPath = `${graphDir}/config/config.json`;
        let graphConfig;
        try {
          if (fs.existsSync(graphConfigPath)) {
            graphConfig = fs.readFileSync(graphConfigPath).toString();
          } else {
            graphConfig = "{}";
          }
        } catch (e) {
          console.log(e);
        }
        graphConfig = JSON.parse(graphConfig);
        graphConfig[contractName + "Address"] = address;

        const folderPath = graphConfigPath.replace("/config.json", "");
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
        }

        fs.writeFileSync(graphConfigPath, JSON.stringify(graphConfig, null, 2));
        console.log("new graphConfig: ", graphConfig);
        console.log(graphConfigPath);

        fs.writeFileSync(
          publishDir + "/" + contractName + ".address.js",
          'module.exports = "' + address + '"'
        );

        fs.writeFileSync(
          publishDir + "/" + contractName + ".abi.js",
          "module.exports = " + JSON.stringify(contract.abi)
        );
        fs.writeFileSync(
          publishDir + "/" + contractName + ".bytecode.js",
          'module.exports = "' + contract.bytecode + '"'
        );
        finalContractList.push(contractName);
      } catch (e) {
        console.log(e);
      }
    }
  });
  fs.writeFileSync(
    publishDir + "/contracts.js",
    "module.exports = " + JSON.stringify(finalContractList)
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
