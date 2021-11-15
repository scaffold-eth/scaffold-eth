import React, { useState, useEffect } from "react";
import { Address, AddressInput, Contract } from "../components";
import { List, Card, Button } from "antd";
import { useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events";
import { Web3Consumer } from "../helpers/Web3Context";
import { getFromIPFS } from "../helpers/ipfs";

function Home({ web3 }) {
  const { address, readContracts, writeContracts, tx, localProvider, mainnetProvider, blockExplorer } = web3;
  const [yourCollectibles, setYourCollectibles] = useState();
  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [yourBalance, setYourBalance] = useState(0);

  // 📟 Listen for broadcast events
  const transferEvents = useEventListener(readContracts, "YourCollectible", "Transfer", localProvider, 1);
  console.log("📟 Transfer events:", transferEvents);

  // updateBalance if it has changed
  const updateBalance = async () => {
    const balance = await readContracts.YourCollectible.balanceOf(address);
    const _balanceNumber = balance && balance.toNumber && balance.toNumber();

    console.log("CALLING:", balance);

    if (_balanceNumber != yourBalance) {
      setYourBalance(_balanceNumber);
    }
  };

  // poll and update balance for every transferEvent change
  useEffect(() => {
    updateBalance();
  }, [transferEvents]);

  // if balance or address has changed, validate user's NFT list
  useEffect(() => {
    const updateYourCollectibles = async () => {
      const collectibleUpdate = [];
      console.log(`updateYourCollectibles: `, address, yourBalance);
      for (let tokenIndex = 0; tokenIndex < yourBalance; tokenIndex++) {
        try {
          console.log("GEtting token index", tokenIndex);
          const tokenId = await readContracts.YourCollectible.tokenOfOwnerByIndex(address, tokenIndex);
          console.log("tokenId", tokenId);
          const tokenURI = await readContracts.YourCollectible.tokenURI(tokenId);
          console.log("tokenURI", tokenURI);

          const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");
          console.log("ipfsHash", ipfsHash);

          const jsonManifestBuffer = await getFromIPFS(ipfsHash);

          try {
            const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
            console.log("jsonManifest", jsonManifest);
            collectibleUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourCollectibles(collectibleUpdate);
    };
    updateYourCollectibles();
  }, [address, yourBalance]);

  return (
    <div className="flex flex-1 flex-col h-screen w-full items-center">
      <div style={{ width: 640, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
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
                      <span style={{ fontSize: 16, marginRight: 8 }}>#{id}</span> {item.name}
                    </div>
                  }
                >
                  <div>
                    <img src={item.image} alt={item.name} style={{ maxWidth: 150 }} />
                  </div>
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
                    style={{ marginTop: 10 }}
                    onClick={() => {
                      console.log("writeContracts", writeContracts);
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
    </div>
  );
}

export default Web3Consumer(Home);
