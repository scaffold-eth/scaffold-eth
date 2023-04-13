import axios from "axios";
import { ethers } from "ethers";
import { BB_BACKEND_URL, BB_API_KEY } from "./constants.mjs";
import { readNodes, createNewDeployment } from "./helpers.mjs";

async function checkExistingNode() {
  const existingNode = readNodes();

  if (existingNode && existingNode.nodeId) {
    const config = {
      method: "get",
      url: `${BB_BACKEND_URL}/user/container`,
      headers: {
        Authorization: `Bearer ${BB_API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios(config);
      const data = response.data;

      if (data.length > 0) {
        let nodeIsLive = false;

        // eslint-disable-next-line no-restricted-syntax
        for (const node of data) {
          if (node.nodeId === existingNode.nodeId && node.status === "live")
            nodeIsLive = true;
        }

        if (nodeIsLive) return existingNode;
      }

      return null;
    } catch (err) {
      console.log(err);
    }
  }

  return null;
}

async function createNode() {
  console.log("Creating new Buildbear Node...");
  // check for existing node
  let node = await checkExistingNode();

  const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;

  if (node) {
    console.log("Node already exists");
    console.log(node);
  } else {
    const data = JSON.stringify({
      checked: false,
      allowUnlimitedContractSize: false,
      mining: {
        auto: true,
        interval: 0,
      },
      accounts: {
        mnemonic,
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

    try {
      const response = await axios(config);
      const resData = response.data;

      if (response.status === 200) {
        node = { nodeId: resData.nodeId, chainId: resData.chainId };
        console.log("Node created successfully");
        console.log(node);
      } else {
        console.log("Error in creating node, Error: ", resData);
      }
    } catch (err) {
      console.log("Error in creating node, Error: ", err);
    }

    if (node) createNewDeployment(node, mnemonic);
  }
}

createNode();
