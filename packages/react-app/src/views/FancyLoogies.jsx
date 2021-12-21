import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin } from "antd";
import { Address } from "../components";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";

function FancyLoogies({ readContracts, mainnetProvider, blockExplorer, DEBUG }) {
  const [allLoogies, setAllLoogies] = useState();
  const [page, setPage] = useState(1);
  const [loadingLoogies, setLoadingLoogies] = useState(true);
  const perPage = 8;

  const totalSupply = useContractReader(readContracts, "FancyLoogie", "totalSupply");

  useEffect(() => {
    const updateAllLoogies = async () => {
      if (readContracts.FancyLoogie && totalSupply) {
        setLoadingLoogies(true);
        const collectibleUpdate = [];
        let startIndex = totalSupply - 1 - perPage * (page - 1);
        for (let tokenIndex = startIndex; tokenIndex > startIndex - perPage && tokenIndex >= 0; tokenIndex--) {
          try {
            if (DEBUG) console.log("Getting token index", tokenIndex);
            const tokenId = await readContracts.FancyLoogie.tokenByIndex(tokenIndex);
            if (DEBUG) console.log("Getting FancyLoogie tokenId: ", tokenId);
            const tokenURI = await readContracts.FancyLoogie.tokenURI(tokenId);
            if (DEBUG) console.log("tokenURI: ", tokenURI);
            const jsonManifestString = atob(tokenURI.substring(29));

            try {
              const jsonManifest = JSON.parse(jsonManifestString);
              collectibleUpdate.push({ id: tokenId, uri: tokenURI, ...jsonManifest });
            } catch (e) {
              console.log(e);
            }
          } catch (e) {
            console.log(e);
          }
        }
        setAllLoogies(collectibleUpdate);
        setLoadingLoogies(false);
      }
    };
    updateAllLoogies();
  }, [readContracts.YourCollectible, (totalSupply || "0").toString(), page]);

  return (
    <>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <div style={{ fontSize: 16 }}>
          <p>
            FancyLoogies are upgraded <strong>Optimistic Loogies</strong> with <strong>NFTs accesories</strong>.
          </p>
          <p>
            Upgrate <Link to="/yourLoogies">Your Optimistic Loogies</Link>!
          </p>
        </div>
      </div>

      <div style={{ width: "auto", margin: "auto", paddingBottom: 25, minHeight: 800 }}>
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
                xl: 4,
                xxl: 4,
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
              loading={loadingLoogies}
              dataSource={allLoogies}
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
                      <img src={item.image} alt={"Loogie #" + id} width="200" />
                      <div>{item.description}</div>
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
    </>
  );
}

export default FancyLoogies;
