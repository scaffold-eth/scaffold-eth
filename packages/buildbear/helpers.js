const fs = require("fs");
const path = require("path");

function readNodes() {
  let nodes = null;

  try {
    nodes = JSON.parse(
      fs.readFileSync(path.join(__dirname, "./nodes.json")).toString().trim()
    );
  } catch (e) {
    console.log(e);
  }

  return nodes;
}

function createNewDeployment(node, mnemonic) {
  fs.writeFileSync(
    path.join(__dirname, "./nodes.json"),
    JSON.stringify(node, null, 2)
  );

  fs.writeFileSync(
    path.join(__dirname, "../react-app/src/nodes.json"),
    JSON.stringify(node, null, 2)
  );

  if (mnemonic)
    fs.writeFileSync(path.join(__dirname, "./mnemonic.txt"), mnemonic);
}

module.exports = { readNodes, createNewDeployment };
