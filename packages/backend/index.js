var express = require("express");
var cors = require('cors')
var bodyParser = require("body-parser");
var app = express();

let transactions = []

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/transactions", function(req, res) {
  res.status(200).send(transactions);
});

// app.post('/clearTx', function(request, response){
//   console.log("CLEARING!!!!",request.body);      // your JSON
//   response.send(request.body);    // echo the result back
//   transactions[request.body.address] = {}
//   console.log("transactions",transactions)
// });


app.post('/', function(request, response) {
  if (transactions.length === 0) {
      const firstTxInfo = {};
      firstTxInfo[request.body.safeAddress] = [];
      transactions.push(firstTxInfo);
  }
  const transactionInfo = {}
  transactionInfo[request.body.signature] = request.body.data;
  transactions[0][request.body.safeAddress].push(transactionInfo)
  response.send(transactions);    // echo the result back
});

var server = app.listen(8001, function () {
  console.log("app running on port.", server.address().port);
});