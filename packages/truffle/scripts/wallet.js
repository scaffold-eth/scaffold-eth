const chalk = require("chalk");
const fse = require("fse");
const bip39 = require("bip39");
const { hdkey } = require('ethereumjs-wallet');
const args = require("yargs").argv;

function generateAddressesFromSeed(mnemonic, count) {
  let seed = bip39.mnemonicToSeedSync(mnemonic);
  let hdwallet = hdkey.fromMasterSeed(seed);
  let wallet_hdpath = "m/44'/60'/0'/0/";

  let accounts = [];
  for (let i = 0; i < count; i++) {
    let wallet = hdwallet.derivePath(wallet_hdpath + i).getWallet();
    let address = "0x" + wallet.getAddress().toString("hex");
    let privateKey = wallet.getPrivateKey().toString("hex");
    accounts.push({ address: address, privateKey: privateKey });
  }
  return accounts;
}

const main = async (callback) => {

  const url = args.url ? args.url : "http://localhost:3000";
  let mnemonic = fse.readFileSync("./mnemonic.txt").toString().trim();
  if (mnemonic) {
    let wallet = generateAddressesFromSeed(mnemonic, 1);
    console.log("🔐 WALLET address is " + wallet[0].address + "");
    console.log("🔗", url, "/pk#" + wallet[0].privateKey);
    console.log(chalk.bold.cyanBright("\nDevelopers please note: your local ganache node comes with 10 pre-funded accounts containining 1000 ETH each. They can be accessed through web3 via the following command:"),
      chalk.bold.magenta("const ganacheAccounts = await web3.eth.getAccounts()"),
      chalk.cyanBright(" and a list of your accounts and private keys is available in your the console window where you ran"),
      chalk.bold.magenta("yarn chain"), ".\n", chalk.bold.cyanBright("The above wallet and url information is for the first ganache account."));
  } else {
    console.log(`--- Looks like there is no mnemonic file created yet.`);
    console.log(
      `--- Please run ${chalk.greenBright("yarn generate")} to create one`
    );
  }

}

module.exports = main;
