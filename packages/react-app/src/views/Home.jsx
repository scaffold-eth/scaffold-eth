import { useContractReader } from "eth-hooks";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, List, Card, Spin } from "antd";
import { Address } from "../components";

function Home({ DEBUG, readContracts, writeContracts, tx, mainnetProvider, blockExplorer }) {
  const priceToMint = useContractReader(readContracts, "LoogieShip", "price");
  if (DEBUG) console.log("🤗 priceToMint:", priceToMint);

  const totalSupply = useContractReader(readContracts, "LoogieShip", "totalSupply");
  if (DEBUG) console.log("🤗 totalSupply:", totalSupply);
  const shipsLeft = 1000 - totalSupply;

  const [allShips, setAllShips] = useState();
  const [page, setPage] = useState(1);
  const [loadingShips, setLoadingShips] = useState(true);
  const perPage = 8;

  useEffect(() => {
    const updateAllShips = async () => {
      if (readContracts.LoogieShip && totalSupply) {
        setLoadingShips(true);
        const collectibleUpdate = [];
        let startIndex = totalSupply - 1 - perPage * (page - 1);
        for (let tokenIndex = startIndex; tokenIndex > startIndex - perPage && tokenIndex >= 0; tokenIndex--) {
          try {
            if (DEBUG) console.log("Getting token index", tokenIndex);
            const tokenId = await readContracts.LoogieShip.tokenByIndex(tokenIndex);
            if (DEBUG) console.log("Getting Ship tokenId: ", tokenId);
            const tokenURI = await readContracts.LoogieShip.tokenURI(tokenId);
            if (DEBUG) console.log("tokenURI: ", tokenURI);
            const jsonManifestString = atob(tokenURI.substring(29));
            const owner = await readContracts.LoogieShip.ownerOf(tokenId);
            if (DEBUG) console.log("owner: ", owner);

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
        setAllShips(collectibleUpdate);
        setLoadingShips(false);
      }
    };
    updateAllShips();
  }, [DEBUG, readContracts.LoogieShip, (totalSupply || "0").toString(), page]);

  return (
    <div>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <div style={{ fontSize: 16 }}>
          <p>
            Only <strong>1000 Loogie Ships</strong> available.
          </p>
        </div>

        <Button
          type="primary"
          onClick={async () => {
            const priceRightNow = await readContracts.LoogieShip.price();
            try {
              const txCur = await tx(writeContracts.LoogieShip.mintItem({ value: priceRightNow, gasLimit: 30000000 }));
              await txCur.wait();
            } catch (e) {
              console.log("mint failed", e);
            }
          }}
        >
          MINT for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}
        </Button>

        <p style={{ fontWeight: "bold" }}>{shipsLeft} left</p>
      </div>

      <div style={{ width: "auto", margin: "auto", paddingBottom: 25, minHeight: 800 }}>
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
            loading={loadingShips}
            dataSource={allShips}
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
                    <img src={item.image} alt={"Loogie Ship #" + id} width="400" />
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
    </div>
  );
}

export default Home;
