import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List } from "antd";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";

function YourLoogies({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  mainnetProvider,
  blockExplorer,
  address,
  updateBalances,
  setUpdateBalances,
}) {
  const [loogieBalance, setLoogieBalance] = useState(0);
  const [yourLoogieBalance, setYourLoogieBalance] = useState(0);
  const [yourLoogies, setYourLoogies] = useState();
  const [yourLoogiesApproved, setYourLoogiesApproved] = useState({});
  const [transferToAddresses, setTransferToAddresses] = useState({});

  const priceToMint = useContractReader(readContracts, "Loogies", "price");
  if (DEBUG) console.log("🤗 priceToMint:", priceToMint);

  const totalSupply = useContractReader(readContracts, "Loogies", "totalSupply");
  if (DEBUG) console.log("🤗 totalSupply:", totalSupply);
  const loogiesLeft = 3728 - totalSupply;

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating balances...");
      if (readContracts.Loogies) {
        const loogieNewBalance = await readContracts.Loogies.balanceOf(address);
        const yourLoogieNewBalance = loogieNewBalance && loogieNewBalance.toNumber && loogieNewBalance.toNumber();
        if (DEBUG) console.log("NFT: Loogie - Balance: ", loogieNewBalance);
        setLoogieBalance(loogieNewBalance);
        setYourLoogieBalance(yourLoogieNewBalance);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updateBalances();
  }, [address, readContracts.Loogies, updateBalances]);

  useEffect(() => {
    const updateYourCollectibles = async () => {
      const loogieUpdate = [];
      const loogieApproved = {};
      for (let tokenIndex = 0; tokenIndex < yourLoogieBalance; tokenIndex++) {
        try {
          const tokenId = await readContracts.Loogies.tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting Loogie tokenId: ", tokenId);
          const tokenURI = await readContracts.Loogies.tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));

          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            loogieUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
            let approved = await readContracts.Loogies.getApproved(tokenId);
            loogieApproved[tokenId] = approved;
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourLoogies(loogieUpdate.reverse());
      setYourLoogiesApproved(loogieApproved);
    };
    updateYourCollectibles();
  }, [address, yourLoogieBalance]);

  return (
    <>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <div style={{ fontSize: 16 }}>
          <p>
            Only <strong>3728 Optimistic Loogies</strong> available (2X the supply of the <a href="https://loogies.io" target="_blank">Original Ethereum Mainnet Loogies</a>) on a price curve <strong>increasing 0.2%</strong> with each new mint.
          </p>
          <p>All Ether from sales goes to public goods!!</p>
          <p>
            You can upgrade your <strong>Optimistic Loogie</strong>, mint some accesories and add the accesories to your <strong>FancyLoogie</strong>.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 515, margin: "0 auto", paddingBottom: 32 }}>
        <Button
          type="primary"
          onClick={async () => {
            const priceRightNow = await readContracts.Loogies.price();
            try {
              tx(writeContracts.Loogies.mintItem({ value: priceRightNow }), function (transaction) {
                setUpdateBalances(updateBalances + 1);
              });
            } catch (e) {
              console.log("mint failed", e);
            }
          }}
        >
          MINT for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}
        </Button>
        <p style={{ fontWeight: "bold" }}>
          { loogiesLeft } left
        </p>
      </div>
      <div style={{ width: 515, margin: "0 auto", paddingBottom: 256 }}>
        <List
          bordered
          dataSource={yourLoogies}
          renderItem={item => {
            const id = item.id.toNumber();

            return (
              <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                <Card
                  title={
                    <div>
                      <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                      {yourLoogiesApproved[id] != readContracts.FancyLoogie.address ? (
                        <Button
                          onClick={async () => {
                            tx(writeContracts.Loogies.approve(readContracts.FancyLoogie.address, id)).then(
                              res => {
                                setYourLoogiesApproved(yourLoogiesApproved => ({
                                  ...yourLoogiesApproved,
                                  [id]: readContracts.FancyLoogie.address,
                                }));
                              },
                            );
                          }}
                        >
                          Approve upgrade to FancyLoogie
                        </Button>
                      ) : (
                        <Button
                          onClick={async () => {
                            tx(writeContracts.FancyLoogie.mintItem(id), function (transaction) {
                              setUpdateBalances(updateBalances + 1);
                            });
                          }}
                        >
                          Upgrade to FancyLoogie
                        </Button>
                      )}
                    </div>
                  }
                >
                  <img src={item.image} />
                  <div style={{ height: 90 }}>{item.description}</div>
                  <div style={{ height: 90 }}>
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
                        tx(writeContracts.Loogies.transferFrom(address, transferToAddresses[id], id), function (transaction) {
                          setUpdateBalances(updateBalances + 1);
                        });
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
    </>
  );
}

export default YourLoogies;
