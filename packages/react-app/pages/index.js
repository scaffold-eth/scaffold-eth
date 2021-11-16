import React, { useState, useEffect } from "react";
import { Address, AddressInput, Contract } from "../components";
import { List, Card, Button } from "antd";
import { useEventListener } from "eth-hooks/events";
import { Web3Consumer } from "../helpers/Web3Context";
import { getFromIPFS } from "../helpers/ipfs";

function Home({ web3 }) {
  const { address, readContracts, writeContracts, tx, localProvider, mainnetProvider, blockExplorer } = web3;
  const [NextJSTickets, setNextJSTickets] = useState();
  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [yourBalance, setYourBalance] = useState(0);
  const [minting, setMinting] = useState(false);

  // 📟 Listen for broadcast events
  const transferEvents = useEventListener(readContracts, "NextJSTicket", "Transfer", localProvider, 1);
  console.log("📟 Transfer events:", transferEvents);

  // updateBalance if it has changed
  const updateBalance = async () => {
    if (readContracts?.NextJSTicket) {
      const balance = await readContracts.NextJSTicket.balanceOf(address);
      const _balanceNumber = balance && balance.toNumber && balance.toNumber();

      console.log("CALLING:", balance);

      if (_balanceNumber != yourBalance) {
        setYourBalance(_balanceNumber);
      }
    }
  };

  // poll and update balance for every transferEvent change
  useEffect(() => {
    updateBalance();
  }, [transferEvents]);

  const requestMint = async () => {
    setMinting(true);
    const result = tx(writeContracts.NextJSTicket.mintItem(), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        setMinting(false);
        console.log(" 🍾 Transaction " + update.hash + " finished!");
        console.log(
          " ⛽️ " +
            update.gasUsed +
            "/" +
            (update.gasLimit || update.gas) +
            " @ " +
            parseFloat(update.gasPrice) / 1000000000 +
            " gwei",
        );
      }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  };

  // if balance or address has changed, validate user's NFT list
  useEffect(() => {
    const updateNextJSTickets = async () => {
      const collectibleUpdate = [];
      console.log(`updateNextJSTickets: `, address, yourBalance);
      for (let tokenIndex = 0; tokenIndex < yourBalance; tokenIndex++) {
        try {
          console.log("GEtting token index", tokenIndex);
          const tokenId = await readContracts.NextJSTicket.tokenOfOwnerByIndex(address, tokenIndex);
          console.log("tokenId", tokenId);
          const tokenURI = await readContracts.NextJSTicket.tokenURI(tokenId);
          console.log("tokenURI", tokenURI);

          const ipfsHash = tokenURI.replace("https://gateway.pinata.cloud/ipfs/", "");
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
      setNextJSTickets(collectibleUpdate);
    };
    updateNextJSTickets();
  }, [address, yourBalance]);

  return (
    <div className="flex flex-1 flex-col h-screen w-full items-center">
      <div style={{ width: 700, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <div style={{ marginBottom: 50, display: "flex", justifyContent: "center" }}>
          <Button type="primary" onClick={requestMint} loading={minting} disabled={minting}>
            Request To Mint Ticket
          </Button>
        </div>
        <List
          bordered
          header="Your List of Guillermo’s NFT Tickets"
          dataSource={NextJSTickets}
          renderItem={item => {
            const id = item.id.toNumber();
            return (
              <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                <Card
                  style={{ width: 400 }}
                  title={
                    <div>
                      <span style={{ fontSize: 16, marginRight: 8 }}>#{id}</span> {item.name}
                    </div>
                  }
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <img src={item.image} alt={item.name} style={{ maxWidth: 300 }} />
                  </div>
                  <div style={{ width: "100%", textAlign: "center", marginTop: "10px" }}>{item.description}</div>
                </Card>

                <div style={{ marginLeft: "5px" }}>
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
                      tx(writeContracts.NextJSTicket.transferFrom(address, transferToAddresses[id], id));
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
