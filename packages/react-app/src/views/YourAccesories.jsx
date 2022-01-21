import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Popover } from "antd";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";

function YourAccesories({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  mainnetProvider,
  blockExplorer,
  address,
  updateBalances,
  setUpdateBalances,
  nft,
  fancyLoogiesNfts,
  selectedFancyLoogie,
  selectedNfts,
  setSelectedNfts,
  setFancyLoogiePreviewActiveTab,
}) {
  const [nftBalance, setNftBalance] = useState(0);
  const [yourNftBalance, setYourNftBalance] = useState(0);
  const [yourNfts, setYourNfts] = useState();
  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [updateNftBalance, setUpdateNftBalance] = useState(0);
  const [loadingNfts, setLoadingNfts] = useState(true);
  const [priceToMint, setPriceToMint] = useState(0);
  const [nftLeft, setNftLeft] = useState(0);

  const nftsText = {
    Bow: '<p>Only <strong>1000 Bows</strong> available on a price curve <strong>increasing 0.2%</strong> with each new mint.</p><p>Each Bow has a <strong>random color</strong> and, if you are lucky, the bow will <strong>rotate</strong>!</p>',
    Eyelash: '<p>Only <strong>1000 Eyelashes</strong> available on a price curve <strong>increasing 0.2%</strong> with each new mint.</p><p>The Eyelash has a <strong>random color</strong>, a <strong>random length</strong> and, if you are lucky, you can get <strong>another random color for the middle eyelashes</strong>!</p>',
    Mustache: '<p>Only <strong>1000 Mustaches</strong> available on a price curve <strong>increasing 0.2%</strong> with each new mint.</p><p>Each Mustache has a <strong>random color</strong>.</p>',
    ContactLenses: '<p>Only <strong>1000 Contact Lenses</strong> available on a price curve <strong>increasing 0.2%</strong> with each new mint.</p><p>The Contact Lenses have a <strong>random color</strong> and, if you are lucky, you can get a <strong>crazy one</strong>!</p>',
  };

  useEffect(() => {
    const updatePrice = async () => {
      if (DEBUG) console.log("Updating price...");
      if (readContracts.Roboto) {
        const newPriceToMint = await readContracts[nft].price();
        if (DEBUG) console.log("newPriceToMint: ", newPriceToMint);
        setPriceToMint(newPriceToMint);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updatePrice();
  }, [address, readContracts[nft]]);

  useEffect(() => {
    const updateSupply = async () => {
      if (DEBUG) console.log("Updating supply...");
      if (readContracts.Roboto) {
        const newTotalSupply = await readContracts[nft].totalSupply();
        if (DEBUG) console.log("newTotalSupply: ", newTotalSupply);
        setNftLeft(1000 - newTotalSupply);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updateSupply();
  }, [address, readContracts[nft], updateNftBalance]);

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating balances...");
      if (readContracts[nft]) {
        const nftNewBalance = await readContracts[nft].balanceOf(address);
        const yourNftNewBalance = nftNewBalance && nftNewBalance.toNumber && nftNewBalance.toNumber();
        if (DEBUG) console.log("NFT: ", nft, " - Balance: ", nftNewBalance, " - Your: ", yourNftNewBalance);
        setNftBalance(nftNewBalance);
        setYourNftBalance(yourNftNewBalance);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updateBalances();
  }, [address, readContracts[nft], updateNftBalance]);

  useEffect(() => {
    const updateYourCollectibles = async () => {
      const nftUpdate = [];

      setLoadingNfts(true);

      for (let tokenIndex = 0; tokenIndex < yourNftBalance; tokenIndex++) {
        try {
          const tokenId = await readContracts[nft].tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting ", nft, " tokenId: ", tokenId);
          const tokenURI = await readContracts[nft].tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));

          try {
            if (DEBUG) console.log("JSON: ", jsonManifestString);
            const jsonManifest = JSON.parse(jsonManifestString);
            nftUpdate.unshift({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }

      setYourNfts(nftUpdate);

      setLoadingNfts(false);
    };
    updateYourCollectibles();
  }, [address, yourNftBalance]);

  return (
    <>
      <div style={{ textAlign: "right", marginTop: 0, paddingBottom: 15, marginRight: 50 }}>
        <span style={{ fontWeight: "bold", marginRight: 10 }}>{ nftLeft } left</span>
        <Button
          type="primary"
          onClick={async () => {
            const priceRightNow = await readContracts[nft].price();
            try {
              tx(writeContracts[nft].mintItem({ value: priceRightNow, gasLimit: 300000 }), function (transaction) {
                setUpdateNftBalance(updateNftBalance + 1);
              });
            } catch (e) {
              console.log("mint failed", e);
            }
          }}
        >
          MINT for {priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(0)} MATIC
        </Button>
      </div>

      <div style={{ paddingBottom: 25 }}>
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
          loading={loadingNfts}
          dataSource={yourNfts}
          renderItem={item => {
            const id = item.id.toNumber();
            return (
              <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                <Card>
                  <div class="nft-image">
                    { fancyLoogiesNfts &&
                      fancyLoogiesNfts[selectedFancyLoogie] &&
                      fancyLoogiesNfts[selectedFancyLoogie][readContracts[nft].address] == 0 ? (
                      <img
                        class="preview"
                        src={item.image}
                        title={(selectedNfts[nft] == id ? "Previewing" : "Preview") + item.name.replace("Roboto", "")}
                        onClick={() => {
                          setSelectedNfts(prevState => ({
                            ...prevState,
                            [nft]: id,
                          }));
                          setFancyLoogiePreviewActiveTab("preview-"+nft);
                        }}
                      />
                      ) : (
                      <img
                        src={item.image}
                        title={item.name.replace("Roboto", "")}
                      />
                      )}
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

export default YourAccesories;
