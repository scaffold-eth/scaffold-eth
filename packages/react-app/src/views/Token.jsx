import React, { useEffect, useState } from "react";
import { Card, Image, Spin } from "antd";
import { Address } from "../components";
import { ethers } from "ethers";
import { useParams } from "react-router-dom";

function Token({ DEBUG, readContracts, mainnetProvider, blockExplorer, address, localProvider }) {
  const selectedTokenId = useParams().id;

  const [nft, setNft] = useState();
  const [loadingNft, setLoadingNft] = useState(true);

  const futureBlocks = 10;

  useEffect(() => {
    const updateNft = async () => {
      if (readContracts.MandalaMerge && selectedTokenId > 0) {
        setLoadingNft(true);
        if (DEBUG) console.log("Getting MandalaMerge tokenId: ", selectedTokenId);
        const claimed = await readContracts.MandalaMerge.claimed(selectedTokenId);
        if (DEBUG) console.log("claimed: ", claimed);
        let nftObject = { id: selectedTokenId, claimed: claimed };
        let missed = false;
        if (!claimed) {
          const blockNumber = await readContracts.MandalaMerge.blockNumbers(selectedTokenId);
          if (ethers.BigNumber.from(localProvider._lastBlockNumber).gte(blockNumber.add(futureBlocks + 256))) {
            missed = true;
          }
        }
        if (claimed || missed) {
          try {
            const tokenURI = await readContracts.MandalaMerge.tokenURI(selectedTokenId);
            if (DEBUG) console.log("tokenURI: ", tokenURI);

            const jsonManifestString = atob(tokenURI.substring(29));
            const jsonManifest = JSON.parse(jsonManifestString);

            nftObject = { ...nftObject, uri: tokenURI, ...jsonManifest };

            setNft(nftObject);
          } catch (e) {
            console.log(e);
            setNft(null);
          }
        } else {
          setNft(null);
        }
        setLoadingNft(false);
      }
    };
    updateNft();
  }, [readContracts.MandalaMerge, selectedTokenId]);

  return (
    <div id="token">
      <div style={{ width: "95%", margin: "auto", paddingBottom: 25, minHeight: 800 }}>
        {loadingNft ? (
          <Spin style={{ marginTop: 100 }} />
        ) : (
          <div>
            {nft ? (
              <Card
                title={
                  <div>
                    <span style={{ fontSize: 18, marginRight: 8 }}>{nft.name}</span>
                  </div>
                }
              >
                <Image src={nft.image} alt={nft.name} style={{ width: 1200 }} />
                <div>
                  <Address
                    address={nft.owner}
                    ensProvider={mainnetProvider}
                    blockExplorer={blockExplorer}
                    fontSize={16}
                  />
                </div>
              </Card>
            ) : (
              <Card
                title={
                  <div>
                    <span style={{ fontSize: 18, marginRight: 8 }}>Not Found</span>
                  </div>
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Token;
