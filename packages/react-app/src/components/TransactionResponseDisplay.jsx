import { Button, Popover } from "antd";
import React, { useEffect, useState } from "react";

import { TransactionManager } from "../helpers/TransactionManager";

const { BigNumber, ethers } = require("ethers");

export default function TransactionResponseDisplay({transactionResponse, transactionManager}) {
  const [confirmations, setConfirmations] = useState();
  const [loadingSpeedUp, setLoadingSpeedUp] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const updateConfirmations = async () => {
    let confirmations = await transactionManager.getConfirmations(transactionResponse);

    if (confirmations >= 1) {
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
      <div style={{ margin: "1em"}}>
        {isCancelTransaction(transactionResponse) && <p style={{ marginBottom: "2em"}}><b>The original transaciton was replaced by a cancel transaction - sending 0 to yourself</b></p>}
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

  const handleSpeedUp = async (nonce, speedUpPercentage, cancelTransaction = false) => {
    if (cancelTransaction) {
      setLoadingCancel(true);
    }
    else {
      setLoadingSpeedUp(true);
    }
    

    let newTransactionResponse;
    try {
      if (cancelTransaction) {
        newTransactionResponse = await transactionManager.cancelTransaction(transactionResponse.nonce);
      }
      else {
        newTransactionResponse = await transactionManager.speedUpTransaction(transactionResponse.nonce, 10);
      }

      transactionManager.log("handleSpeedUp", newTransactionResponse, transactionResponse.hash);  
    }
    catch(error){
      transactionManager.log("speedUpTransaction failed, previous transactionHash was probably comfirmed in the meantime", transactionResponse.hash, error);
    }

    if (cancelTransaction) {
      setLoadingCancel(false);
    }
    else {
      setLoadingSpeedUp(false);
    }

    if (newTransactionResponse) {
      transactionManager.setTransactionResponse(newTransactionResponse);  
    }
    else {
      transactionManager.log("newTransactionResponse is undefined", transactionResponse.nonce);
    }
  }

  const isCancelTransaction = (transactionResponse) => {
    if ((transactionResponse?.from == transactionResponse?.to) &&
        (transactionResponse?.value == "0x") || BigNumber.from("0x0").eq(transactionResponse?.value)) {

      return true;
    }
    else {
      return false;
    }
  }

  return  (
    <div style={{ padding: 16 }}>
      {(confirmations == 0) &&     
        <div>
        
          <div style={{ textAlign: "center"}}>
            <Popover placement="right" content={getTransactionPopoverContent()} trigger="click">
              <Button style={{ padding: 0 }}type="link" >{!isCancelTransaction(transactionResponse) ? <> Transaction </> : <> Cancelling </>}</Button>
            </Popover>
            <b> {transactionResponse.nonce} </b> is pending, <b> gasPrice: {getGasPriceGwei()} </b>
            
          </div>

          <div style={ !isCancelTransaction(transactionResponse) ? { display: "flex", justifyContent: "space-between"} : {}}>
            {!isCancelTransaction(transactionResponse) && <Button 
              style={{}}
              onClick={async () => {
                await handleSpeedUp(transactionResponse.nonce, 10, true);
              }}
              size="large"
              shape="round"
              loading={loadingCancel}
              disabled={loadingSpeedUp || loadingCancel}
             >
              Cancel
             </Button>
            }

            <Button 
              style={{}}
              onClick={async () => {
                await handleSpeedUp(transactionResponse.nonce, 10);
              }}
              size="large"
              shape="round"
              loading={loadingSpeedUp}
              disabled={loadingSpeedUp || loadingCancel}
             >
              Speed Up 10%
             </Button>


          </div>

        </div>
     }
    </div>
  );
}
