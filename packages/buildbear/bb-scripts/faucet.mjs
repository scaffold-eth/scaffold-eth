import { ethers } from "ethers";
import axios from "axios";
import { BB_API_KEY } from "./constants.mjs";
import nodesData from "./nodes.json" assert { type: "json" };

const args = process.argv.slice(2);

function nativeFaucet() {
  const walletAddress = args[0];
  const balance = args[1];

  const data = JSON.stringify({
    address: walletAddress,
    balance,
  });

  const config = {
    method: "post",
    url: `http://localhost:5000/node/faucet/native/${nodesData.nodeId}`,
    headers: {
      Authorization: `Bearer ${BB_API_KEY}`,
      "Content-Type": "application/json",
    },
    data,
  };

  axios(config)
    .then(() => {
      console.log("Balance updated");
    })
    .catch(function (error) {
      console.log(error);
    });
}

function erc20Faucet() {
  const walletAddress = args[0];
  const tokenAddress = args[1];
  const balance = args[2];

  const data = JSON.stringify({
    address: walletAddress,
    token: tokenAddress,
    balance,
  });

  const config = {
    method: "post",
    url: `http://localhost:5000/node/faucet/erc20/${nodesData.nodeId}`,
    headers: {
      Authorization: `Bearer ${BB_API_KEY}`,
      "Content-Type": "application/json",
    },
    data,
  };

  axios(config)
    .then(() => {
      console.log("Balance updated");
    })
    .catch(function (error) {
      console.log(error);
    });
}

function isNum(val) {
  if (val) return /^\d+$/.test(val);

  return null;
}

if (
  ethers.utils.isAddress(args[0]) &&
  ethers.utils.isAddress(args[1]) &&
  isNum(args[2])
)
  erc20Faucet();
else if (ethers.utils.isAddress(args[0]) && isNum(args[1])) nativeFaucet();
else {
  console.log("Wrong command format");
  console.log("Faucet command format: ");
  console.log(
    "1. For native tokens use: yarn faucet-bb <walletAddress> <numberOfTokes>"
  );
  console.log(
    "1. For erc20 tokens use: yarn faucet-bb <walletAddress> <tokenAddress> <numberOfTokes>"
  );
}
