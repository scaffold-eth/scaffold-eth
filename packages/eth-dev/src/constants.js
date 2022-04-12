// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = '95ff362df12840c98fa418bcd4b27c8a'

// MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = 'PSW8C433Q667DVEX5BCRMGNAH9FSGFZ7Q8'

// BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = '0b58206a-f3c0-4701-a62f-73c7243e8c77'

// EXTERNAL CONTRACTS

// export const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

export const getNetworkByChainId = chainId => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId == chainId) {
      return NETWORKS[n]
    }
  }
}

export const NETWORKS = {
  ethereum: {
    name: 'ethereum',
    color: '#ceb0fa',
    chainId: 1,
    price: 'uniswap',
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: 'https://etherscan.io/'
  },
  localhost: {
    name: 'localhost',
    color: '#666666',
    price: 'uniswap', // use mainnet eth price for localhost
    chainId: 31337,
    blockExplorer: '',
    rpcUrl: 'http://localhost:8545'
  },
  xdai: {
    name: 'xdai',
    color: '#48a9a6',
    chainId: 100,
    price: 1,
    nativeCurrency: {
      name: 'xDAI',
      symbol: 'xDAI',
      decimals: 18
    },
    gasPrice: 1000000000,
    rpcUrl: 'https://dai.poa.network',
    faucet: 'https://xdai-faucet.top/',
    blockExplorer: 'https://blockscout.com/poa/xdai/'
  },
  matic: {
    name: 'matic',
    color: '#2bbdf7',
    price: 'uniswap:0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    chainId: 137,
    gasPrice: 1000000000,
    rpcUrl: 'https://rpc-mainnet.maticvigil.com',
    faucet: 'https://faucet.matic.network/',
    blockExplorer: 'https://explorer-mainnet.maticvigil.com//'
  },
  kovan: {
    name: 'kovan',
    color: '#7003DD',
    chainId: 42,
    rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
    blockExplorer: 'https://kovan.etherscan.io/',
    faucet: 'https://gitter.im/kovan-testnet/faucet' // https://faucet.kovan.network/
  },
  rinkeby: {
    name: 'rinkeby',
    color: '#e0d068',
    chainId: 4,
    rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    faucet: 'https://faucet.rinkeby.io/',
    blockExplorer: 'https://rinkeby.etherscan.io/'
  },
  ropsten: {
    name: 'ropsten',
    color: '#ff4a8d',
    chainId: 3,
    faucet: 'https://faucet.ropsten.be/',
    blockExplorer: 'https://ropsten.etherscan.io/',
    rpcUrl: `https://ropsten.infura.io/v3/${INFURA_ID}`
  },
  goerli: {
    name: 'goerli',
    color: '#0975F6',
    chainId: 5,
    faucet: 'https://goerli-faucet.slock.it/',
    blockExplorer: 'https://goerli.etherscan.io/',
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`
  },
  OE: {
    name: 'OE',
    color: '#f1304a',
    chainId: 10,
    price: 'uniswap',
    blockExplorer: 'https://mainnet-l2-explorer.surge.sh',
    rpcUrl: `https://mainnet.optimism.io`
  },
  kOE: {
    name: 'kOE',
    color: '#f1809a',
    chainId: 69,
    blockExplorer: 'https://mainnet-l2-explorer.surge.sh',
    rpcUrl: `https://kovan.optimism.io`
  },
  mumbai: {
    name: 'mumbai',
    color: '#92D9FA',
    chainId: 80001,
    gasPrice: 1000000000,
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    faucet: 'https://faucet.matic.network/',
    blockExplorer: 'https://mumbai-explorer.matic.today/'
  }
}
