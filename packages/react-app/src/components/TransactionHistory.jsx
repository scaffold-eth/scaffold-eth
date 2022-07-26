import { ETHERSCAN_KEY } from "../constants";
import React, { useEffect, useState } from "react";
import { Avatar, Button, List } from 'antd';

const { ethers } = require("ethers");

export default function TransactionHistory({ address }) {
  let provider = new ethers.providers.EtherscanProvider(null, ETHERSCAN_KEY);

  const [history, setHistory] = useState();
  const [count, setCount] = useState(5);

  useEffect(() => {
    async function getHistory() {
      let history = await provider.getHistory(address);

      history.sort((a, b) => b.nonce - a.nonce);

      console.log("history", history);

      console.log("sliced history", history.slice(0, count));

      setHistory(history.slice(0, count));
      
    }

    if (address) {
      getHistory();  
    }
    
  }, [address, count]);

  const onLoadMore = () => {
    setCount(count + 5);
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
       TransactionHistory

       {history && 
         <List
            itemLayout="vertical"
            dataSource={history}
            loadMore={loadMore}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title={<a href={"https://etherscan.io/tx/" + item.hash}>{item.nonce}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </List.Item>
            )}
          />
        }


    </div>
  );
}
