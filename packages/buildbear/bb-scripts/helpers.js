const fs = require("fs");
const path = require("path");

function createNewDeployment(node, mnemonic) {
  fs.writeFileSync(
    path.join(__dirname, "./nodes.json"),
    JSON.stringify(node, null, 2)
  );

  if (mnemonic)
    fs.writeFileSync(path.join(__dirname, "./mnemonic.txt"), mnemonic);
}

module.exports = { createNewDeployment };
