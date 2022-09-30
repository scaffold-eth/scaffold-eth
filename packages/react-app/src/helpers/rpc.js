import { RPC_POLL_TIME } from "../constants";

// Get the appropriate polling time for a given provider.
export const getRPCPollTime = provider => {
  // No polling interval on local hardhat chain.
  if (provider?._network?.chainId === 31337) {
    return 0;
  } else {
    return RPC_POLL_TIME;
  }
};
