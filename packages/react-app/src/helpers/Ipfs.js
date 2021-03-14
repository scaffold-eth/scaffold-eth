const ipfsAPI = require('ipfs-http-client');
const BufferList = require('bl/BufferList')

export async function getFromIPFS(hashToGet, ipfsConfig) {
  const ipfs = ipfsAPI(ipfsConfig)
  for await (const file of ipfs.get(hashToGet)) {
    if (!file.content) continue;
    const content = new BufferList()
    for await (const chunk of file.content) {
      content.append(chunk)
    }
    return content
  }
}

export async function addToIPFS(fileToUpload, ipfsConfig) {
  const ipfs = ipfsAPI(ipfsConfig)
  for await (const result of ipfs.add(fileToUpload)) {
    return result
  }
}