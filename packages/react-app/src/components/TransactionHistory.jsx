import React, { useState } from "react";
import { Button, Divider, List } from 'antd';

import InfiniteScroll from 'react-infinite-scroll-component';

import { TransactionResponseDisplay } from "./";

export default function TransactionHistory({ transactionResponsesArray, transactionManager, blockExplorer, useInfiniteScroll = false }) {

  const transactionList = (
    <List
      itemLayout="vertical"
      dataSource={transactionResponsesArray.sort((a, b) => b.nonce - a.nonce)}
      renderItem={(transactionResponse) => (
        <List.Item>
          <List.Item.Meta
            description=
              {<TransactionResponseDisplay transactionResponse={transactionResponse} transactionManager={transactionManager} blockExplorer={blockExplorer}/>}
          />
        </List.Item>
      )}
    />
  );

  const onClearAllTransactions = () => {
    transactionResponsesArray.forEach(transactionResponse => transactionManager.removeTransactionResponse(transactionResponse))
  }

  const clearAllButton = (
    <Button style={{ marginBottom: 10 }} onClick={onClearAllTransactions}>Clear All 🗑</Button>
  );

  return (
    <div>
       {useInfiniteScroll ?
          <div
            id="scrollableDiv"
            style={{
              height: 250,
              overflow: 'auto',
              padding: '0 16px',
              border: '1px solid rgba(140, 140, 140, 0.35)',
            }}
          >
            <InfiniteScroll
              dataLength={transactionResponsesArray.length}
              hasMore={true}
              scrollableTarget="scrollableDiv"
            >
              {transactionList}
           </InfiniteScroll>
         
            {(transactionResponsesArray.length > 2) && clearAllButton}
          </div>
          :
          <>
            {transactionList}
            {(transactionResponsesArray.length > 4) && clearAllButton }
            <Divider style={{ backgroundColor:"black", margin:0 }} />
          </>
        }
    </div>
  );
}
