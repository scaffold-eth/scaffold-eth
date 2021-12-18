import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin, Popover, Form, Switch, Avatar, Pagination } from "antd";
import { Address } from "../components";
import Blockies from "react-blockies";
import { ethers } from "ethers";

function Leaderboard({
  readContracts,
  writeContracts,
  priceToMint,
  yourCollectibles,
  tx,
  mainnetProvider,
  blockExplorer,
  transferToAddresses,
  setTransferToAddresses,
  address,
  oldEnglishContract,
}) {
  const [list, setList] = useState();
  const [loaded, setLoaded] = useState();

  useEffect(() => {
    const fetchLeaders = async () => {
      const result = await fetch(
        `https://api.covalenthq.com/v1/10/tokens/0xB48b36eA8DFd6113bDf7339E7EF344d0b3f9878f/token_holders/?page-size=420&key=ckey_9c1c5e29a5d14eedadefde23ec5`,
      )
        .then(response => response.json())
        //take data and organize in CSV with Holders -> amounts or token number
        //Amounts will be preset buttons, placed in CSV adjacent
        .then(data => setList(data.data.items))
        .then(setLoaded(true))
        .then(console.log(list));
    };
    fetchLeaders();
  }, [address]);

  return (
    <div>
      <div style={{ width: 400, margin: "auto", paddingBottom: 25, paddingTop: 25 }}>
        <h3>😳 These guys really need to slow down 😳</h3>
      </div>
      <div style={{ width: 400, margin: "auto", paddingBottom: 25 }}>
        {loaded == undefined ? (
          <Spin style={{ marginTop: 100 }} />
        ) : (
          <List
            pagination={{ total: 100, pageSize: 6 }}
            itemLayout="horizontal"
            dataSource={list}
            renderItem={items => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={<Blockies seed={items.address.toLowerCase()} size={8} scale={4} />} />}
                  title={
                    <Address
                      address={items.address}
                      ensProvider={mainnetProvider}
                      blockExplorer={blockExplorer}
                      fontSize={16}
                    />
                  }
                  description={`$Buzz: ${Math.round(ethers.utils.formatEther(items.balance))} 🍻🍻`}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
