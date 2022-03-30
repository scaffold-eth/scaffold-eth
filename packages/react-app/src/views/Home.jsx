import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin } from "antd";
import { Address } from "../components";

function Home({ DEBUG, readContracts, mainnetProvider, blockExplorer, totalSupply }) {
  const [allNfts, setAllNfts] = useState();
  const [page, setPage] = useState(1);
  const [loadingNfts, setLoadingNfts] = useState(true);
  const perPage = 8;

  useEffect(() => {
    const updateAllNfts = async () => {
      if (readContracts.Phoenix && totalSupply) {
        setLoadingNfts(true);
        const collectibleUpdate = [];
        let startIndex = totalSupply - perPage * (page - 1);
        for (let tokenIndex = startIndex; tokenIndex > startIndex - perPage && tokenIndex > 0; tokenIndex--) {
          try {
            if (DEBUG) console.log("Getting Loogie tokenId: ", tokenIndex);
            const tokenURI = await readContracts.Phoenix.tokenURI(tokenIndex);
            if (DEBUG) console.log("tokenURI: ", tokenURI);

            const owner = await readContracts.Phoenix.ownerOf(tokenIndex);
            if (DEBUG) console.log("owner: ", owner);

            try {
              const jsonManifest = JSON.parse(tokenURI);
              collectibleUpdate.push({ id: tokenIndex, uri: tokenURI, owner: owner, ...jsonManifest });
            } catch (e) {
              console.log(e);
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
  }, [readContracts.Phoenix, (totalSupply || "0").toString(), page]);

  return (
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
            loading={loadingNfts}
            dataSource={allNfts}
            renderItem={item => {
              return (
                <List.Item key={item.id + "_" + item.uri + "_" + item.owner}>
                  <Card
                    title={
                      <div>
                        <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                      </div>
                    }
                  >
                    <img src={item.image} alt={item.name} width="200" />
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
  );
}

export default Home;
