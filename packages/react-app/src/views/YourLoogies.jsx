import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, List } from "antd";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";

import "./YourLoogies.css";
import LoogieCard from "../components/LoogieCard";

function YourLoogies({
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
}) {
  return (
    <div className="your-loogies">
      <div style={{ margin: "auto", paddingBottom: 25 }}>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 4,
            xxl: 6,
          }}
          dataSource={yourCollectibles}
          renderItem={item => {
            const id = item.id.toNumber();

            return (
              <List.Item key={id + "_" + item.uri + "_" + item.owner} style={{ maxWidth: "320px" }}>
                <LoogieCard
                  image={item.image}
                  id={id}
                  name={item.name}
                  description={item.description}
                  owner={item.owner}
                  mainnetProvider={mainnetProvider}
                  blockExplorer={blockExplorer}
                  yourLoogies
                  tx={tx}
                  transferToAddresses={transferToAddresses}
                  setTransferToAddresses={setTransferToAddresses}
                  writeContracts={writeContracts}
                  address={address}
                />
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
}

export default YourLoogies;
