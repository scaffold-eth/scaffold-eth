import buildbearNode from "./nodes.json";

let bbNode = null;
if (buildbearNode.nodeId) {
  bbNode = buildbearNode;
}

export { bbNode };

// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = process.env.REACT_APP_INFURA_KEY ?? "460f40a260564ac4a4f4b3fffb032dad";
// My Alchemy Key, swap in yours from https://dashboard.alchemyapi.io/
export const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY ?? "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

// MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY ?? "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

// BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = process.env.REACT_APP_BLOCKNATIVE_DAPP_ID ?? "0b58206a-f3c0-4701-a62f-73c7243e8c77";

// Docker Hardhat Host
export const HARDHAT_HOST = process.env.REACT_APP_HARDHAT_HOST ?? "http://localhost";

// Buildbear Base URL
export const BASE_URL = "dev.buildbear.io";

// Buildbear Backend URL
export const BB_BACKEND_URL = `https://backend.${BASE_URL}`;

//nft storage api key
export const NFT_STORAGE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEwRjk4ODA4NDEzMDgxRUJENDZhOEYzZTQ2REY1YTVCMmE3MzEyMDMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzY1NzM0MTMyNTksIm5hbWUiOiJuZnQifQ.Pm3jhQc6zKo72n0nZuRx-Y1WEAZ9qfbzYUJODSql9r0";

//openAi api key
export const AI_API_KEY = "sk-hNXaioHbZRcKpIBY6vbdCN0gng7YiONRrWiclqd6dcJa5uLt";
/*
Decrease the number of RPC calls by passing this value to hooks
with pollTime (useContractReader, useBalance, etc.).
Set it to 0 to disable it and make RPC calls "onBlock".
Note: this is not used when you are in the local hardhat chain.
*/
export const RPC_POLL_TIME = 30000;

const localRpcUrl = process.env.REACT_APP_CODESPACES
  ? `https://${window.location.hostname.replace("3000", "8545")}`
  : "http://" + (global.window ? window.location.hostname : "localhost") + ":8545";

