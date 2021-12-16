import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin } from "antd";
import { Address } from "../components";
import { ethers } from "ethers";

function Loogies({ readContracts, mainnetProvider, blockExplorer, totalSupply, DEBUG, writeContracts, tx, address }) {
  const [allLoogies, setAllLoogies] = useState({});
  const [page, setPage] = useState(1);
  const [loadingLoogies, setLoadingLoogies] = useState(true);
  const perPage = 8;

  const updateAllLoogies = async () => {
    if (readContracts.YourCollectible && totalSupply) {
      setLoadingLoogies(true);
      const collectibleUpdate = {};
      let startIndex = totalSupply - 1 - perPage * (page - 1);
      for (let tokenIndex = startIndex; tokenIndex > startIndex - perPage && tokenIndex >= 0; tokenIndex--) {
        try {
          if (DEBUG) console.log("Getting token index", tokenIndex);
          const tokenId = await readContracts.YourCollectible.tokenByIndex(tokenIndex);
          if (DEBUG) console.log("Getting Loogie tokenId: ", tokenId);
          const tokenURI = await readContracts.YourCollectible.tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));

          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            collectibleUpdate[tokenId] = { id: tokenId, uri: tokenURI, ...jsonManifest };
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

  const updateOneLoogie = async id => {
    if (readContracts.YourCollectible && totalSupply) {
      const collectibleUpdate = Object.assign({}, allLoogies);
      try {
        const tokenURI = await readContracts.YourCollectible.tokenURI(id);
        if (DEBUG) console.log("tokenURI: ", tokenURI);
        const jsonManifestString = atob(tokenURI.substring(29));

        try {
          const jsonManifest = JSON.parse(jsonManifestString);
          collectibleUpdate[id.toString()] = { id: id.toString(), uri: tokenURI, ...jsonManifest };
        } catch (e) {
          console.log(e);
        }
      } catch (e) {
        console.log(e);
      }
      setAllLoogies(collectibleUpdate);
    }
  };

  useEffect(() => {
    updateAllLoogies();
  }, [readContracts.YourCollectible, (totalSupply || "0").toString(), page]);

  return (
    <div style={{ width: "auto", margin: "auto", paddingBottom: 25, minHeight: 800 }}>
      {false ? (
        <Spin style={{ marginTop: 100 }} />
      ) : (
        <div>
          <Button onClick={updateAllLoogies}>Refresh</Button>
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
            dataSource={Object.values(allLoogies)}
            renderItem={item => {
              const id = item.id;

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
                    {address && item.owner == address.toLowerCase() && (
                      <>
                        {item.attributes[0].value < 13 ? (
                          <>
                            <Button
                              type="primary"
                              onClick={async () => {
                                try {
                                  const txCur = await tx(writeContracts.YourCollectible.sip(id));
                                  await txCur.wait();
                                  updateOneLoogie(id);
                                } catch (e) {
                                  console.log("sip failed", e);
                                }
                              }}
                            >
                              Sip
                            </Button>
                            <Button
                              type="primary"
                              onClick={async () => {
                                try {
                                  const txCur = await tx(writeContracts.YourCollectible.pour(id));
                                  await txCur.wait();
                                  updateOneLoogie(id);
                                } catch (e) {
                                  console.log("pour failed", e);
                                }
                              }}
                            >
                              Pour
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="primary"
                            onClick={async () => {
                              try {
                                const txCur = await tx(writeContracts.YourCollectible.recycle(id));
                                await txCur.wait();
                                updateOneLoogie(id);
                              } catch (e) {
                                console.log("recycle failed", e);
                              }
                            }}
                          >
                            Recycle
                          </Button>
                        )}
                        <Button
                          type="primary"
                          onClick={async () => {
                            try {
                              const txCur = await tx(writeContracts.YourCollectible.wrap(id));
                              await txCur.wait();
                              updateOneLoogie(id);
                            } catch (e) {
                              console.log("wrap failed", e);
                            }
                          }}
                        >
                          Wrap
                        </Button>
                      </>
                    )}
                  </Card>
                </List.Item>
              );
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Loogies;
