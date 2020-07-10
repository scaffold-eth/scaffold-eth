const ipfsAPI = require('ipfs-http-client');
const { globSource } = ipfsAPI
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
//run your own ipfs daemon: https://docs.ipfs.io/how-to/command-line-quick-start/#install-ipfs
//const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http' })

const addOptions = {
  //pin: true,//uncomment for localhost
  wrapWithDirectory: true,
  timeout: 120000
};

const deploy = async ()=>{
  console.log("🛰  Sending to IPFS...")
  for await (const file of ipfs.add(globSource('./build', {recursive: true}), addOptions)) {
    if(file.path=="build"){
      console.log("BUILD:\n",file)
    }else{
      console.log(file.path)
    }
  }
}
deploy()


const getFromIPFS = async hashToGet => {
  for await (const file of ipfs.get(hashToGet)) {
    console.log(file.path)
    if (!file.content) continue;
    const content = new BufferList()
    for await (const chunk of file.content) {
      content.append(chunk)
    }
    console.log(content)
    return content
  }
}

const addToIPFS = async fileToUpload => {
  for await (const result of ipfs.add(fileToUpload)) {
    return result
  }
}
