const { usePlugin } = require('@nomiclabs/buidler/config')
usePlugin("@nomiclabs/buidler-truffle5");

const DEBUG = true

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
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      //url: 'https://rinkeby.infura.io/v3/2717afb6bf164045b5d5468031b93f87',
      url: 'http://localhost:8545',
      /*accounts: {
        mnemonic: "**SOME MNEMONIC**"
      },*/
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
