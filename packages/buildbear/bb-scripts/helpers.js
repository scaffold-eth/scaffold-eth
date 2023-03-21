const fs = require("fs");
const path = require("path");
const deployments = require("../../react-app/src/contracts/hardhat_contracts.json");

function createNewDeployment(node) {
  const hardhatDeployment = deployments["31337"];
  deployments[node.chainId] = [
    {
      name: "buildbear",
      chainId: node.chainId.toString(),
      contracts: hardhatDeployment[0].contracts,
    },
  ];

  // const jsonString = JSON.stringify(deployments);

  fs.writeFile(
    path.join(__dirname, "./nodes.json"),
    JSON.stringify(node),
    (err) => {
      if (err) {
        console.log("Error writing file", err);
      } else {
        console.log("Successfully wrote file");
      }
    }
  );

  // fs.writeFile(
  //   path.join(
  //     __dirname,
  //     "../../react-app/src/contracts/hardhat_contracts.json"
  //   ),
  //   jsonString,
  //   (err) => {
  //     if (err) {
  //       console.log("Error writing file", err);
  //     } else {
  //       console.log("Successfully wrote file");
  //     }
  //   }
  // );
}

module.exports = { createNewDeployment };
