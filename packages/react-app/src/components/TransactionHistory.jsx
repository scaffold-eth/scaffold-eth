import { ETHERSCAN_KEY } from "../constants";
import React, { useEffect, useState } from "react";
import { Avatar, Button, List } from 'antd';

import { QRPunkBlockie } from "./";

const { ethers } = require("ethers");

export default function TransactionHistory({ transactionResponsesArray }) {
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

// ToDo: proper block explorer links according to the chainId

  return  (
    <div>  
       TransactionHistory

       {history && 
         <List
            itemLayout="vertical"
            dataSource={history}
            loadMore={loadMore}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={<a href={item.chainId == 1 ? "https://etherscan.io/tx/" + item.hash : "https://polygonscan.com/tx/" + item.hash}>{item.nonce}</a>}
                  description={
                    <div style={{ position:"relative",left:-220,top:-90 }}>
                      <QRPunkBlockie scale={0.4} address={item.to} />
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        }


    </div>
  );
}
