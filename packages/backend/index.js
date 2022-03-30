const ethers = require("ethers");
const express = require("express");
const fs = require("fs");
const https = require("https");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad";

/// 📡 What chain are your contracts deployed to?

const phoenixNetwork = {
    name: "kovanOptimism",
    color: "#666666",
    chainId: 69,
    blockExplorer: "",
    rpcUrl: "https://kovan.optimism.io",
  };

const xPoapNetwork = {
    name: "xdai",
    color: "#48a9a6",
    chainId: 100,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://dai.poa.network",
    faucet: "https://xdai-faucet.top/",
    blockExplorer: "https://blockscout.com/poa/xdai/",
  };

contractList = require("./hardhat_contracts.json");

const phoenixProviderUrl = phoenixNetwork.rpcUrl;
console.log("🏠 Connecting to provider:", phoenixProviderUrl);
const phoenixProvider = new ethers.providers.StaticJsonRpcProvider(phoenixProviderUrl);
const phoenixContractData = contractList[phoenixNetwork.chainId][phoenixNetwork.name].contracts.Phoenix;
const phoenixContract = new ethers.Contract(phoenixContractData.address, phoenixContractData.abi, phoenixProvider);


const xPoapProviderUrl = xPoapNetwork.rpcUrl;
console.log("🏠 Connecting to provider:", xPoapProviderUrl);
const xPoapProvider = new ethers.providers.StaticJsonRpcProvider(xPoapProviderUrl);
const xPoapContractData = contractList[xPoapNetwork.chainId][xPoapNetwork.name].contracts.xPoap;
const xPoapContract = new ethers.Contract(xPoapContractData.address, xPoapContractData.abi, xPoapProvider);

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async function (request, response) {
  response.send('Phoenix');
});

app.get("/phoenix/:tokenId", async function (request, response) {
  console.log("Get Phoenix tokenId image: ", request.params.tokenId);

  try {
    const owner = await phoenixContract.ownerOf(parseInt(request.params.tokenId));
    console.log("Owner: ", owner);

    const xPoapBalance = await xPoapContract.balanceOf(owner);
    console.log("xPoapBalance: ", xPoapBalance.toString());

    const svg = `
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <style>
    .text { font-size: 50px; }
  </style>
  <g id="poap">
    <ellipse stroke-width="3" ry="150" rx="150" id="svg_1" cy="200" cx="200" stroke="#000" fill="#fff"/>
    <text x="50%" y="50%" text-anchor="middle" stroke-width="2px" dy=".3em" class="text">${xPoapBalance} POAPs</text>
  </g>
</svg>
    `;

    response.setHeader('Content-Type', 'image/svg+xml');
    response.send(svg);
  } catch (exception) {
    console.log(exception);
    response.status(500).send('Error retrieving image');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});