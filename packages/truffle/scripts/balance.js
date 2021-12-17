const main = async (callback) => {

  try {
    // TODO: format the units
    // process.argv[4] should be the account address we are querying
    console.log(await web3.eth.getBalance(process.argv[4]) + " ETH");
  } catch (err) {
    console.log(err.message);

  }
}

module.exports = main;
