import { ETHERSCAN_KEY } from "../constants";

import React, { useEffect, useState } from "react";
const { ethers } = require("ethers");

export default function TransactionHistory({ address }) {
  let provider = new ethers.providers.EtherscanProvider(null, ETHERSCAN_KEY);

  const [history, setHistory] = useState();

  useEffect(() => {
    async function getHistory() {
      let history = await provider.getHistory(address);
      setHistory(history);
    }

    if (address) {
      getHistory();  
    }
    
  }, [address])

  return  (
    <div>  
       TransactionHistory

       {history && history[0].hash}
    </div>
  );
}
