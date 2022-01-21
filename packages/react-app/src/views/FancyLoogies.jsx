import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin, Popover } from "antd";
import { Address } from "../components";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";

function FancyLoogies({ readContracts, mainnetProvider, blockExplorer, DEBUG }) {
  const [allLoogies, setAllLoogies] = useState();
  const [page, setPage] = useState(1);
  const [loadingLoogies, setLoadingLoogies] = useState(true);
  const perPage = 12;

  const totalSupply = useContractReader(readContracts, "Roboto", "totalSupply");

  useEffect(() => {
    const updateAllLoogies = async () => {
      if (readContracts.Roboto && totalSupply) {
        setLoadingLoogies(true);
        const collectibleUpdate = [];
        let startIndex = totalSupply - 1 - perPage * (page - 1);
        for (let tokenIndex = startIndex; tokenIndex > startIndex - perPage && tokenIndex >= 0; tokenIndex--) {
          try {
            if (DEBUG) console.log("Getting token index", tokenIndex);
            const tokenId = await readContracts.Roboto.tokenByIndex(tokenIndex);
            if (DEBUG) console.log("Getting FancyLoogie tokenId: ", tokenId);
            const tokenURI = await readContracts.Roboto.tokenURI(tokenId);
            if (DEBUG) console.log("tokenURI: ", tokenURI);
            const owner = await readContracts.Roboto.ownerOf(tokenId);
            if (DEBUG) console.log("owner: ", owner);
            const jsonManifestString = atob(tokenURI.substring(29));

            try {
              const jsonManifest = JSON.parse(jsonManifestString);
              collectibleUpdate.push({ id: tokenId, uri: tokenURI, owner: owner, ...jsonManifest });
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
                xxl: 6,
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
                          <Popover content={item.description} title="Roboto Description">
                            <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                          </Popover>
                        </div>
                      }
                    >
                      <img src={item.image} alt={"Loogie #" + id} width="200" />
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
