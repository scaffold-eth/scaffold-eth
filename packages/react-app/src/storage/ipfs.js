// https://www.npmjs.com/package/ipfs-http-client
const ipfsAPI = require("ipfs-http-client");
const { BufferList } = require("bl");

const { projectId, projectSecret } = require("./constants");

class IPFSStorage {
  constructor(ipfs) {
    this.ipfs = ipfs;
    this.name = "ipfs";
  }

  async upload(content) {
    return await this.ipfs.add(content);
  }

  getFileFromTokenURI(tokenURI) {
    const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");
    console.log("ipfsHash", ipfsHash);
    return this.getFile(ipfsHash);
  }

  // retrieves file from IPFS
  // you usually go content.toString() after this...
  async getFile(hashToGet) {
    for await (const file of this.ipfs.get(hashToGet)) {
      console.log(file.path);
      if (!file.content) continue;
      const content = new BufferList();
      for await (const chunk of file.content) {
        content.append(chunk);
      }
      console.log(content);
      return content;
    }
  }

  static createReadOnly() {
    return IPFSStorage.create();
  }

  static create() {
    const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
    return new IPFSStorage(
      ipfsAPI({
        host: "ipfs.infura.io",
        port: "5001",
        protocol: "https",
        headers: {
          authorization: auth,
        },
      }),
    );
  }
}

module.exports = IPFSStorage;
