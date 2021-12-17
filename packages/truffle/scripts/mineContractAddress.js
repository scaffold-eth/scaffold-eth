const bip39 = require("bip39");
const hdkey = require("ethereumjs-wallet/hdkey");

const main = async (callback) => {
  const searchFor = process.argv[4];
  let contract_address = "";
  let address;
  let mnemonic = "";

  while (contract_address.indexOf(searchFor) != 0) {
    mnemonic = bip39.generateMnemonic();
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const hdwallet = hdkey.fromMasterSeed(seed);
    const wallet_hdpath = "m/44'/60'/0'/0/";
    const account_index = 0;
    const fullPath = wallet_hdpath + account_index;
    const wallet = hdwallet.derivePath(fullPath).getWallet();
    const privateKey = "0x" + wallet._privKey.toString("hex");
    const EthUtil = require("ethereumjs-util");
    address =
      "0x" + EthUtil.privateToAddress(wallet._privKey).toString("hex");

    const rlp = require("rlp");
    const keccak = require("keccak");

    const nonce = 0x00; // The nonce must be a hex literal!
    const sender = address;

    const input_arr = [sender, nonce];
    const rlp_encoded = rlp.encode(input_arr);

    const contract_address_long = keccak("keccak256")
      .update(rlp_encoded)
      .digest("hex");

    contract_address = contract_address_long.substring(24); // Trim the first 24 characters.
  }

  console.log(
    "⛏  Account Mined as " +
    address +
    " and set as mnemonic in packages/truffle"
  );
  console.log(
    "📜 This will create the first contract: " +
    chalk.magenta("0x" + contract_address)
  );
  console.log(
    "💬 Use 'yarn run account' to get more information about the deployment account."
  );

  fs.writeFileSync(
    "./" + address + "_produces" + contract_address + ".txt",
    mnemonic.toString()
  );
  fs.writeFileSync("./mnemonic.txt", mnemonic.toString());

}

module.exports = main;
