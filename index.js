const Web3 = require('web3');
var express = require("express");
var cors = require('cors')
var bodyParser = require("body-parser");
var app = express();


const web3 = new Web3('your rpc');			

const multiSigDeploymentBlockNumber = 11028339;
const multiSigAddress = '0x97843608a00e2bbc75ab0c1911387e002565dede';

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/txActivity', async (req, res) => {
const transactions = []

const currentBlockNo = await web3.eth.getBlockNumber();
for(i = multiSigDeploymentBlockNumber; i <= currentBlockNo; i++) {

const blockInfo = await web3.eth.getBlock(i);

for(let j = 0; j < blockInfo.transactions.length; j++){
  const txDetails = await web3.eth.getTransaction(blockInfo.transactions[j])
  if ((txDetails.from && txDetails.from.toLowerCase() === multiSigAddress.toLowerCase()) || (txDetails.to && txDetails.to.toLowerCase() === multiSigAddress.toLowerCase())) {
    const result = {};
    // currently this only records these details but of course more details can be recorded
    result.from = txDetails.from;
    result.to = txDetails.to;
    result.value = txDetails.value;
    transactions.push(result)
  }
}
}
return res.status(200).send(transactions)
})


var server = app.listen(8001, function () {
  console.log("app running on port.", server.address().port);
});