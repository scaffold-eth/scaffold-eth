import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { ethers } from "ethers";
import axios from "axios";

import { formatEther } from "@ethersproject/units";
import { usePoller } from "eth-hooks";

const MainUI = ({ loadWeb3Modal, address, tx, priceToMint, readContracts, writeContracts }) => {
  const [collection, setCollection] = useState({
    loading: true,
    items: [],
  });
  const [floor, setFloor] = useState("0.0");

  usePoller(async () => {
    if (readContracts && address) {
      const floorPrice = await readContracts.ExampleNFT.floor();
      setFloor(formatEther(floorPrice));
    }
  }, 1500);

  const getTokenURI = async (ownerAddress, index) => {
    const id = await readContracts.ExampleNFT.tokenOfOwnerByIndex(ownerAddress, index);
    const tokenURI = await readContracts.ExampleNFT.tokenURI(id);
    const metadata = await axios.get(tokenURI);
    const approved = await readContracts.ExampleNFT.getApproved(id);
    return { ...metadata.data, id, tokenURI, approved: approved === writeContracts.ExampleNFT.address };
  };

  const loadCollection = async () => {
    if (!address || !readContracts || !writeContracts) return;
    setCollection({
      loading: true,
      items: [],
    });
    const balance = (await readContracts.ExampleNFT.balanceOf(address)).toNumber();
    const tokensPromises = [];
    for (let i = 0; i < balance; i += 1) {
      tokensPromises.push(getTokenURI(address, i));
    }
    const tokens = await Promise.all(tokensPromises);
    setCollection({
      loading: false,
      items: tokens,
    });
  };

  const redeem = async id => {
    try {
      const redeemTx = await tx(writeContracts.ExampleNFT.redeem(id));
      await redeemTx.wait();
    } catch (e) {
      console.log("redeem tx error:", e);
    }
    loadCollection();
  };

  const approveForBurn = async id => {
    try {
      const approveTx = await tx(writeContracts.ExampleNFT.approve(writeContracts.ExampleNFT.address, id));
      await approveTx.wait();
    } catch (e) {
      console.log("Approve tx error:", e);
    }
    loadCollection();
  };

  useEffect(() => {
    if (readContracts.ExampleNFT) loadCollection();
  }, [address, readContracts, writeContracts]);

  return (
    <div style={{ maxWidth: 768, margin: "20px auto" }}>
      {address ? (
        <>
          <div style={{ display: "grid", margin: "0 auto" }}>
            <h3 style={{ marginBottom: 25 }}>My collection: </h3>
            {collection.items.length === 0 && <p>Your collection is empty</p>}
            {collection.items.length > 0 &&
              collection.items.map(item => (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                  <img
                    style={{ maxWidth: "150px", display: "block", margin: "0 auto", marginBottom: "20px" }}
                    src={item.image}
                    alt="ExampleNFT"
                  />
                  <div style={{ marginLeft: "20px" }}>
                      <Button style={{ width: "100%", minWidth: 100 }} onClick={() => redeem(item.id)}>
                        Redeem
                      </Button>
                  </div>
                </div>
              ))}
          </div>
          <p style={{ textAlign: "center", marginTop: 15 }}>Current floor price = {floor.substr(0, 6)} ETH</p>
          <Button
            style={{ marginTop: 15 }}
            type="primary"
            onClick={async () => {
              const priceRightNow = await readContracts.ExampleNFT.price();
              try {
                const txCur = await tx(writeContracts.ExampleNFT.mintItem(address, { value: priceRightNow }));
                await txCur.wait();
              } catch (e) {
                console.log("mint failed", e);
              }
              loadCollection();
            }}
          >
            MINT for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}
          </Button>
        </>
      ) : (
        <Button key="loginbutton" type="primary" onClick={loadWeb3Modal}>
          Connect to mint
        </Button>
      )}
    </div>
  );
};

export default MainUI;
