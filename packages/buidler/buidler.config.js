const { usePlugin } = require('@nomiclabs/buidler/config')
usePlugin("@nomiclabs/buidler-ethers");
const fs = require("fs")
const { ethers } = require("ethers")
const DEBUG = false


/*

  to deploy, first create an account with 'yarn run generate'

  get info and balances for your DEPLOY_ACCOUNT with 'yarn run account' (not to be confused with 'yarn run accounts' which is your buidler node)

  send your DEPLOY_ACCOUNT funds from various networks (hint, use instant wallets: rinkeby.instantwallet.io kovan.instantwallet.io instantwallet.io is xdai)

  check out the main package.json for different deployments `yarn run ship` etc (they run the deploy script with different --networks)

*/

let DEPLOY_ACCOUNT = ""
try{
  DEPLOY_ACCOUNT = (fs.readFileSync("./DEPLOY_ACCOUNT.txt")).toString().trim()
  //use this eth.build with the mnemonic file: https://eth.build/build#a48269774834671c8ae23d92e612c5169afa57856c396646cb1d30bc7ac4683a
}catch(e){console.log(e)}

usePlugin("@nomiclabs/buidler-truffle5");


task("generate", "Create a mnemonic for builder deploys", async () => {
  const bip39 = require("bip39")
  const hdkey = require('ethereumjs-wallet/hdkey');
  const mnemonic = bip39.generateMnemonic()
  if(DEBUG) console.log("mnemonic",mnemonic)
  const seed = await bip39.mnemonicToSeed(mnemonic)
  if(DEBUG) console.log("seed",seed)
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet_hdpath = "m/44'/60'/0'/0/";
  const account_index = 0
  let fullPath = wallet_hdpath + account_index
  if(DEBUG) console.log("fullPath",fullPath)
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = "0x"+wallet._privKey.toString('hex');
  if(DEBUG) console.log("privateKey",privateKey)
  var EthUtil = require('ethereumjs-util');
  const address = "0x"+EthUtil.privateToAddress(wallet._privKey).toString('hex')
  console.log("🔐 Account Generated as "+address+".txt and set as DEPLOY_ACCOUNT in packages/buidler")
  console.log("💬 Use 'yarn run account' to get more information about the deployment account.")

  fs.writeFileSync("./"+address+".txt",mnemonic.toString())
  fs.writeFileSync("./DEPLOY_ACCOUNT.txt",mnemonic.toString())
});

task("account", "Get balance informations for the deployment account.", async () => {
  const hdkey = require('ethereumjs-wallet/hdkey');
  const bip39 = require("bip39")
  let mnemonic = fs.readFileSync("./DEPLOY_ACCOUNT.txt").toString().trim()
  if(DEBUG) console.log("mnemonic",mnemonic)
  const seed = await bip39.mnemonicToSeed(mnemonic)
  if(DEBUG) console.log("seed",seed)
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet_hdpath = "m/44'/60'/0'/0/";
  const account_index = 0
  let fullPath = wallet_hdpath + account_index
  if(DEBUG) console.log("fullPath",fullPath)
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = "0x"+wallet._privKey.toString('hex');
  if(DEBUG) console.log("privateKey",privateKey)
  var EthUtil = require('ethereumjs-util');
  const address = "0x"+EthUtil.privateToAddress(wallet._privKey).toString('hex')

  var qrcode = require('qrcode-terminal');
  qrcode.generate(address);
  console.log("‍📬 Deployer Account is "+address)
  for( let n in config.networks){
    //console.log(config.networks[n],n)
    try{

      let provider = new ethers.providers.JsonRpcProvider(config.networks[n].url)
      let balance = (await provider.getBalance(address))
      console.log(" -- "+n+" --  -- -- 📡 ")
      console.log("   balance: "+ethers.utils.formatEther(balance))
      console.log("   nonce: "+(await provider.getTransactionCount(address)))
    }catch(e){if(DEBUG){console.log(e)}}
  }

});

task("select", "Activate one of the deploying accounts (just switchs mnemonic files around)")
  .addPositionalParam("address", "The account's address. (should be an *address*.txt file here already from the `generate` task)")
  .setAction(async (taskArgs) => {
    console.log("Selecting account ",taskArgs)
    let mnemonic = fs.readFileSync("./"+taskArgs.address+".txt").toString().trim()
    fs.writeFileSync("./DEPLOY_ACCOUNT.txt",mnemonic)
    console.log("SELECTED:",taskArgs.address)
})

