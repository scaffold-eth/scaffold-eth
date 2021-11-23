import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, List } from "antd";
import {
  Address,
  AddressInput,
} from "../components";
import { ethers } from "ethers";

function Home({ readContracts, writeContracts, priceToMint, yourCollectibles, tx, mainnetProvider, blockExplorer, transferToAddresses, setTransferToAddresses }) {
  return (
    <div>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <Button
          type="primary"
          onClick={async () => {
            const priceRightNow = await readContracts.YourCollectible.price();
            try {
              const txCur = await tx(writeContracts.YourCollectible.mintItem({ value: priceRightNow }));
              await txCur.wait();
            } catch (e) {
              console.log("mint failed", e);
            }
          }}
        >
          MINT for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}
        </Button>
      </div>

      <div style={{ width: 820, margin: "auto", paddingBottom: 256 }}>
        <List
          bordered
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
                </Card>

                <div>
                  owner:{" "}
                  <Address
                    address={item.owner}
                    ensProvider={mainnetProvider}
                    blockExplorer={blockExplorer}
                    fontSize={16}
                  />
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
              </List.Item>
            );
          }}
        />
      </div>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 256 }}>
        🛠 built with <a href="https://github.com/scaffold-eth/scaffold-eth" target="_blank">🏗 scaffold-eth</a>
        🍴 <a href="https://github.com/scaffold-eth/scaffold-eth" target="_blank">Fork this repo</a> and build a cool SVG NFT!
      </div>
    </div>
  );
}

export default Home;
