const ethers = require("ethers");
const express = require("express");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const db = require("./services/db");

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
  console.log("POST from ip address:", ip);
  console.log(request.body);

  // TODO: add some nonce to avoid replay attacks
  const message = "qdip-creation-" + request.body.address + request.body.voteAllocation + request.body.members.join();

  const recovered = ethers.utils.verifyMessage(
    message,
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
    const resAdd = await db.createDistribution({
      owner: request.body.address,
      createdAt: Date.now(),
      voteAllocation: request.body.voteAllocation,
      members: request.body.members.map(voter => voter.toLowerCase()),
      votes: {},
      votesSignatures: {},
      signature: request.body.signature,
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
    const distributions = await db.findAllDistributions();

    response.send(distributions);
  } catch (exception) {
    console.log(exception);
    response.status(500).send('Error retrieving distributions');
  }
});

app.get("/currentDistribution", async function (request, response) {

  try {
    const distribution = await db.currentDistribution();
    if(distribution) {
      console.log(distribution);
      response.send(distribution);
    } else {
      response.status(404).send('No current distribution');
    }
  } catch (exception) {
    console.log(exception);
    response.status(500).send('Error retrieving current distribution');
  }
});


app.get("/ownedDistributions/:owner", async function (request, response) {

  try {
    const distributions = await db.ownedDistributions(request.params.owner);

    response.send(distributions);
  } catch (exception) {
    console.log(exception);
    response.status(500).send('Error retrieving distributions');
  }
});

app.get("/votingDistributions/:voter", async function (request, response) {

  try {
    const distributions = await db.votingDistributions(request.params.voter);

    response.send(distributions);
  } catch (exception) {
    console.log(exception);
    response.status(500).send('Error retrieving distributions');
  }
});

app.get("/distributions/:distributionId", async function (request, response) {
  const distribution = await db.getDistribution(request.params.distributionId);

  if (!distribution) {
    response.status(404).send('Distribution not found');
  } else {
    response.send(distribution);
  }
});

app.post("/distributions/:distributionId/vote", async function (request, response) {
  const sortedVotes = Object.keys(request.body.votes).sort();

  const message =
    "qdip-vote-" +
    request.params.distributionId +
    request.body.address.toLowerCase() +
    sortedVotes.join() +
    sortedVotes.map(voter => request.body.votes[voter]).join();

  const recovered = ethers.utils.verifyMessage(
    message,
    request.body.signature
  );

  if (recovered.toLowerCase() != request.body.address.toLowerCase()) {
    console.log('Wrong signature');
    return response.status(401).send('Wrong signature');
  }

  const distribution = await db.getDistribution(request.params.distributionId);

  if (!distribution) {
    return response.status(404).send('Distribution not found');
  } else {
    console.log(distribution);

    const voter = recovered.toLowerCase();

    if (!distribution.members.includes(voter)) {
      return response.status(401).send('Voter not allowed');
    }

    let votes = distribution.votes;
    let votesSignatures = distribution.votesSignatures;

    // Check if all votes are to members
    const allMembers = Object.keys(request.body.votes).every(voteAddress => {
      return distribution.members.includes(voteAddress);
    });
    if (!allMembers) {
      return response.status(401).send('No member votes on voting data');
    }

    // Check if the total votes are equal or less than the vote allocation
    const reducer = (previousValue, currentValue) => previousValue + currentValue;
    const totalVotes = Object.values(request.body.votes).reduce(reducer);
    if (totalVotes > distribution.voteAllocation) {
      return response.status(401).send('More total votes than allowed');
    }

    votes[voter] = request.body.votes;
    votesSignatures[voter] = request.body.signature;

    const res = await db.updateDistribution(distribution.id, { votes: votes, votesSignatures: votesSignatures });

    return response.send(res);
  }
});

app.post("/distributions/:distributionId/finish", async function (request, response) {
  const message = "qdip-finish-" + request.params.distributionId + request.body.address;

  const recovered = ethers.utils.verifyMessage(
    message,
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

  const distribution = await db.getDistribution(request.params.distributionId);

  if (!distribution) {
    return response.status(404).send('Distribution not found');
  } else {
    const res = await db.finishDistribution(request.params.distributionId);
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
