const fs = require("fs");
const chalk = require("chalk");

async function deploy(name, _args) {
  const args = _args || []

  console.log(`📄 ${name}`);
  const contractArtifacts = artifacts.require(name);
  const contract = await contractArtifacts.new(...args);
  console.log(
    chalk.cyan(name),
    "deployed to:",
    chalk.magenta(contract.address)
  );
  fs.writeFileSync(`artifacts/${name}.address`, contract.address);
  console.log("\n");
  return contract;
}

const isSolidity = fileName => fileName.indexOf(".sol") >= 0 && fileName.indexOf(".swp.") < 0

function readArgumentsFile (contractName) {
  let args = [];
  try {
    const argsFile = `./contracts/${contractName}.args`;
    if (fs.existsSync(argsFile)) {
      args = JSON.parse(fs.readFileSync(argsFile));
    }
  } catch (e) {
    console.log(e);
  }
  
  return args
}

async function autoDeploy() {
  const contractList = fs.readdirSync("./contracts");
  contractList
    .filter(fileName => isSolidity(fileName))
    .forEach(async fileName => {
      const contractName = fileName.replace(".sol", "");
      const args = readArgumentsFile(contractName)
      await deploy(contractName, args);
    }
  )
}


async function main() {
  console.log("📡 Deploy \n");
  // auto deploy to read contract directory and deploy them all (add ".args" files for arguments)
  await autoDeploy();
  // OR
  // custom deploy (to use deployed addresses dynamically for example:)
  // const exampleToken = await deploy("ExampleToken")
  // const examplePriceOracle = await deploy("ExamplePriceOracle")
  // const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });