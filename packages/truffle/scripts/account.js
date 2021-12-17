// get balance information for the deployment account
const qrcode = require("qrcode-terminal");
const ethers = require("ethers");
const fse = require("fs-extra");
let DEBUG = false;

const main = async (callback) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const address = accounts[0];
    qrcode.generate(address);
    console.log("‍📬 Deployer Account is " + address);
    for (const n in config.networks) {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          config.networks[n].url
        );
        const balance = await provider.getBalance(address);
        console.log(" -- " + n + " --  -- -- 📡 ");
        console.log("   balance: " + ethers.utils.formatEther(balance));
        console.log(
          "   nonce: " + (await provider.getTransactionCount(address))
        );
      } catch (e) {
        if (DEBUG) {
          console.log(e);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports = main;
