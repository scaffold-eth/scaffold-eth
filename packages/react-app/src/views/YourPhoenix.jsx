import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List } from "antd";
import { Address, AddressInput } from "../components";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";

function YourPhoenix({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  mainnetProvider,
  blockExplorer,
  address,
  totalSupply,
}) {
  const priceToMint = useContractReader(readContracts, "Phoenix", "price");
  if (DEBUG) console.log("🤗 priceToMint:", priceToMint);

  const nftsLeft = 1000 - totalSupply;

  const balance = useContractReader(readContracts, "Phoenix", "balanceOf", [address]);
  if (DEBUG) console.log("🤗 address: ", address, " balance:", balance);

  const yourBalance = balance && balance.toNumber && balance.toNumber();
  const [yourPhoenix, setYourPhoenix] = useState();

  useEffect(() => {
    const updateYourPhoenix = async () => {
      if (yourBalance > 0) {
        const tokenId = await readContracts.Phoenix.tokenOfOwnerByIndex(address, 0);
        if (DEBUG) console.log("Getting Loogie tokenId: ", tokenId);
        const tokenURI = await readContracts.Phoenix.tokenURI(tokenId);
        if (DEBUG) console.log("tokenURI: ", tokenURI);

        try {
          const jsonManifest = JSON.parse(tokenURI);
          setYourPhoenix({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
        } catch (e) {
          console.log(e);
          setYourPhoenix({});
        }
      } else {
        setYourPhoenix({});
      }
    };
    updateYourPhoenix();
  }, [address, yourBalance]);

  return (
    <div>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <Button
          type="primary"
          disabled={yourBalance > 0}
          onClick={async () => {
            try {
              const txCur = await tx(writeContracts.Phoenix.mintItem({ value: priceToMint, gasLimit: 3000000 }));
              await txCur.wait();
            } catch (e) {
              console.log("mint failed", e);
            }
          }}
        >
          MINT for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}
        </Button>

        <p style={{ fontWeight: "bold" }}>
          { nftsLeft } left
        </p>
      </div>

      {yourBalance > 0 && (
        <div style={{ width: 600, margin: "auto", paddingBottom: 25 }}>
          <Card
            title={
              <div>
                <span style={{ fontSize: 18, marginRight: 8 }}>{yourPhoenix.name}</span>
              </div>
            }
          >
            <img src={yourPhoenix.image} alt={yourPhoenix.name} />
            <div>{yourPhoenix.description}</div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default YourPhoenix;
