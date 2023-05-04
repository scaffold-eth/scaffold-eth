export const BASE_URL = "buildbear.io";
export const BB_BACKEND_URL = `https://backend.${BASE_URL}`;
export const BB_API_KEY = "BB_a55d709e-9513-4f81-973a-6681d36e0970";

export const networkData = {
  "Ethereum Mainnet": [1, "https://rpc.ankr.com/eth"],
  "Binance Smart Chain": [56, "https://rpc.ankr.com/bsc"],
  "Polygon Mainnet": [137, "https://rpc.ankr.com/polygon"],
  "Polygon Testnet": [80001, "https://rpc.ankr.com/polygon_mumbai"],
  "Goerli Testnet": [5, "https://rpc.ankr.com/eth_goerli"],
  "Optimism Mainnet": [10, "https://mainnet.optimism.io"],
  "Arbitrum Mainnet": [42161, "https://arb1.arbitrum.io/rpc"],
  "Arbitrum Goerli": [421613, "https://goerli-rollup.arbitrum.io/rpc"],
  "Fantom Mainnet": [250, "https://rpc.fantom.network"],
  "Fantom Testnet": [4002, "https://rpc.ankr.com/fantom_testnet"],
  "Sepolia Testnet": [11155111, "https://rpc.sepolia.org"],
};

export const networks = Object.keys(networkData);

export const bbSupportedERC20Tokens = {
  1: {
    USDC: {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    DAI: {
      name: "Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    USDT: {
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    BNB: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
      address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    },
    BUSD: {
      name: "Binance USD",
      symbol: "BUSD",
      decimals: 18,
      address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
    },
    MATIC: {
      name: "Matic Token",
      symbol: "MATIC",
      decimals: 18,
      address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    },
    WBTC: {
      name: "Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    },
    UNI: {
      name: "Uniswap",
      symbol: "UNI",
      decimals: 18,
      address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    },
    AAVE: {
      name: "Aave Token",
      symbol: "AAVE",
      decimals: 18,
      address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    },
  },
  56: {
    USDC: {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 18,
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    },
    DAI: {
      name: "Dai Token",
      symbol: "DAI",
      decimals: 18,
      address: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
    },
    BUSD: {
      name: "BUSD Token",
      symbol: "BUSD",
      decimals: 18,
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    },
    MATIC: {
      name: "Matic Token",
      symbol: "MATIC",
      decimals: 18,
      address: "0xCC42724C6683B7E57334c4E856f4c9965ED682bD",
    },
    AAVE: {
      name: "Aave Token",
      symbol: "AAVE",
      decimals: 18,
      address: "0xfb6115445Bff7b52FeB98650C87f44907E58f802",
    },
  },
  137: {
    USDC: {
      name: "USD Coin (PoS)",
      symbol: "USDC",
      decimals: 6,
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    },
    DAI: {
      name: "(PoS) Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    },
    USDT: {
      name: "(PoS) Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    },
    WBTC: {
      name: "(PoS) Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
    },
    UNI: {
      name: "Uniswap (PoS)",
      symbol: "UNI",
      decimals: 18,
      address: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
    },
    AAVE: {
      name: "Aave (PoS)",
      symbol: "AAVE",
      decimals: 18,
      address: "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
    },
  },
  10: {
    USDC: {
      name: "USD Coin (PoS)",
      symbol: "USDC",
      decimals: 6,
      address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    },
    DAI: {
      name: "(PoS) Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    },
    USDT: {
      name: "(PoS) Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
    },
    WBTC: {
      name: "(PoS) Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    },
    LINK: {
      name: "Chainlink (PoS)",
      symbol: "LINK",
      decimals: 18,
      address: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6",
    },
    AAVE: {
      name: "Aave (PoS)",
      symbol: "AAVE",
      decimals: 18,
      address: "0x76FB31fb4af56892A25e32cFC43De717950c9278",
    },
  },
  42161: {
    USDC: {
      name: "USD Coin (PoS)",
      symbol: "USDC",
      decimals: 6,
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    },
    DAI: {
      name: "(PoS) Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    },
    USDT: {
      name: "(PoS) Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    },
    WBTC: {
      name: "(PoS) Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    },
    LINK: {
      name: "Chainlink (PoS)",
      symbol: "LINK",
      decimals: 18,
      address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    },
    AAVE: {
      name: "Aave (PoS)",
      symbol: "AAVE",
      decimals: 18,
      address: "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196",
    },
  },
  250: {
    USDC: {
      name: "USD Coin (PoS)",
      symbol: "USDC",
      decimals: 6,
      address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    },
    DAI: {
      name: "(PoS) Dai Stablecoin",
      symbol: "DAI",
      decimals: 18,
      address: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    },
    USDT: {
      name: "(PoS) Tether USD",
      symbol: "USDT",
      decimals: 6,
      address: "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
    },
    WBTC: {
      name: "(PoS) Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      address: "0x321162Cd933E2Be498Cd2267a90534A804051b11",
    },
    LINK: {
      name: "Chainlink (PoS)",
      symbol: "LINK",
      decimals: 18,
      address: "0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8",
    },
    AAVE: {
      name: "Aave (PoS)",
      symbol: "AAVE",
      decimals: 18,
      address: "0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B",
    },
    WETH: {
      name: "Wrapped Ether (PoS)",
      symbol: "WETH",
      decimals: 18,
      address: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
    },
  },
};
