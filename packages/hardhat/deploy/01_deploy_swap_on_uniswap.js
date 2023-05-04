// deploy/01_swap_on_uniswap.js

const fs = require("fs");
const path = require("path");

let bbNode;
try {
  bbNode = JSON.parse(
    fs
      .readFileSync(path.join(__dirname, "../../buildbear/nodes.json"))
      .toString()
      .trim()
  );
} catch (e) {
  console.log("No buildbear node found");
}

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { BASE_URL } = await import("../../buildbear/constants.mjs");
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const TokenSwap = await deploy("TokenSwap", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: ["0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"],
    log: true,
    // waitConfirmations: 5,
  });

  // if deploying on buildbear node print explorer link
  console.log(
    "Checkout TokenSwap at: ",
    `https://explorer.${BASE_URL}/${bbNode.nodeId}/address/${TokenSwap.address}`
  );
};
module.exports.tags = ["TokenSwap"];
