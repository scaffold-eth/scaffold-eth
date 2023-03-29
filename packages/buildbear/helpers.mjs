import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function readNodes() {
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

export function createNewDeployment(node, mnemonic, forkingChainId) {
  // eslint-disable-next-line no-param-reassign
  node.forkingChainId = forkingChainId;

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
