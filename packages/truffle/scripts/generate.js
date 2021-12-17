const bip39 = require("bip39");
const fse = require("fse");
const args = require("yargs").argv;

const main = async (callback) => {
  console.log("args " + JSON.stringify(args));
  //check mnemonic
  let mnemonic = fse.existsSync("./mnemonic.txt");
  if (mnemonic && !args.new) {
    console.log("A mnemonic at truffle/mnemonic.txt already exists. \n",
      "If you would like to re-generate a mnemonic, run yarn generate --new. \n");
    console.log("The yarn chain command starts a ganache node, which comes with 10 funded accounts and a mnemonic that is saved to mnemonic.txt \n",
      "Run yarn accounts to see a list of your available addresses");
  } else {
    //generate mnemonic and save it to a file for easy lookup when developing
    mnemonic = bip39.generateMnemonic();
    console.log("Mnemonic generated: ", mnemonic);
    fse.writeFileSync("./mnemonic.txt", mnemonic.toString());
    console.log("Mnemonic saved at mnemonic.txt in your truffle project.",
      "This mnemonic is only for local testing purposes");
    console.log("If you are already running a ganache node,",
      "stop it and re-start with yarn chain to ensure the accounts are based on this new mnemonic")
  }
}

module.exports = main;
