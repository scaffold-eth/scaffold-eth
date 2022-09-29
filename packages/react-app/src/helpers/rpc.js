import { LOCAL_RPC_POLL_TIME } from "../constants";

export const getRPCPollTime = provider => {
  // No polling interval on local hardhat chain.
  // check `LOCAL_RPC_POLL_TIME` for more info.
  if (provider?._network?.chainId === 31337) {
    return 0;
  } else {
    return LOCAL_RPC_POLL_TIME;
  }
};