task("faucet", "Get funds to your deployer account.", async () => {

  const hdkey = require('ethereumjs-wallet/hdkey');
  const bip39 = require("bip39")
  let mnemonic = fs.readFileSync("./DEPLOY_ACCOUNT.txt").toString().trim()
  if(DEBUG) console.log("mnemonic",mnemonic)
  const seed = await bip39.mnemonicToSeed(mnemonic)
  if(DEBUG) console.log("seed",seed)
  const hdwallet = hdkey.fromMasterSeed(seed);
  const wallet_hdpath = "m/44'/60'/0'/0/";
  const account_index = 0
  let fullPath = wallet_hdpath + account_index
  if(DEBUG) console.log("fullPath",fullPath)
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = "0x"+wallet._privKey.toString('hex');
  if(DEBUG) console.log("privateKey",privateKey)
  var EthUtil = require('ethereumjs-util');
  const address = "0x"+EthUtil.privateToAddress(wallet._privKey).toString('hex')



})

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await web3.eth.getAccounts();
  for (const account of accounts) {
    console.log(account);
  }
});

task("blockNumber", "Prints the block number", async () => {
  const blockNumber = await web3.eth.getBlockNumber();
  console.log(blockNumber)
});

task("balance", "Prints an account's balance")
  .addPositionalParam("account", "The account's address")
  .setAction(async (taskArgs) => {
  const balance = await web3.eth.getBalance(await addr(taskArgs.account))
  console.log(web3.utils.fromWei(balance, "ether"), "ETH");
});

task("send", "Send ETH")
  .addParam("from", "From address or account index")
  .addOptionalParam("to", "To address or account index")
  .addOptionalParam("amount", "Amount to send in ether")
  .addOptionalParam("data", "Data included in transaction")
  .addOptionalParam("gasPrice", "Price you are willing to pay in gwei")
  .addOptionalParam("gasLimit", "Limit of how much gas to spend")

  .setAction(async (taskArgs) => {

    let from = await addr(taskArgs.from)
    debug(`Normalized from address: ${from}`)


    let to
    if(taskArgs.to){
        to = await addr(taskArgs.to)
        debug(`Normalized to address: ${to}`)
    }

    let txparams = {
        from: from,
        to: to,
        value: web3.utils.toWei(taskArgs.amount?taskArgs.amount:"0", "ether"),
        gasPrice: web3.utils.toWei(taskArgs.gasPrice?taskArgs.gasPrice:"1.001", "gwei"),
        gas: taskArgs.gasLimit?taskArgs.gasLimit:"24000"
    }

    if(taskArgs.data !== undefined) {
      txparams['data'] = taskArgs.data
      debug(`Adding data to payload: ${txparams['data']}`)
    }
    debug((txparams.gasPrice/1000000000)+" gwei")
    debug(JSON.stringify(txparams,null,2))

    return await send(txparams)
});

function send(txparams) {
  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction(txparams,(error, transactionHash) => {
      if(error){
        debug(`Error: ${error}`)
      }
      debug(`transactionHash: ${transactionHash}`)
      //checkForReceipt(2, params, transactionHash, resolve)
    })
  })
}

function debug(text){
  if(DEBUG){
    console.log(text)
  }
}

async function addr(addr) {
  if(web3.utils.isAddress(addr)) {
    return web3.utils.toChecksumAddress(addr)
  } else {
    let accounts = await web3.eth.getAccounts()
    if(accounts[addr] !== undefined) {
      return accounts[addr]
    } else {
      throw(`Could not normalize address: ${addr}`)
    }
  }
}


module.exports = {
  defaultNetwork: "localhost",
  networks: {
    kovan: {
      url: 'https://kovan.infura.io/v3/9ea7e149b122423991f56257b882261c',
      accounts: {
        mnemonic: DEPLOY_ACCOUNT
      },
    },
    localhost: {
      url: 'http://localhost:8545',
      accounts: {
        mnemonic: DEPLOY_ACCOUNT
      },
    },
    sidechain: {
      url: 'http://localhost:8546',
      accounts: {
        mnemonic: DEPLOY_ACCOUNT
      },
    },
    mainnet: {
      url: 'https://mainnet.infura.io/v3/9ea7e149b122423991f56257b882261c',
      accounts: {
        mnemonic: DEPLOY_ACCOUNT
      },
      gasPrice: 151100000111,
      gasLimit: 5000000,
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/9ea7e149b122423991f56257b882261c',
      accounts: {
        mnemonic: DEPLOY_ACCOUNT
      },
    },
    xdai: {
      url: 'https://dai.poa.network',
      gasPrice: 1100000000,
      accounts: {
        mnemonic: DEPLOY_ACCOUNT
      },
    },
    sokol: {
      url: 'https://sokol.poa.network',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: DEPLOY_ACCOUNT
      },
    },
  },
  solc: {
    version : "0.6.6",
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
