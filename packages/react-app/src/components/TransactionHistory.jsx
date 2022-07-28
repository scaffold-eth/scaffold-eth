import { ETHERSCAN_KEY } from "../constants";
import React, { useEffect, useState } from "react";
import { Avatar, Button, List } from 'antd';

import { TransactionResponseDisplay } from "./";

const { BigNumber, ethers } = require("ethers");

export default function TransactionHistory({ transactionResponsesArray, transactionManager, blockExplorer}) {
  console.log("transactionResponsesArray", transactionResponsesArray);

  const [history, setHistory] = useState();
  const [count, setCount] = useState(1);

  useEffect(() => {
      transactionResponsesArray.sort((a, b) => b.nonce - a.nonce);

      setHistory(transactionResponsesArray.slice(0, count));
      
  }, [count, transactionResponsesArray]);

  const onLoadMore = () => {
    let newCount = Math.min(count + 3, transactionResponsesArray.length)

    setCount(newCount);
  }

  const onClearTransactions = () => {
    transactionResponsesArray.forEach(transactionResponse => transactionManager.removeTransactionResponse(transactionResponse))
  }

  const loadMore =
    true ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
          display: 'flex',
          justifyContent:'space-between'
        }}
      >
        <Button onClick={onClearTransactions}>Clear All 🗑</Button>
        <Button onClick={onLoadMore}>More Transactions</Button>
      </div>
    ) : null;

  return  (
    <div>  
       {history && 
         <List
            itemLayout="vertical"
            dataSource={history}
            loadMore={(count < transactionResponsesArray.length) ? loadMore : undefined}
            renderItem={(transactionResponse) => (
              <List.Item>
                <List.Item.Meta
                  description=
                    {<TransactionResponseDisplay transactionResponse={transactionResponse} transactionManager={transactionManager} blockExplorer={blockExplorer}/>}
                />
              </List.Item>
            )}
          />
        }


    </div>
  );
}
