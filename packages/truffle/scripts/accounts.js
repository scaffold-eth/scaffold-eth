// get list of available accounts
const fse = require("fs-extra");
const HDWalletProvider = require('@truffle/hdwallet-provider');

const main = async (callback) => {
  const ganacheAccounts = await web3.eth.getAccounts();
  ganacheAccounts.forEach((account) => console.log(account));
  console.log("\n");

  callback();
}

module.exports = main;
