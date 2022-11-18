const path = require("path");
const os = require("os");
const fs = require("fs/promises");
const { NodeJs } = require("@akord/akord-js/lib/types/file");

export async function createFile(content, name) {
  dir = await fs.mkdtemp(path.join(os.tempdir(), "scaffold-eth-"));
  const filepath = path.join(dir, name);
  await fs.writeFile(filepath, content, "utf-8");
  return new NodeJs.File(filepath);
}
