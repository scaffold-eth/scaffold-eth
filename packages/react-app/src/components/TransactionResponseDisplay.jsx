import { Button, Popover } from "antd";
import React, { useEffect, useState } from "react";

import { TransactionManager } from "../helpers/TransactionManager";

const { BigNumber, ethers } = require("ethers");

export default function TransactionResponseDisplay({transactionResponse, transactionManager}) {
  const [confirmations, setConfirmations] = useState();
  const [loading, setLoading] = useState(false);

  const updateConfirmations = async () => {
    let confirmations = await transactionManager.getConfirmations(transactionResponse);

    if (confirmations >= 5) {
      transactionManager.removeTransactionResponse(transactionResponse);
    }

    setConfirmations(confirmations);
  }

  transactionManager.log("Pending tx:", transactionResponse.nonce, transactionResponse.hash, confirmations);

  useEffect(() => {
    updateConfirmations();
  },[transactionResponse, transactionManager]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateConfirmations();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTransactionPopoverContent = () => {
    return (
      <div>
        <p><b>From:</b> {transactionResponse.from}</p>
        <p><b>To:</b> {transactionResponse.to}</p>
        <p><b>Value:</b> {ethers.utils.formatEther(BigNumber.from(transactionResponse.value).toString())} Ξ</p>
        <p><b>Hash:</b> {transactionResponse.hash}</p>
      </div>);
  }

  const getGasPriceGwei = () => {
    let gasPrice = transactionResponse.gasPrice ? transactionResponse.gasPrice : transactionResponse.maxPriorityFeePerGas;

    let gasPriceGwei = ethers.utils.formatUnits(gasPrice, "gwei");

    return gasPriceGwei.substring(0,5);
  }

  const handleSpeedUp = async (nonce, speedUpPercentage) => {
    setLoading(true);

    let newTransactionResponse;
    try {
      newTransactionResponse = await transactionManager.speedUpTransaction(transactionResponse.nonce, 10);
      transactionManager.log("handleSpeedUp", newTransactionResponse, transactionResponse.hash);
    }
    catch(error){
      transactionManager.log("speedUpTransaction failed, previous transactionHash was probably comfirmed in the meantime", transactionResponse.hash, error);
    }

    setLoading(false);

    if (newTransactionResponse) {
      transactionManager.setTransactionResponse(newTransactionResponse);  
    }
    else {
      transactionManager.log("newTransactionResponse is undefined", transactionResponse.nonce);
    }
  }

  return  (
    <div style={{ padding: 16 }}>
      {(confirmations == 0) &&     
        <div>
        
          <div>
            <Popover placement="right" content={getTransactionPopoverContent()} trigger="click">
              <Button style={{ padding: 0 }}type="link" >Transaction</Button>
            </Popover><b> {transactionResponse.nonce} </b> is pending, <b> gasPrice: {getGasPriceGwei()} </b>
          </div>
        
        <Button 
          style={{ margin: 16 }}
          onClick={async () => {
            await handleSpeedUp(transactionResponse.nonce, 10);
          }}
          size="large"
          shape="round"
          loading={loading}
          disabled={loading}
         >
          Speed Up 10% 
         </Button>
        </div>
     }
    </div>
  );
}
