const bip39 = require("bip39");
const fse = require("fse");
const { spawnSync } = require("child_process");

const generateMnemonic = () => {
  //generate mnemonic and save it to a file for easy lookup when developing
  const mnemonic = bip39.generateMnemonic();
  console.log("Mnemonic generated: ", mnemonic);
  fse.writeFileSync("./mnemonic.txt", mnemonic.toString());
  console.log("Mnemonic saved at mnemonic.txt in your truffle project.",
    "This mnemonic is only for local testing purposes");
  return mnemonic;
}

const main = () => {
  //check if a mnemonic already exists
  const mnemonic = fse.readFileSync("./mnemonic.txt");
  if (mnemonic) {
    //start ganache with mnemonic
    spawnSync("ganache", ["-m", mnemonic], { stdio: 'inherit' });
  } else {
    //create mnemonic
    const secret = generateMnemonic();
    //start ganache with mnemonic
    spawnSync("ganache", ["-m", secret], { stdio: 'inherit' });
  }
}
main();

