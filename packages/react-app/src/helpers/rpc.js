import { LOCAL_RPC_POLL_TIME } from "../constants";

export const getRPCPollTime = provider => {
  // If using local hardhat-chain then return pollInterval as 0 else set to 5000, checkout `LOCAL_RPC_POLL_TIME` for more description
  if (provider && provider._network.chainId === 31337) {
    return 0;
  } else {
    return LOCAL_RPC_POLL_TIME;
  }
};
