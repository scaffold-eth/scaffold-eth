import { ETHERSCAN_KEY } from "../constants";
import React, { useEffect, useState } from "react";
import { Avatar, Button, List } from 'antd';
import moment from 'moment';

import { QRPunkBlockie, TransactionResponseDisplay } from "./";

const { BigNumber, ethers } = require("ethers");

export default function TransactionHistory({ transactionResponsesArray, transactionManager }) {
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
            renderItem={(transactionResponse) => (
              <List.Item>
                <List.Item.Meta
                  title={<a href={transactionResponse.chainId == 1 ? "https://etherscan.io/tx/" + transactionResponse.hash : "https://polygonscan.com/tx/" + transactionResponse.hash}>{transactionResponse.nonce}</a>}
                  description={
                    <>
                      <div style={{ position:"relative",left:-220, top:-90 }}>
                        <QRPunkBlockie scale={0.4} address={transactionResponse.to} />
                      </div>
                      {(transactionResponse.value) && <p><b>Value:</b> {ethers.utils.formatEther(BigNumber.from(transactionResponse.value).toString())} Ξ</p>}
                      {transactionResponse.date && <p> {moment(transactionResponse.date).fromNow()}</p>}
                      {(transactionResponse.confirmations == 0) && <TransactionResponseDisplay transactionResponse={transactionResponse} transactionManager={transactionManager}/>}
                    </>
                  }
                />
              </List.Item>
            )}
          />
        }


    </div>
  );
}
