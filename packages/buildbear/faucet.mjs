import { ethers } from "ethers";
import axios from "axios";
import ora from "ora";
import {
  BB_API_KEY,
  BB_BACKEND_URL,
  bbSupportedERC20Tokens,
} from "./constants.mjs";
import { readNodes } from "./helpers.mjs";

const nodesData = readNodes();
const args = process.argv.slice(2);
const erc20Tokens = bbSupportedERC20Tokens[nodesData.forkingChainId];
const erc20TokenNames = Object.keys(erc20Tokens);

function nativeFaucet() {
  const spinner = ora("Faucet is minting native tokens").start();

  let walletAddress;
  let balance = "100";

  if (ethers.utils.isAddress(args[1])) walletAddress = args[1];
  else {
    balance = args[1].toString();
    walletAddress = args[2];
  }

  const data = JSON.stringify({
    address: walletAddress,
    balance,
  });

  const config = {
    method: "post",
    url: `${BB_BACKEND_URL}/node/faucet/native/${nodesData.nodeId}`,
    headers: {
      Authorization: `Bearer ${BB_API_KEY}`,
      "Content-Type": "application/json",
    },
    data,
  };

  axios(config)
    .then(() => {
      spinner.succeed(`${balance} native tokens added to ${walletAddress}`);
    })
    .catch(function (error) {
      spinner.fail(error);
    });
}

function erc20Faucet() {
  const spinner = ora(`Faucet is minting ${args[0]}`).start();
  const tokenAddress = erc20Tokens[args[0]].address;
  let walletAddress;
  let balance = "100";

  if (ethers.utils.isAddress(args[1])) walletAddress = args[1];
  else {
    balance = args[1].toString();
    walletAddress = args[2];
  }

  const data = JSON.stringify({
    address: walletAddress,
    token: tokenAddress,
    balance,
  });

  const config = {
    method: "post",
    url: `${BB_BACKEND_URL}/node/faucet/erc20/${nodesData.nodeId}`,
    headers: {
      Authorization: `Bearer ${BB_API_KEY}`,
      "Content-Type": "application/json",
    },
    data,
  };

  axios(config)
    .then(() => {
      spinner.succeed(`${balance} ${args[0]} tokens added to ${walletAddress}`);
    })
    .catch(function (error) {
      spinner.fail(error);
    });
}

function isNum(val) {
  if (val) return /^\d+$/.test(val);

  return null;
}

if (
  args[0] === "native" &&
  (ethers.utils.isAddress(args[1]) ||
    (isNum(args[1]) && ethers.utils.isAddress(args[2])))
)
  nativeFaucet();
else if (
  erc20TokenNames.includes(args[0]) &&
  (ethers.utils.isAddress(args[1]) ||
    (isNum(args[1]) && ethers.utils.isAddress(args[2])))
)
  erc20Faucet();
else {
  console.log("Wrong command format");
  console.log("Faucet command format: ");
  console.log(
    "1. For native tokens use: yarn faucet-bb native <Insert Amount (optional)> <Insert Your Wallet Address>"
  );
  console.log(
    "1. For erc20 tokens use: yarn faucet-bb USDC <Insert Amount (optional)> <Insert Your Wallet Address>"
  );
  console.log("Instead of USDC you can use :");
  erc20TokenNames.forEach((token) => {
    console.log(token);
  });
}
