import { ETHERSCAN_KEY } from "../constants";
import React, { useEffect, useState } from "react";
import { Avatar, Button, List } from 'antd';

import { TransactionResponseDisplay } from "./";

const { BigNumber, ethers } = require("ethers");

export default function TransactionHistory({ transactionResponsesArray, transactionManager, blockExplorer }) {
  console.log("transactionResponsesArray", transactionResponsesArray);

  const [history, setHistory] = useState();
  const [count, setCount] = useState(1);

  useEffect(() => {
      transactionResponsesArray.sort((a, b) => b.nonce - a.nonce);

      setHistory(transactionResponsesArray.slice(0, count));
      
  }, [count, transactionResponsesArray]);

  const onLoadMore = () => {
    setCount(count + 1);
  }

  const loadMore =
    true ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;

  return  (
    <div>  
       {history && 
         <List
            itemLayout="vertical"
            dataSource={history}
            loadMore={loadMore}
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
