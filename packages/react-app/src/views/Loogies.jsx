import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin } from "antd";
import { Address } from "../components";
import { ethers } from "ethers";
import axios from "axios";

import "./Loogies.css";
import LoogieCard from "../components/LoogieCard";

function Loogies({ readContracts, mainnetProvider, blockExplorer, totalSupply, DEBUG, serverUrl }) {
  const [allLoogies, setAllLoogies] = useState();
  const [page, setPage] = useState(1);
  const [loadingLoogies, setLoadingLoogies] = useState(true);
  const perPage = 12;

  useEffect(() => {
    const updateAllLoogies = async () => {
      setLoadingLoogies(true);
      axios
        .get(`${serverUrl}/loogies?perPage=${perPage}&page=${page}`)
        .then(function (response) {
          if (DEBUG) console.log("All loogiesData: ", response);
          const collectibleUpdate = response.data;
          setAllLoogies(collectibleUpdate);
          setLoadingLoogies(false);
        })
        .catch(async function (error) {
          console.log("Error getting your all loogies from indexer: ", error.message);
          if (readContracts.YourCollectible) {
            const collectibleUpdate = [];
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
        });
    };
    updateAllLoogies();
  }, [serverUrl, page, DEBUG, readContracts.YourCollectible, totalSupply]);

  return (
    <div className="loogies">
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
              const id = item.id;

              return (
                <List.Item key={id + "_" + "_" + item.owner}>
                  <LoogieCard
                    image={item.image}
                    id={id}
                    name={item.name}
                    description={item.description}
                    owner={item.owner}
                    mainnetProvider={mainnetProvider}
                    blockExplorer={blockExplorer}
                  />
                </List.Item>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Loogies;