export const NETWORKS = {
  buildbear: {
    name: "buildbear",
    color: "#666666",
    chainId: bbNode ? bbNode.chainId : "",
    faucet: `https://faucet.${BASE_URL}/${bbNode ? bbNode.nodeId : ""}`,
    blockExplorer: `https://explorer.${BASE_URL}/${bbNode ? bbNode.nodeId : ""}`,
    rpcUrl: `https://rpc.${BASE_URL}/${bbNode ? bbNode.nodeId : ""}`,
    nativeCurrency: {
      name: "BB Ether",
      symbol: "BB ETH",
      decimals: 18,
    },
  },
  localhost: {
    name: "localhost",
    color: "#666666",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: localRpcUrl,
  },
  mainnet: {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
  },
  goerli: {
    name: "goerli",
    color: "#0975F6",
    chainId: 5,
    faucet: "https://goerli-faucet.slock.it/",
    blockExplorer: "https://goerli.etherscan.io/",
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
  },
  sepolia: {
    name: "sepolia",
    color: "#87ff65",
    chainId: 11155111,
    faucet: "https://faucet.sepolia.dev/",
    blockExplorer: "https://sepolia.etherscan.io/",
    rpcUrl: `https://sepolia.infura.io/v3/${INFURA_ID}`,
  },
  gnosis: {
    name: "gnosis",
    color: "#48a9a6",
    chainId: 100,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://rpc.gnosischain.com",
    faucet: "https://gnosisfaucet.com",
    blockExplorer: "https://gnosisscan.io",
  },
  zksyncalpha: {
    name: "zksyncalpha",
    color: "#45488f",
    chainId: 280,
    rpcUrl: "https://zksync2-testnet.zksync.dev",
    blockExplorer: "https://goerli.explorer.zksync.io/",
    gasPrice: 100000000,
  },
  chiado: {
    name: "chiado",
    color: "#48a9a6",
    chainId: 10200,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://rpc.chiadochain.net",
    faucet: "https://gnosisfaucet.com",
    blockExplorer: "https://blockscout.chiadochain.net",
  },
  polygon: {
    name: "polygon",
    color: "#2bbdf7",
    chainId: 137,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://polygon-rpc.com/",
    blockExplorer: "https://polygonscan.com/",
  },
  mumbai: {
    name: "mumbai",
    color: "#92D9FA",
    chainId: 80001,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    faucet: "https://faucet.polygon.technology/",
    blockExplorer: "https://mumbai.polygonscan.com/",
  },
  localOptimismL1: {
    name: "localOptimismL1",
    color: "#f01a37",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: "http://" + (global.window ? window.location.hostname : "localhost") + ":9545",
  },
  localOptimism: {
    name: "localOptimism",
    color: "#f01a37",
    chainId: 420,
    blockExplorer: "",
    rpcUrl: "http://" + (global.window ? window.location.hostname : "localhost") + ":8545",
    gasPrice: 0,
  },
  goerliOptimism: {
    name: "goerliOptimism",
    color: "#f01a37",
    chainId: 420,
    blockExplorer: "https://optimism.io",
    rpcUrl: `https://goerli.optimism.io/`,
    gasPrice: 0,
  },
  optimism: {
    name: "optimism",
    color: "#f01a37",
    chainId: 10,
    blockExplorer: "https://optimistic.etherscan.io/",
    rpcUrl: `https://mainnet.optimism.io`,
  },
  goerliArbitrum: {
    name: "goerliArbitrum",
    color: "#28a0f0",
    chainId: 421613,
    blockExplorer: "https://goerli-rollup-explorer.arbitrum.io",
    rpcUrl: "https://goerli-rollup.arbitrum.io/rpc/",
  },
  arbitrum: {
    name: "arbitrum",
    color: "#28a0f0",
    chainId: 42161,
    blockExplorer: "https://arbiscan.io/",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
  },
  devnetArbitrum: {
    name: "devnetArbitrum",
    color: "#28a0f0",
    chainId: 421612,
    blockExplorer: "https://nitro-devnet-explorer.arbitrum.io/",
    rpcUrl: "https://nitro-devnet.arbitrum.io/rpc",
  },
  localAvalanche: {
    name: "localAvalanche",
    color: "#666666",
    chainId: 43112,
    blockExplorer: "",
    rpcUrl: `http://localhost:9650/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  fujiAvalanche: {
    name: "fujiAvalanche",
    color: "#666666",
    chainId: 43113,
    blockExplorer: "https://cchain.explorer.avax-test.network/",
    rpcUrl: `https://api.avax-test.network/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  mainnetAvalanche: {
    name: "mainnetAvalanche",
    color: "#666666",
    chainId: 43114,
    blockExplorer: "https://cchain.explorer.avax.network/",
    rpcUrl: `https://api.avax.network/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  testnetHarmony: {
    name: "testnetHarmony",
    color: "#00b0ef",
    chainId: 1666700000,
    blockExplorer: "https://explorer.pops.one/",
    rpcUrl: `https://api.s0.b.hmny.io`,
    gasPrice: 1000000000,
  },
  mainnetHarmony: {
    name: "mainnetHarmony",
    color: "#00b0ef",
    chainId: 1666600000,
    blockExplorer: "https://explorer.harmony.one/",
    rpcUrl: `https://api.harmony.one`,
    gasPrice: 1000000000,
  },
  fantom: {
    name: "fantom",
    color: "#1969ff",
    chainId: 250,
    blockExplorer: "https://ftmscan.com/",
    rpcUrl: `https://rpcapi.fantom.network`,
    gasPrice: 1000000000,
  },
  testnetFantom: {
    name: "testnetFantom",
    color: "#1969ff",
    chainId: 4002,
    blockExplorer: "https://testnet.ftmscan.com/",
    rpcUrl: `https://rpc.testnet.fantom.network`,
    gasPrice: 1000000000,
    faucet: "https://faucet.fantom.network/",
  },
  moonbeam: {
    name: "moonbeam",
    color: "#53CBC9",
    chainId: 1284,
    blockExplorer: "https://moonscan.io",
    rpcUrl: "https://rpc.api.moonbeam.network",
  },
  moonriver: {
    name: "moonriver",
    color: "#53CBC9",
    chainId: 1285,
    blockExplorer: "https://moonriver.moonscan.io/",
    rpcUrl: "https://rpc.api.moonriver.moonbeam.network",
  },
  moonbaseAlpha: {
    name: "moonbaseAlpha",
    color: "#53CBC9",
    chainId: 1287,
    blockExplorer: "https://moonbase.moonscan.io/",
    rpcUrl: "https://rpc.api.moonbase.moonbeam.network",
    faucet: "https://discord.gg/SZNP8bWHZq",
  },
  moonbeamDevNode: {
    name: "moonbeamDevNode",
    color: "#53CBC9",
    chainId: 1281,
    blockExplorer: "https://moonbeam-explorer.netlify.app/",
    rpcUrl: "http://127.0.0.1:9933",
  },
};

export const NETWORK = chainId => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};

