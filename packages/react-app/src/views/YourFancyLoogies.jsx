import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Col, Input, List, Menu, Row, Tabs, Dropdown, Badge } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";

function YourFancyLoogies({
  DEBUG,
  readContracts,
  writeContracts,
  priceToMint,
  yourCollectibles,
  tx,
  mainnetProvider,
  blockExplorer,
  updateBalances,
  setUpdateBalances,
  address,
  fancyLoogieContracts,
  fancyLoogiesNfts,
  setFancyLoogiesNfts,
  selectedFancyLoogie,
  setSelectedFancyLoogie,
  nfts,
  setSelectedNfts,
}) {
  const [fancyLoogieBalance, setFancyLoogieBalance] = useState(0);
  const [yourFancyLoogieBalance, setYourFancyLoogieBalance] = useState(0);
  const [yourFancyLoogies, setYourFancyLoogies] = useState();
  const [transferToAddresses, setTransferToAddresses] = useState({});

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating balances...");
      if (readContracts.FancyLoogie) {
        const fancyLoogieNewBalance = await readContracts.FancyLoogie.balanceOf(address);
        if (DEBUG) console.log("NFT: FancyLoogie - Balance: ", fancyLoogieNewBalance);
        const yourFancyLoogieNewBalance = fancyLoogieNewBalance && fancyLoogieNewBalance.toNumber && fancyLoogieNewBalance.toNumber();
        setFancyLoogieBalance(fancyLoogieNewBalance);
        setYourFancyLoogieBalance(yourFancyLoogieNewBalance);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updateBalances();
  }, [address, readContracts.FancyLoogie, updateBalances]);

  useEffect(() => {
    const updateYourCollectibles = async () => {
      const fancyLoogieUpdate = [];
      const fancyLoogiesNftsUpdate = {};
      for (let tokenIndex = 0; tokenIndex < yourFancyLoogieBalance; tokenIndex++) {
        try {
          const tokenId = await readContracts.FancyLoogie.tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting FancyLoogie tokenId: ", tokenId);
          const tokenURI = await readContracts.FancyLoogie.tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));

          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            fancyLoogieUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
            fancyLoogiesNftsUpdate[tokenId] = {};
            for (let contractIndex = 0; contractIndex < fancyLoogieContracts.length; contractIndex++) {
              const contractAddress = fancyLoogieContracts[contractIndex];
              const nftId = await readContracts.FancyLoogie.nftId(contractAddress, tokenId);
              fancyLoogiesNftsUpdate[tokenId][contractAddress] = nftId.toString();
            }
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourFancyLoogies(fancyLoogieUpdate.reverse());
      setFancyLoogiesNfts(fancyLoogiesNftsUpdate);
    };
    updateYourCollectibles();
  }, [address, yourFancyLoogieBalance]);

  return (
    <>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <div style={{ fontSize: 16 }}>
          <p>
            Select the <strong>FancyLoogie</strong> you want to wear with accesories.
          </p>
          <p>
            Mint some <strong>accesories</strong> and then you can <strong>add</strong> them to your Loogie.
          </p>
        </div>
      </div>

      <div className="your-fancy-loogies" style={{ width: 515, margin: "0 auto", paddingBottom: 256 }}>
        <List
          bordered
          dataSource={yourFancyLoogies}
          renderItem={item => {
            const id = item.id.toNumber();

            return (
              <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                <Card
                  title={
                    <div>
                      <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                      {selectedFancyLoogie != id ? (
                        <Button
                          className="action-inline-button"
                          onClick={() => {
                            setSelectedFancyLoogie(id);
                            setSelectedNfts({});
                          }}
                        >
                          Select to wear
                        </Button>
                      ) : (
                        <Button className="action-inline-button" disabled>
                          Selected
                        </Button>
                      )}
                      <Dropdown overlay={
                        <Menu>
                          <Menu.Item key="downgrade">
                            <Button
                              className="fancy-loogie-action-button action-button"
                              onClick={() => {
                                tx(writeContracts.FancyLoogie.downgradeLoogie(id), function (transaction) {
                                  setUpdateBalances(updateBalances + 1);
                                });
                              }}
                            >
                              Downgrade
                            </Button>
                          </Menu.Item>
                          {nfts.map(function (nft) {
                            return fancyLoogiesNfts &&
                              fancyLoogiesNfts[id] &&
                              fancyLoogiesNfts[id][readContracts[nft].address] > 0 && (
                                <Menu.Item key={"remove-"+nft}>
                                  <Button
                                    className="fancy-loogie-action-button action-button"
                                    onClick={() => {
                                      tx(writeContracts.FancyLoogie.removeNftFromLoogie(readContracts[nft].address, id), function (transaction) {
                                        setUpdateBalances(updateBalances + 1);
                                      });
                                    }}
                                  >
                                    Remove {nft}
                                  </Button>
                                </Menu.Item>
                              );
                          })}
                        </Menu>
                      }>
                        <Button>
                          Actions <DownOutlined />
                        </Button>
                      </Dropdown>
                    </div>
                  }
                >
                  <img src={item.image} />
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
                        tx(writeContracts.FancyLoogie.transferFrom(address, transferToAddresses[id], id), function (transaction) {
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

export default YourFancyLoogies;
