import React, { useState, useEffect } from "react";
import { Address, AddressInput, Contract } from "../components";
import { List, Card, Button } from "antd";
// import { useContractReader } from "eth-hooks";
// import { useEventListener } from "eth-hooks/events";
import { Web3Consumer } from "../helpers/Web3Context";
import { getFromIPFS } from "../helpers/ipfs";

function Home({ web3 }) {
  const { address, readContracts, writeContracts, tx, localProvider, mainnetProvider, blockExplorer } = web3;
  const [yourCollectibles, setYourCollectibles] = useState();
  const [balance, setBalance] = useState();
  const [transferToAddresses, setTransferToAddresses] = useState({});

  // keep track of a variable from the contract in the local React state:
  // const balance = useContractReader(readContracts, "YourCollectible", "balanceOf", [address]);

  // 📟 Listen for broadcast events
  // const transferEvents = useEventListener(readContracts, "YourCollectible", "Transfer", localProvider, 1);

  //
  // 🧠 This effect will update yourCollectibles by polling when your balance changes
  //
  // const yourBalance = balance && balance.toNumber && balance.toNumber();

  // console.log({ address, balance, yourBalance });

  const refreshBalance = async () => {
    if (readContracts?.YourCollectible) {
      const balance = await readContracts.YourCollectible.balanceOf(address);

      setBalance(balance);
    }
  };

  const handleTransfer = async id => {
    console.log("writeContracts", writeContracts);
    await tx(writeContracts.YourCollectible.transferFrom(address, transferToAddresses[id], id));
    await refreshBalance();
  };

  const updateYourCollectibles = async () => {
    const collectibleUpdate = [];
    console.log(`Checking again!`);
    for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
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

  useEffect(() => {
    refreshBalance();
  }, [address]);

  useEffect(() => {
    updateYourCollectibles();
  }, [balance]);

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
                  <Button style={{ marginTop: 10 }} onClick={() => handleTransfer(id)}>
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
