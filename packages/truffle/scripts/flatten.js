//usage: truffe flatten contracts/YourContract.sol
const flatten = require("truffle-flattener");
const fse = require("fs-extra");
const chalk = require("chalk");

const main = async (callback) => {

  const fileToFlatten = process.argv[4];
  const flattenedFile = await flatten([fileToFlatten]);

  await fse.ensureFile("dist/" + fileToFlatten);
  await fse.writeFile("dist/" + fileToFlatten, flattenedFile);
  console.log(flattenedFile);
  console.log(chalk.bold("Flattened contract file was saved to packages/truffle/dist/" + fileToFlatten) + "\n");
  console.warn(chalk.bold.cyanBright("Developers please note: for most use cases, it is likely unnecessary to flatten your contracts.",
    "\n",
    "Check out the truffle-plugin-verify package here: https://www.npmjs.com/package/truffle-plugin-verify if trying to verify Etherscan contracts!"));
}


module.exports = main;
