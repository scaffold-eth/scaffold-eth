// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad";

//MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
const ETHERSCAN_KEY = "PSW8C433Q667DVEX5BCRMGNAH9FSGFZ7Q8";

//BLOCKNATIVE ID FOR Notify.js:
const BLOCKNATIVE_DAPPID = "0b58206a-f3c0-4701-a62f-73c7243e8c77"

const THEGRAPH = {
    localhost: {
        ipfsUri: "http://localhost:5001/api/v0",
        subgraphUri: "http://localhost:8000/subgraphs/name/scaffold-eth/good-tokens"
    },
    hosted: {
        ipfsUri: "https://api.thegraph.com/ipfs/api/v0",
        subgraphUri: "https://api.thegraph.com/subgraphs/name/jasperdegens/good-tokens"
    }
}

const LINK_ADDRESS = {
    'rinkeby': '0x01be23585060835e02b77ef475b0cc51aa1e0709',
    'kovan': '0xa36085F69e2889c224210F603D836748e7dC0088',
}


const NETWORK = (chainId)=>{
  for(let n in NETWORKS){
    if(NETWORKS[n].chainId==chainId){
      return NETWORKS[n]
    }
  }
}

const NETWORKS = {
    localhost: {
        name: "localhost",
        color: '#666666',
        chainId: 31337,
        blockExplorer: '',
        rpcUrl: "http://localhost:8545",
    },
    mainnet: {
        name: "mainnet",
        color: '#ff8b9e',
        chainId: 1,
        rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
        blockExplorer: "https://etherscan.io/",
    },
    kovan: {
        name: "kovan",
        color: '#7003DD',
        chainId: 42,
        rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
        blockExplorer: "https://kovan.etherscan.io/",
        faucet: "https://gitter.im/kovan-testnet/faucet",//https://faucet.kovan.network/
    },
    rinkeby: {
        name: "rinkeby",
        color: '#e0d068',
        chainId: 4,
        rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
        faucet: "https://faucet.rinkeby.io/",
        blockExplorer: "https://rinkeby.etherscan.io/",
    },
    ropsten: {
        name: "ropsten",
        color: '#F60D09',
        chainId: 3,
        faucet: "https://faucet.ropsten.be/",
        blockExplorer: "https://ropsten.etherscan.io/",
        rpcUrl: `https://ropsten.infura.io/v3/${INFURA_ID}`,
    },
    goerli: {
        name: "goerli",
        color: '#0975F6',
        chainId: 5,
        faucet: "https://goerli-faucet.slock.it/",
        blockExplorer: "https://goerli.etherscan.io/",
        rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
    },
    xdai: {
        name: "xdai",
        color: '#48a9a6',
        chainId: 100,
        price: 1,
        gasPrice:1000000000,
        rpcUrl: "https://dai.poa.network",
        faucet: "https://xdai-faucet.top/",
        blockExplorer: "https://blockscout.com/poa/xdai/",
    },
    matic: {
        name: "matic",
        color: '#2bbdf7',
        chainId: 137,
        price: 1,
        gasPrice:1000000000,
        rpcUrl: "https://rpc-mainnet.maticvigil.com",
        faucet: "https://faucet.matic.network/",
        blockExplorer: "https://explorer-mainnet.maticvigil.com//",
    },
    mumbai: {
        name: "mumbai",
        color: '#92D9FA',
        chainId: 80001,
        price: 1,
        gasPrice:1000000000,
        rpcUrl: "https://rpc-mumbai.maticvigil.com",
        faucet: "https://faucet.matic.network/",
        blockExplorer: "https://mumbai-explorer.matic.today/",
    }
}

module.exports.INFURA_ID = INFURA_ID
module.exports.ETHERSCAN_KEY = ETHERSCAN_KEY
module.exports.BLOCKNATIVE_DAPPID = BLOCKNATIVE_DAPPID
module.exports.THEGRAPH = THEGRAPH
module.exports.NETWORK = NETWORK
module.exports.NETWORKS = NETWORKS
module.exports.LINK_ADDRESS = LINK_ADDRESS;