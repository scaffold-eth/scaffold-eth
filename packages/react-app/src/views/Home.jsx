import React, { useEffect, useState } from "react";
import { Button, Card, List, Image } from "antd";
import { Address } from "../components";
import { ethers } from "ethers";
import { useHistory } from "react-router-dom";
import { useContractReader } from "eth-hooks";

function Home({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  mainnetProvider,
  blockExplorer,
  address,
  localProvider,
}) {
  const history = useHistory();

  const [allNfts, setAllNfts] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingNfts, setLoadingNfts] = useState(true);
  const perPage = 9;

  const totalSupply = useContractReader(readContracts, "MandalaMerge", "totalSupply");

  useEffect(() => {
    const updateAllNfts = async () => {
      if (readContracts.MandalaMerge && totalSupply) {
        setLoadingNfts(true);
        const collectibleUpdate = [];
        let startIndex = totalSupply - 1 - perPage * (page - 1);
        for (let tokenIndex = startIndex; tokenIndex > startIndex - perPage && tokenIndex >= 0; tokenIndex--) {
          try {
            if (DEBUG) console.log("Getting token index", tokenIndex);
            const tokenId = await readContracts.MandalaMerge.tokenByIndex(tokenIndex);
            if (DEBUG) console.log("Getting MandalaMerge tokenId: ", tokenId);
            const claimed = await readContracts.MandalaMerge.claimed(tokenId);
            if (DEBUG) console.log("claimed: ", claimed);
            if (claimed) {
              const tokenURI = await readContracts.MandalaMerge.tokenURI(tokenId);
              if (DEBUG) console.log("tokenURI: ", tokenURI);
              const jsonManifestString = atob(tokenURI.substring(29));

              try {
                const jsonManifest = JSON.parse(jsonManifestString);
                collectibleUpdate.push({ id: tokenId, uri: tokenURI, ...jsonManifest });
              } catch (e) {
                console.log(e);
              }
            }
          } catch (e) {
            console.log(e);
          }
        }
        setAllNfts(collectibleUpdate);
        setLoadingNfts(false);
      }
    };
    updateAllNfts();
  }, [readContracts.MandalaMerge, (totalSupply || "0").toString(), page]);

  return (
    <div id="home">
      <div className="description">
        <h2>First fully on-chain random NFT</h2>
        <p>
          This is the <strong>first NFT</strong> generated using a future <a href="https://eips.ethereum.org/EIPS/eip-4399" target="_blank">RANDAO</a> as randomness source (available post merge on Ethereum Proof of Stake)
        </p>
        <p>
          You get a new random Mandala Merge from this <strong>unpredictable random</strong> generator.
        </p>
        <p>
          The commemorative Mandala Merge NFT is an animated SVG fully saved <strong>forever on-chain</strong>.
        </p>
        <Button
          className="go-to-mint-page"
          onClick={async () => {
            history.push("/yourNfts");
          }}
        >
          Go to Mint Page
        </Button>
      </div>
      <img src="/mandala.svg" alt="Mandala Merge" title="Mandala Merge" style={{ width: "70%" }} />
      <div style={{ width: "95%", margin: "auto", paddingBottom: 25, minHeight: 800 }}>
        {false ? (
          <Spin style={{ marginTop: 100 }} />
        ) : (
          <div>
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 3,
              }}
              pagination={{
                total: totalSupply,
                defaultPageSize: perPage,
                defaultCurrent: page,
                onChange: currentPage => {
                  setPage(currentPage);
                },
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${totalSupply} items`,
              }}
              loading={loadingNfts}
              dataSource={allNfts}
              renderItem={item => {
                const id = item.id.toNumber();

                return (
                  <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                    <Card
                      title={
                        <div>
                          <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                        </div>
                      }
                    >
                      <Image src={item.image} alt={item.name} style={{ width: 550 }} />
                      <div>
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
        )}
      </div>
    </div>
  );
}

export default Home;
