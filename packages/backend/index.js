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

app.post('/:id', function(request, response){
  transactions[0][request.body.safeAddress].splice(request.params.id, 1);
  console.log("transactions",transactions)
});

app.post('/addSignature/:id', function(request, response){
  transactions[0][request.body.safeAddress][request.params.id].data.signature.push(req.body.signature)
});



app.post('/', function(request, response) {
  if (transactions.length === 0) {
      const firstTxInfo = {};
      firstTxInfo[request.body.safeAddress] = [];
      transactions.push(firstTxInfo);
  }
  transactions[0][request.body.safeAddress].push(request.body.data)
  response.send(transactions);    // echo the result back
});

var server = app.listen(8001, function () {
  console.log("app running on port.", server.address().port);
});