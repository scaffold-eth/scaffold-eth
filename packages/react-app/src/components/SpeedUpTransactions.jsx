import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { TransactionManager } from "../helpers/TransactionManager";
import { TransactionResponseDisplay } from "./";

const { BigNumber, ethers } = require("ethers");

export default function SpeedUpTransactions({provider, signer, injectedProvider}) {
  const transactionManager = new TransactionManager(provider, signer, true);

  const [transactionResponsesArray, setTransactionResponsesArray] = useState();

  const initTransactionResponsesArray = async() => {
    if (injectedProvider !== undefined) {
      setTransactionResponsesArray([]);
      return;
    }

    let chainId = (await provider.getNetwork()).chainId;

    let transactionResponsesArray = transactionManager.getTransactionResponsesArray();

    setTransactionResponsesArray(filterResponsesByChainId(transactionResponsesArray, chainId));  
  }

  const filterResponsesByChainId = (transactionResponsesArray, chainId) => {
     return transactionResponsesArray.filter(transactionResponse => (transactionResponse.chainId == chainId))
  }

  useEffect(() => {
    initTransactionResponsesArray();
  }, [injectedProvider]);

  useEffect(() => {
    // Listen for storage change events from the same and from other windows as well
    window.addEventListener("storage", initTransactionResponsesArray);
    window.addEventListener(transactionManager.getLocalStorageChangedEventName(), initTransactionResponsesArray);

    return () => {
      window.removeEventListener("storage", initTransactionResponsesArray);
      window.removeEventListener(transactionManager.getLocalStorageChangedEventName(), initTransactionResponsesArray);
    }
  }, []);

  if (!transactionResponsesArray) {
    return  (
      <div>
      </div>
    );
  }

  return  (
    <div>  
       {transactionResponsesArray.map(
        transactionResponse => {
          return (
            <TransactionResponseDisplay key={transactionResponse.nonce} transactionResponse={transactionResponse} transactionManager={transactionManager}/>
          )
        })
       }
    </div>
  );
}
