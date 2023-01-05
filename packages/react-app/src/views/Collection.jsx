import React, { useEffect, useState } from "react";
import { Address } from "../components";
import { useContractReader } from "eth-hooks";
import { Popover, Card, List } from "antd";

function Collection({ readContracts, mainnetProvider, blockExplorer, DEBUG, localProviderPollingTime }) {
  const [allNfts, setAllNfts] = useState();
  const [page, setPage] = useState(1);
  const [loadingNfts, setLoadingNfts] = useState(true);
  const perPage = 12;

  const totalSupply = useContractReader(readContracts, "Emotilon", "totalSupply", [], localProviderPollingTime);

  useEffect(() => {
    const updateAllNfts = async () => {
      if (readContracts.Emotilon && totalSupply) {
        setLoadingNfts(true);
        const collectibleUpdate = [];
        let startIndex = totalSupply - 1 - perPage * (page - 1);
        for (let tokenIndex = startIndex; tokenIndex > startIndex - perPage && tokenIndex >= 0; tokenIndex--) {
          try {
            if (DEBUG) console.log("Getting token index", tokenIndex);
            const tokenId = await readContracts.Emotilon.tokenByIndex(tokenIndex);
            if (DEBUG) console.log("Getting NFT tokenId: ", tokenId);
            const tokenURI = await readContracts.Emotilon.tokenURI(tokenId);
            if (DEBUG) console.log("tokenURI: ", tokenURI);
            const owner = await readContracts.Emotilon.ownerOf(tokenId);
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
        setAllNfts(collectibleUpdate);
        setLoadingNfts(false);
      }
    };
    updateAllNfts();
  }, [readContracts.Emotilon, (totalSupply || "0").toString(), page]);

  return (
    <>
      <div style={{ width: "auto", paddingBottom: 25, minHeight: 800, margin: 20, paddingTop: 20 }}>
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
            loading={loadingNfts}
            dataSource={allNfts}
            renderItem={item => {
              const id = item.id.toNumber();

              return (
                <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                  <Card
                    title={
                      <div>
                        <Popover content={item.description} title="Emotilon Description">
                          <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                        </Popover>
                      </div>
                    }
                  >
                    <img src={item.image} alt={"Emotilon #" + id} width="200" />
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
      </div>
    </>
  );
}

export default Collection;
