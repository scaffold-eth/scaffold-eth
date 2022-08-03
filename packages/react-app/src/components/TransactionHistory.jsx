import React, { useState } from "react";
import { Button, List } from 'antd';

import InfiniteScroll from 'react-infinite-scroll-component';

import { TransactionResponseDisplay } from "./";

export default function TransactionHistory({ transactionResponsesArray, transactionManager, blockExplorer}) {
  const [loading, setLoading] = useState(false);

  const onClearAllTransactions = () => {
    transactionResponsesArray.forEach(transactionResponse => transactionManager.removeTransactionResponse(transactionResponse))
  }

  return  (
    <div>  
       Transaction History
       {(transactionResponsesArray.length > 0) &&
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
           </InfiniteScroll>
         
            {(transactionResponsesArray.length > 3) && <Button onClick={onClearAllTransactions}>Clear All 🗑</Button>}
          </div>
        }
    </div>
  );
}
