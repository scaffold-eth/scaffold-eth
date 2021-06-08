const fs = require("fs");
const chalk = require("chalk");

const graphDir = "../subgraph";
const deploymentsDir = "./deployments";

function publishContract(contractName, networkName) {
  console.log(
    " 💽 Publishing",
    chalk.cyan(contractName),
    "on",
    chalk.cyan(networkName)
  );
  try {
    let contract = fs
      .readFileSync(`${deploymentsDir}/${networkName}/${contractName}.json`)
      .toString();
    contract = JSON.parse(contract);
    const graphConfigPath = `${graphDir}/config/config.json`;
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
    graphConfig[`${networkName}_${contractName}Address`] = contract.address;

    const folderPath = graphConfigPath.replace("/config.json", "");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    fs.writeFileSync(graphConfigPath, JSON.stringify(graphConfig, null, 2));
    if (!fs.existsSync(`${graphDir}/abis`)) fs.mkdirSync(`${graphDir}/abis`);
    fs.writeFileSync(
      `${graphDir}/abis/${networkName}_${contractName}.json`,
      JSON.stringify(contract.abi, null, 2)
    );

    console.log(
      " 📠 Published " + chalk.green(contractName) + " to the subgraph."
    );

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function main() {
  const directories = fs.readdirSync(deploymentsDir);
  directories.forEach(function (directory) {
    const files = fs.readdirSync(`${deploymentsDir}/${directory}`);
    files.forEach(function (file) {
      if (file.indexOf(".json") >= 0) {
        const contractName = file.replace(".json", "");
        publishContract(contractName, directory);
      }
    });
  });
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
