const { akordEmail, akordPassword, akordVaultName } = require("./constants");
const { BufferList } = require("bl");

class AkordStorage {
  constructor(akord, vaultId) {
    this.akord = akord;
    this.vaultId = vaultId;
    this.name = "akord";
    if (this.akord && !this.vaultId) throw new Error("vaultId required");
  }

  async upload(content, name) {
    if (!this.akord) throw new Error("cannot upload in read-only mode");
    if (!name) throw new Error("name is required for Akord upload");

    const stacks = await this.akord.stack.list(this.vaultId);

    let stack = stacks.find(v => v.name === name);
    if (!stack) {
      let dir;
      let file;
      if (typeof File === "undefined") {
        const akordNodeModule = "./akord-node";
        const { createFile } = require(akordNodeModule);
        file = createFile(content, name);
        file = new NodeJs.File(filepath);
      } else {
        file = new File([content], name);
      }
      const { stackId } = await this.akord.stack.create(this.vaultId, file, name);
      if (dir) {
        await fs.rm(dir, { recursive: true });
      }
      stack = await this.akord.stack.get(stackId);
    }
    return {
      path: stack.files.at(-1).resourceTx,
    };
  }

  async getFileFromTokenURI(tokenURI) {
    const response = await fetch(tokenURI);
    const text = await response.text();
    const content = new BufferList();
    content.append(text);
    return content;
  }

  getFile(hashToGet) {
    return this.getFileFromTokenURI(`https://arweave.net/${hashToGet}`);
  }

  static async createOrGetVault(akord, vaultName) {
    const vaults = await akord.vault.list();
    let vault = vaults.find(v => v.name === vaultName);
    let vaultId;
    if (vault) {
      console.log(`found vault ${vaultName}`);
      vaultId = vault.id;
    } else {
      console.log(`creating vault ${vaultName}`);
      const newVault = await akord.vault.create(vaultName, null, true);
      vaultId = newVault.vaultId;
      console.log(`created vault ${vaultName} with id ${vaultId}`);
    }
    return vaultId;
  }

  static createReadOnly() {
    return new AkordStorage();
  }

  static async create() {
    const akordModule = "@akord/akord-js";
    const { Akord } = await import(akordModule);
    const { akord } = await Akord.auth.signIn(akordEmail, akordPassword);
    const vaultId = await this.createOrGetVault(akord, akordVaultName);
    return new AkordStorage(akord, vaultId);
  }
}

module.exports = AkordStorage;
