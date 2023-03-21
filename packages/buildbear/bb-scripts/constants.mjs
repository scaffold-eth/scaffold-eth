export const BB_BACKEND_URL = "http://localhost:5000";
export const BB_API_KEY = "BB_a55d709e-9513-4f81-973a-6681d36e0970";
export const BASE_URL = "dev.buildbear.io";

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
