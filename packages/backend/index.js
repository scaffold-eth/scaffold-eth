const ethers = require("ethers");
const express = require("express");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const db = require("./services/db");

//const { useContractLoader } = require("eth-hooks");

// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
const INFURA_ID = "946e2c899ec14ac1b94ef098d2d3a9be";

/// 📡 What chain are your contracts deployed to?

const sourceNetwork = {
    name: "localhost",
    color: "#666666",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: "http://localhost:8545",
  };

const targetNetwork = {
    name: "kovanOptimism",
    color: "#666666",
    chainId: 69,
    blockExplorer: "",
    rpcUrl: "https://kovan.optimism.io",
  };
/*
const targetNetwork = {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
  };
/*
const targetNetwork = {
    name: "rinkeby",
    color: "#e0d068",
    chainId: 4,
    rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    faucet: "https://faucet.rinkeby.io/",
    blockExplorer: "https://rinkeby.etherscan.io/",
  };
*/

const sourceProviderUrl = sourceNetwork.rpcUrl;
console.log("🏠 Connecting to provider:", sourceProviderUrl);
const sourceProvider = new ethers.providers.StaticJsonRpcProvider(sourceProviderUrl);

contractList = require("./hardhat_contracts.json");

const sourceContractData = contractList[sourceNetwork.chainId][sourceNetwork.name].contracts.Loogies;
const sourceContract = new ethers.Contract(sourceContractData.address, sourceContractData.abi, sourceProvider);

const targetProviderUrl = targetNetwork.rpcUrl;
const targetProvider = new ethers.providers.StaticJsonRpcProvider(targetProviderUrl);
const account = ethers.Wallet.fromMnemonic("");
const signer = account.connect(targetProvider);

const targetContractData = contractList[targetNetwork.chainId][targetNetwork.name].contracts.Loogies;
const targetContract = new ethers.Contract(targetContractData.address, targetContractData.abi, signer);



const loogiesIds = async (address) => {
  console.log("LoogiesIds: ", address);

  const balance = await sourceContract.balanceOf(address);
  console.log("Balance: ", balance);
  const balanceNumber = balance && balance.toNumber && balance.toNumber();
  const ids = [];
  for (let tokenIndex = 0; tokenIndex < balanceNumber; tokenIndex++) {
      console.log("Getting token index", tokenIndex);
      const tokenId = await sourceContract.tokenOfOwnerByIndex(address, tokenIndex);
      console.log("Loogie tokenId: ", tokenId);
      ids.push(tokenId.toNumber());
  }

  return ids;
}

const claim = async (address, tokenId) => {
  console.log("Claim tokenId: ", tokenId, " from address: ", address);

  const owner = await sourceContract.ownerOf(tokenId);

  const claimed = await db.getClaimedByTokenId(tokenId);

  if (owner == address && !claimed) {
    await mint(address, tokenId);
  }
}

const mint = async (address, tokenId) => {
  console.log("Mint tokenId: ", tokenId, " from address: ", address);

  await db.updateClaimByTokenId(tokenId, {
    claimed: true,
    address: address,
    claimedTimestamp: Date.now(),
    minted: false,
  })

  const price = await targetContract.price();

  console.log("price: ", price);

  const response = await targetContract.mintItem({ value: price, gasLimit: 300000 });

  //console.log("response: ", response);

  const receipt = await response.wait();

  //console.log("receipt: ", receipt);

/*
  let mintConfirmations = 0;
  let receipt;
  while (mintConfirmations < 4) {
    receipt = await response.wait();

    console.log("receipt: ", receipt);

    mintConfirmations = receipt.confirmations;
  }
*/

  const transactionHash = receipt.transactionHash;

  console.log("transactionHash: ", transactionHash);

  await db.updateClaimByTokenId(tokenId, {
    transactionHash: transactionHash,
  })

  const optimisticTokenId = receipt.events[0].args[2].toNumber();

  console.log("optimisticTokenId: ", optimisticTokenId);

  await db.updateClaimByTokenId(tokenId, {
    optimisticTokenId: optimisticTokenId,
  })

  const responseTransfer = await targetContract.transferFrom(signer.address, address, optimisticTokenId, { gasLimit: 200000 });

  //console.log("responseTransfer: ", responseTransfer);

  const receiptTransfer = await responseTransfer.wait();

  //console.log("receiptTransfer: ", receiptTransfer);

/*
  let transferConfirmations = 0;
  let receiptTransfer;
  while (transferConfirmations < 4) {
    receiptTransfer = await response.wait();

    console.log("receiptTransfer: ", receiptTransfer);

    transferConfirmations = receiptTransfer.confirmations;
  }
*/

  const transactionHashTransfer = receiptTransfer.transactionHash;

  console.log("transactionHashTransfer: ", transactionHashTransfer);

  await db.updateClaimByTokenId(tokenId, {
    transactionHashTransfer: transactionHashTransfer,
    minted: true,
  })

  return;
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

app.get("/", async function (request, response) {

/*
  for (let tokenId = 1; tokenId < 1864; tokenId++) {
    await db.createClaim({
      tokenId: tokenId,
      claimed: false
    })
  }
*/

  response.send('OptimisticLoogiesClaim');
});

app.post("/claim", async function (request, response) {
  const ip =
    request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  console.log("POST from ip address:", ip);
  console.log(request.body);

  const message = "loogie-claim-" + request.body.address;

  const recovered = ethers.utils.verifyMessage(
    message,
    request.body.signature
  );

  if (recovered != request.body.address) {
    console.log('Wrong signature');
    return response.status(401).send('Wrong signature');
  }

  const ids = await loogiesIds(recovered);
  console.log("IDS: ", ids);

  let responseData = [];

  for (let i = 0; i < ids.length; i++) {
    await claim(recovered, ids[i]);
    const claimData = await db.claimByTokenId(ids[i]);
    responseData.push(claimData);
  }

  return response.status(201).send(responseData);
});

app.get("/claim/:tokenId", async function (request, response) {
  console.log("Get Claim tokenId: ", request.params.tokenId);

  try {
    const claim = await db.claimByTokenId(parseInt(request.params.tokenId));

    response.send(claim);
  } catch (exception) {
    console.log(exception);
    response.status(500).send('Error retrieving claim');
  }
});

app.get("/claims/:address", async function (request, response) {
  console.log("Get Claims address: ", request.params.address);

  try {
    const claims = await db.claimsByAddress(request.params.address);

    response.send(claims);
  } catch (exception) {
    console.log(exception);
    response.status(500).send('Error retrieving claim');
  }
});

app.post("/logs", async function (request, response) {
  console.log("Get logs address: ", request.params.address);

  const ip =
    request.headers["x-forwarded-for"] || request.connection.remoteAddress;
  console.log("POST from ip address:", ip);
  console.log(request.body);

  const message = "loogie-claim-logs-" + request.body.address;

  const recovered = ethers.utils.verifyMessage(
    message,
    request.body.signature
  );

  if (recovered != request.body.address) {
    console.log('Wrong signature');
    return response.status(401).send('Wrong signature');
  }

  if (recovered == '0x34aA3F359A9D614239015126635CE7732c18fDF3' || recovered == '0x5dCb5f4F39Caa6Ca25380cfc42280330b49d3c93') {
    const claims = await db.findAllClaimed();
    return response.send(claims);
  }

  response.status(401).send('Unauthorized address');
});

/*
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
*/

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
