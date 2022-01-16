import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Card, List, Popover } from "antd";
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
  const loogiesLeft = 1000 - totalSupply;

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

            const batteryStatus = await readContracts.Roboto.batteryStatus(tokenId);
            fancyLoogiesNftsUpdate[tokenId][readContracts.RobotoBattery.address] = batteryStatus;
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
      <div style={{ maxWidth: 515, margin: "0 auto", marginTop: 10 }}>
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
      <div style={{ width: "auto", margin: "auto", paddingBottom: 25, minHeight: 800 }}>
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
          loading={loadingOptimisticLoogies}
          dataSource={yourLoogies}
          renderItem={item => {
            const id = item.id.toNumber();

            return (
              <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                <Card
                  title={
                    <div>
                      <Popover content={item.description} title="Roboto Description">
                        <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                      </Popover>
                    </div>
                  }
                  className={selectedFancyLoogie != id ? "nonselected-roboto" : "selected-roboto"}
                >
                  {selectedFancyLoogie != id ? (
                    <img
                      class="select-roboto"
                      src={item.image}
                      title="Select to wear"
                      onClick={() => {
                        setSelectedFancyLoogie(id);
                        setSelectedNfts({});
                        history.push("/yourAccesories");
                      }}
                    />
                  ) : (
                    <img
                      src={item.image}
                      title="Selected"
                      onClick={() => {
                        history.push("/yourAccesories");
                      }}
                    />
                  )}
                  <div style={{ height: 90 }}>
                    owner:{" "}
                    <Address
                      address={item.owner}
                      ensProvider={mainnetProvider}
                      blockExplorer={blockExplorer}
                      fontSize={16}
                    />
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
