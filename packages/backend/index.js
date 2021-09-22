var ethers = require("ethers");
var express = require("express");
var fs = require("fs");
const https = require("https");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();

// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad";

/// 📡 What chain are your contracts deployed to?
const targetNetwork = {
    name: "localhost",
    color: "#666666",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: "http://localhost:8545",
  };

/*
const targetNetwork = {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
  };

const targetNetwork = {
    name: "rinkeby",
    color: "#e0d068",
    chainId: 4,
    rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    faucet: "https://faucet.rinkeby.io/",
    blockExplorer: "https://rinkeby.etherscan.io/",
  };
*/

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
console.log("🏠 Connecting to provider:", localProviderUrl);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrl);

const isAdmin = async (address) => {
  const providerNetwork = await localProvider.getNetwork();
  const _chainId = providerNetwork.chainId;

  contractList = require("../react-app/src/contracts/hardhat_contracts.json");

  const contractData = contractList[_chainId][targetNetwork.name].contracts.QuadraticDiplomacyContract;
  const contract = new ethers.Contract(contractData.address, contractData.abi, localProvider);

  const adminRole = await contract.DEFAULT_ADMIN_ROLE();
  const isAdmin = await contract.hasRole(adminRole, address);

  return isAdmin;
}

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

//Uncomment this if you want to create a wallet to send ETH or something...
// const INFURA = JSON.parse(fs.readFileSync("./infura.txt").toString().trim())
// const PK = fs.readFileSync("./pk.txt").toString().trim()
// let wallet = new ethers.Wallet(PK,new ethers.providers.InfuraProvider("goerli",INFURA))
// console.log(wallet.address)
// const checkWalletBalance = async ()=>{
//   console.log("BALANCE:",ethers.utils.formatEther(await wallet.provider.getBalance(wallet.address)))
// }
// checkWalletBalance();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/distributions", async function (request, response) {
  const ip =
    request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  console.log("POST from ip address:", ip, request.body.message);
  console.log(request.body);

  let recovered = ethers.utils.verifyMessage(
    request.body.message,
    request.body.signature
  );

  if (recovered != request.body.address) {
    console.log('Wrong signature');
    return response.status(401).send('Wrong signature');
  }

  const isAdminInContract = await isAdmin(recovered);
  if (!isAdminInContract) {
    console.log('No admin in contract');
    return response.status(401).send('No admin in contract');
  }

  try {
    const resAdd = await db.collection('distributions').add({
      owner: request.body.address,
      createdAt: Date.now(),
      voteAllocation: request.body.voteAllocation,
      members: request.body.members,
      votes: {},
      status: 'started'
    });

    console.log(resAdd.id);
    return response.status(201).send(resAdd);
  } catch (exception) {
    console.log(exception);
    return response.status(500).send('Error creating distribution');
  }
});

app.get("/distributions", async function (request, response) {

  try {
    const snapshot = await db.collection('distributions').get();

    let data = [];

    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        data: doc.data()
      });
    });

    response.send(data);
  } catch (exception) {
    console.log(exception);
    response.status(500).send('Error retrieving distributions');
  }
});

app.get("/currentDistribution", async function (request, response) {

  try {
    db.collection('distributions')
      .where('status', '==', 'started')
      .get()
      .then(snapshot => {
        if(!snapshot.empty) {
          data = {
            id: snapshot.docs[0].id,
            data: snapshot.docs[0].data()
          }
          console.log(data);
          response.send(data);
        } else {
          response.status(404).send('No current distribution');
        }
      });
  } catch (exception) {
    console.log(exception);
    response.status(500).send('Error retrieving current distribution');
  }
});


app.get("/ownedDistributions/:owner", async function (request, response) {

  try {
    const snapshot = await db.collection('distributions').where('owner', '==', request.params.owner).get();

    let data = [];

    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        data: doc.data()
      });
    });

    response.send(data);
  } catch (exception) {
    console.log(exception);
    response.status(500).send('Error retrieving distributions');
  }
});

app.get("/votingDistributions/:voter", async function (request, response) {

  try {
    const snapshot = await db.collection('distributions').where('members', 'array-contains', request.params.voter).get();

    let data = [];

    snapshot.forEach(doc => {
      data.push({
        id: doc.id,
        data: doc.data()
      });
    });

    response.send(data);
  } catch (exception) {
    console.log(exception);
    response.status(500).send('Error retrieving distributions');
  }
});

app.get("/distributions/:distributionId", async function (request, response) {
  const distributionRef = db.collection('distributions').doc(request.params.distributionId);
  const distribution = await distributionRef.get();

  if (!distribution.exists) {
    response.status(404).send('Distribution not found');
  } else {
    response.send(distribution);
  }
});

app.post("/distributions/:distributionId/vote", async function (request, response) {
  const ip =
    request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  console.log("POST from ip address:", ip, request.body.message);
  console.log(request.body);

  let recovered = ethers.utils.verifyMessage(
    request.body.message,
    request.body.signature
  );

  if (recovered != request.body.address) {
    console.log('Wrong signature');
    return response.status(401).send('Wrong signature');
  }

  const distributionRef = db.collection('distributions').doc(request.params.distributionId);
  const distribution = await distributionRef.get();

  if (!distribution.exists) {
    return response.status(404).send('Distribution not found');
  } else {
    console.log(distribution.data());
    if (!distribution.data().members.includes(recovered)) {
      return response.status(401).send('Voter not allowed');
    }

    let votes = distribution.data().votes;

    // TODO: validate total votes and members
    votes[recovered] = request.body.votes;

    const res = await distributionRef.update({votes: votes});

    return response.send(res);
  }
});

app.post("/distributions/:distributionId/finish", async function (request, response) {
  const ip =
    request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  console.log("POST from ip address:", ip, request.body.message);
  console.log(request.body);

  let recovered = ethers.utils.verifyMessage(
    request.body.message,
    request.body.signature
  );

  if (recovered != request.body.address) {
    console.log('Wrong signature');
    return response.status(401).send('Wrong signature');
  }

  const distributionRef = db.collection('distributions').doc(request.params.distributionId);
  const distribution = await distributionRef.get();

  if (!distribution.exists) {
    return response.status(404).send('Distribution not found');
  } else {
    console.log(distribution.data());
    if (distribution.data().owner != recovered) {
      return response.status(401).send('Only owner can finish the distribution');
    }

    const res = await distributionRef.update({status: 'finished'});

    return response.send(res);
  }
});

if (fs.existsSync("server.key") && fs.existsSync("server.cert")) {
  https
    .createServer(
      {
        key: fs.readFileSync("server.key"),
        cert: fs.readFileSync("server.cert"),
      },
      app
    )
    .listen(45622, () => {
      console.log("HTTPS Listening: 45622");
    });
} else {
  var server = app.listen(45622, function () {
    console.log("HTTP Listening on port:", server.address().port);
  });
}
