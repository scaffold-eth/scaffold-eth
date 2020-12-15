import React from "react";

import { EthersContext } from "../context";

export default function EthersContextProvider({ value = { provider: 1 }, children }) {
  return <EthersContext.Provider value={value}>{children}</EthersContext.Provider>;
}