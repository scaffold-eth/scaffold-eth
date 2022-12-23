import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin } from "antd";
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
  loading,
}) {
  return (
    <div className="your-loogies">
      <h2 className="your-loogies__title">Sneak peak on your Loogies with a smile:</h2>
      <p className="your-loogies__description">The more loogies the happier they are!</p>
      <div style={{ margin: "auto", paddingBottom: 25 }}>
        <List
          loading={loading}
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
            const id = item.id;

            return (
              <List.Item key={id + "_" + "_" + item.owner} style={{ maxWidth: "320px" }}>
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
