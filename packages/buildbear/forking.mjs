import inquirer from "inquirer";
import axios from "axios";
import { ethers } from "ethers";
import ora from "ora";
import {
  BB_BACKEND_URL,
  BB_API_KEY,
  networks,
  networkData,
} from "./constants.mjs";
import { createNewDeployment } from "./helpers.mjs";

async function getBlockNumber(rpc) {
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const chainId = (await provider.getNetwork()).chainId;

  function getLargestPossibleReorg() {
    // mainnet
    if (chainId === 1) {
      return 5;
    }

    // Goerli
    if (chainId === 5) {
      return 5;
    }

    // Polygon
    if (chainId === 137) {
      return 50;
    }

    // Polygon Mumbai
    if (chainId === 80001) {
      return 50;
    }

    // BSC
    if (chainId === 56) {
      return 50;
    }

    return null;
  }

  const FALLBACK_MAX_REORG = 200;

  const actualMaxReorg = getLargestPossibleReorg(chainId);
  const maxReorg = actualMaxReorg || FALLBACK_MAX_REORG;

  const latestBlock = await provider.getBlockNumber();
  const lastSafeBlock = latestBlock - maxReorg;

  return lastSafeBlock;
}

async function createFork() {
  let latestBlockNumber = 0;
  let blockNumber = 0;
  let network;
  let chainId;
  let rpc;

  const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;

  await inquirer
    .prompt([
      {
        type: "list",
        name: "network",
        message: "Choose forking network",
        choices: networks,
      },
    ])
    .then(async (response) => {
      network = response.network;
      chainId = networkData[network][0];
      rpc = networkData[network][1];
      latestBlockNumber = await getBlockNumber(rpc);

      await inquirer
        .prompt([
          {
            type: "number",
            name: "blockNumber",
            message: "Fork from block number...",
            default: latestBlockNumber,
          },
        ])
        .then((value) => {
          blockNumber = value.blockNumber;
        });
    });

  const createNodeSpinner = ora(
    `Creating a new ${network} fork on Buildbear...`
  ).start();

  const data = JSON.stringify({
    checked: false,
    allowUnlimitedContractSize: false,
    mining: {
      auto: true,
      interval: 0,
    },
    accounts: {
      // eslint-disable-next-line object-shorthand
      mnemonic: mnemonic,
    },
    options: {
      hardhat: {
        getStackTraceFailuresCount: true,
        addCompilationResult: true,
        impersonateAccount: true,
        intervalMine: false,
        getAutomine: false,
        stopImpersonatingAccount: true,
        reset: false,
        setLoggingEnabled: true,
        setMinGasPrice: false,
        dropTransaction: false,
        setBalance: false,
        setCode: false,
        setNonce: false,
        setStorageAt: false,
        setNextBlockBaseFeePerGas: false,
        setCoinbase: false,
        mine: true,
      },
      evm: {
        mine: true,
        increaseTime: true,
        setNextBlockTimestamp: true,
        revert: true,
        snapshot: true,
        setAutomine: false,
        setIntervalMining: false,
        setBlockGasLimit: true,
      },
      extra: {
        overrideGas: true,
      },
    },
    forking: {
      chainId,
      blockNumber,
    },
  });

  const config = {
    method: "post",
    url: `${BB_BACKEND_URL}/user/container`,
    headers: {
      Authorization: `Bearer ${BB_API_KEY}`,
      "Content-Type": "application/json",
    },
    data,
  };

  let node;

  try {
    const response = await axios(config);
    const resData = response.data;

    if (response.status === 200) {
      node = { nodeId: resData.nodeId, chainId: resData.chainId };
      createNodeSpinner.succeed("Node created successfully");
      console.log(node);
    } else {
      console.log("Error in creating node, Error: ", resData);
    }
  } catch (err) {
    console.log("Error in creating node, Error: ", err);
  }

  if (node) createNewDeployment(node, mnemonic, chainId);
}

createFork();
