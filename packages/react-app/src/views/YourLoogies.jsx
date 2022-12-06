import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, List } from "antd";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";

function Home({
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
    <div>
      <div style={{ width: 600, margin: "auto", paddingBottom: 25 }}>
        <List
          dataSource={yourCollectibles}
          renderItem={item => {
            const id = item.id.toNumber();

            return (
              <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                <Card
                  title={
                    <div>
                      <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                    </div>
                  }
                >
                  <img src={item.image} alt={"Loogie #" + id} />
                  <div>{item.description}</div>
                  <div style={{ marginTop: 20 }}>
                    <AddressInput
                      ensProvider={mainnetProvider}
                      placeholder="transfer to address"
                      value={transferToAddresses[id]}
                      onChange={newValue => {
                        const update = {};
                        update[id] = newValue;
                        setTransferToAddresses({ ...transferToAddresses, ...update });
                      }}
                    />
                    <Button
                      onClick={() => {
                        tx(writeContracts.YourCollectible.transferFrom(address, transferToAddresses[id], id));
                      }}
                    >
                      Transfer
                    </Button>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
}

export default Home;