export const bbSupportedERC20Tokens = {
  1: {
    USDC: {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      slots: {
        balance: "0x9",
        totalSupply: "0xb",
      },
    },
    DAI: {
      name: "Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      slots: {
        balance: "0x2",
        totalSupply: "0x1",
      },
    },
    USDT: {
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      slots: {
        balance: "0x2",
        totalSupply: "0x1",
      },
    },
    BNB: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
      address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
      slots: {
        balance: "0x5",
        totalSupply: "0x3",
      },
    },
    BUSD: {
      name: "Binance USD",
      symbol: "BUSD",
      decimals: 18,
      address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
      slots: {
        balance: "0x1",
        totalSupply: "0x2",
      },
    },
    MATIC: {
      name: "Matic Token",
      symbol: "MATIC",
      decimals: 18,
      address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    WBTC: {
      name: "Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      slots: {
        balance: "0x0",
        totalSupply: "0x1",
      },
    },
    UNI: {
      name: "Uniswap",
      symbol: "UNI",
      decimals: 18,
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      slots: {
        balance: "0x4",
        totalSupply: "0x0",
      },
    },
    AAVE: {
      name: "Aave Token",
      symbol: "AAVE",
      decimals: 18,
      address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
  },
  56: {
    USDC: {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 18,
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      slots: {
        balance: "0x1",
        totalSupply: "0x3",
      },
    },
    DAI: {
      name: "Dai Token",
      symbol: "DAI",
      decimals: 18,
      address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
      slots: {
        balance: "0x1",
        totalSupply: "0x3",
      },
    },
    BUSD: {
      name: "BUSD Token",
      symbol: "BUSD",
      decimals: 18,
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      slots: {
        balance: "0x1",
        totalSupply: "0x3",
      },
    },
    MATIC: {
      name: "Matic Token",
      symbol: "MATIC",
      decimals: 18,
      address: "0xCC42724C6683B7E57334c4E856f4c9965ED682bD",
      slots: {
        balance: "0x1",
        totalSupply: "0x3",
      },
    },
    AAVE: {
      name: "Aave Token",
      symbol: "AAVE",
      decimals: 18,
      address: "0xfb6115445Bff7b52FeB98650C87f44907E58f802",
      slots: {
        balance: "0x1",
        totalSupply: "0x3",
      },
    },
  },
  137: {
    USDC: {
      name: "USD Coin (PoS)",
      symbol: "USDC",
      decimals: 6,
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    DAI: {
      name: "(PoS) Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    USDT: {
      name: "(PoS) Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    WBTC: {
      name: "(PoS) Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    UNI: {
      name: "Uniswap (PoS)",
      symbol: "UNI",
      decimals: 18,
      address: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    AAVE: {
      name: "Aave (PoS)",
      symbol: "AAVE",
      decimals: 18,
      address: "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
  },
  10: {
    USDC: {
      name: "USD Coin (PoS)",
      symbol: "USDC",
      decimals: 6,
      address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    DAI: {
      name: "(PoS) Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    USDT: {
      name: "(PoS) Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    WBTC: {
      name: "(PoS) Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    LINK: {
      name: "Chainlink (PoS)",
      symbol: "LINK",
      decimals: 18,
      address: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    AAVE: {
      name: "Aave (PoS)",
      symbol: "AAVE",
      decimals: 18,
      address: "0x76FB31fb4af56892A25e32cFC43De717950c9278",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
  },
  42161: {
    USDC: {
      name: "USD Coin (PoS)",
      symbol: "USDC",
      decimals: 6,
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    DAI: {
      name: "(PoS) Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    USDT: {
      name: "(PoS) Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    WBTC: {
      name: "(PoS) Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    LINK: {
      name: "Chainlink (PoS)",
      symbol: "LINK",
      decimals: 18,
      address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    AAVE: {
      name: "Aave (PoS)",
      symbol: "AAVE",
      decimals: 18,
      address: "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
  },
  250: {
    USDC: {
      name: "USD Coin (PoS)",
      symbol: "USDC",
      decimals: 6,
      address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    DAI: {
      name: "(PoS) Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      address: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    USDT: {
      name: "(PoS) Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    WBTC: {
      name: "(PoS) Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      address: "0x321162Cd933E2Be498Cd2267a90534A804051b11",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    LINK: {
      name: "Chainlink (PoS)",
      symbol: "LINK",
      decimals: 18,
      address: "0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    AAVE: {
      name: "Aave (PoS)",
      symbol: "AAVE",
      decimals: 18,
      address: "0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
    WETH: {
      name: "Wrapped Ether (PoS)",
      symbol: "WETH",
      decimals: 18,
      address: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
      slots: {
        balance: "0x0",
        totalSupply: "0x2",
      },
    },
  },
};
