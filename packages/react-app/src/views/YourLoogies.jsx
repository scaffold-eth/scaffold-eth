import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
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
  selectedFancyLoogie,
  setSelectedFancyLoogie,
  setSelectedNfts,
  fancyLoogiesNfts,
  setFancyLoogiesNfts,
}) {
  const [loogieBalance, setLoogieBalance] = useState(0);
  const [yourLoogieBalance, setYourLoogieBalance] = useState(0);
  const [yourLoogies, setYourLoogies] = useState();
  const [yourLoogiesApproved, setYourLoogiesApproved] = useState({});
  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [loadingOptimisticLoogies, setLoadingOptimisticLoogies] = useState(true);
  const history = useHistory();

  const priceToMint = useContractReader(readContracts, "Roboto", "price");
  if (DEBUG) console.log("🤗 priceToMint:", priceToMint);

  const totalSupply = useContractReader(readContracts, "Roboto", "totalSupply");
  if (DEBUG) console.log("🤗 totalSupply:", totalSupply);
  const loogiesLeft = 3728 - totalSupply;

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating balances...");
      if (readContracts.Roboto) {
        const loogieNewBalance = await readContracts.Roboto.balanceOf(address);
        const yourLoogieNewBalance = loogieNewBalance && loogieNewBalance.toNumber && loogieNewBalance.toNumber();
        if (DEBUG) console.log("NFT: Loogie - Balance: ", loogieNewBalance);
        setLoogieBalance(loogieNewBalance);
        setYourLoogieBalance(yourLoogieNewBalance);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updateBalances();
  }, [address, readContracts.Roboto, updateBalances]);

  useEffect(() => {
    const updateYourCollectibles = async () => {
      setLoadingOptimisticLoogies(true);
      const loogieUpdate = [];
      const loogieApproved = {};
      const fancyLoogiesNftsUpdate = {};
      for (let tokenIndex = 0; tokenIndex < yourLoogieBalance; tokenIndex++) {
        try {
          const tokenId = await readContracts.Roboto.tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting Loogie tokenId: ", tokenId);
          if (DEBUG) console.log("Getting FancyLoogie tokenId: ", tokenId.toNumber());
          const tokenURI = await readContracts.Roboto.tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));

          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            loogieUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });

            // TODO: sacar
            let approved = await readContracts.Roboto.getApproved(tokenId);
            loogieApproved[tokenId] = approved;

            fancyLoogiesNftsUpdate[tokenId] = {};
            const antennasId = await readContracts.Roboto.nftId(readContracts.Antennas.address, tokenId);
            fancyLoogiesNftsUpdate[tokenId][readContracts.Antennas.address] = antennasId.toString();
            const earsId = await readContracts.Roboto.nftId(readContracts.Ears.address, tokenId);
            fancyLoogiesNftsUpdate[tokenId][readContracts.Ears.address] = earsId.toString();
            const glassesId = await readContracts.Roboto.nftId(readContracts.Glasses.address, tokenId);
            fancyLoogiesNftsUpdate[tokenId][readContracts.Glasses.address] = glassesId.toString();
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourLoogies(loogieUpdate.reverse());
      setYourLoogiesApproved(loogieApproved);
      console.log("fancyLoogiesNftsUpdate: ", fancyLoogiesNftsUpdate);
      setFancyLoogiesNfts(fancyLoogiesNftsUpdate);
      setLoadingOptimisticLoogies(false);
    };
    updateYourCollectibles();
  }, [address, yourLoogieBalance]);

  return (
    <>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <div style={{ fontSize: 16 }}>
          <p>
            Only <strong>3728 Robotos</strong> available (2X the supply of the <a href="https://loogies.io" target="_blank">Original Ethereum Mainnet Loogies</a>) on a price curve <strong>increasing 0.2%</strong> with each new mint.
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
            const priceRightNow = await readContracts.Roboto.price();
            try {
              tx(writeContracts.Roboto.mintItem({ value: priceRightNow }), function (transaction) {
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
          loading={loadingOptimisticLoogies}
          dataSource={yourLoogies}
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
                            history.push("/yourAccesories");
                          }}
                        >
                          Select to wear
                        </Button>
                      ) : (
                        <Button className="action-inline-button" disabled>
                          Selected
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
                        tx(writeContracts.Roboto.transferFrom(address, transferToAddresses[id], id), function (transaction) {
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
