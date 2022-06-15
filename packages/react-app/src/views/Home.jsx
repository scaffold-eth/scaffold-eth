import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Spin, Modal } from "antd";
import { Address } from "../components";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";

function Home({ DEBUG, readContracts, writeContracts, mainnetProvider, blockExplorer, tx, address }) {
  const [nfts, setNfts] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingFancyLoogies, setLoadingFancyLoogies] = useState(true);
  const [yourFancyLoogies, setYourFancyLoogies] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEarringId, setSelectedEarringId] = useState();
  const [updateEarrings, setUpdateEarrings] = useState(0);
  const [updateSupply, setUpdateSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [left, setLeft] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 1;

  const showModal = earringId => {
    console.log("Earring contract: ", writeContracts.Earring);
    setSelectedEarringId(earringId);
    updateYourLoogies(earringId);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const updateYourLoogies = async earringId => {
    setLoadingFancyLoogies(true);
    if (DEBUG) console.log("Updating balances...");
    const fancyLoogieNewBalance = await readContracts.FancyLoogie.balanceOf(address);
    if (DEBUG) console.log("NFT: FancyLoogie - Balance: ", fancyLoogieNewBalance);
    const earringSvgFromContract = await readContracts.Earring.renderTokenById(earringId);
    const earringSvg = "<g transform='translate(225,200) scale(0.1 0.1)'>" + earringSvgFromContract + "</g>";
    const fancyLoogieUpdate = [];
    for (let tokenIndex = 0; tokenIndex < fancyLoogieNewBalance.toNumber(); tokenIndex++) {
      try {
        const tokenId = await readContracts.FancyLoogie.tokenOfOwnerByIndex(address, tokenIndex);
        if (DEBUG) console.log("Getting FancyLoogie tokenId: ", tokenId);
        const loogieSvg = await readContracts.FancyLoogie.renderTokenById(tokenId);
        const svg =
          '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">' + loogieSvg + earringSvg + "</svg>";
        fancyLoogieUpdate.push({ id: tokenId, svg: svg });
      } catch (e) {
        console.log(e);
      }
    }
    setYourFancyLoogies(fancyLoogieUpdate.reverse());
    setLoadingFancyLoogies(false);
  };

  useEffect(() => {
    const updateSupply = async () => {
      if (readContracts.Earring) {
        const supply = await readContracts.Earring.totalSupply();
        setTotalSupply(supply);
        setLeft(10 - supply);
      }
    };
    updateSupply();
  }, [DEBUG, readContracts.Earring, updateSupply]);

  useEffect(() => {
    const updateNfts = async () => {
      if (readContracts.Earring && totalSupply) {
        setLoading(true);
        const collectibleUpdate = [];
        for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
          try {
            if (DEBUG) console.log("Getting Earring tokenId: ", tokenId);
            const tokenURI = await readContracts.Earring.tokenURI(tokenId);
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
        setNfts(collectibleUpdate);
        setLoading(false);
      }
    };
    updateNfts();
  }, [DEBUG, readContracts.Earring, updateEarrings, (totalSupply || "0").toString()]);

  return (
    <>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 0, paddingBottom: 20 }}>
        <div style={{ fontSize: 24 }}>
          <p>
            A <strong style={{ color: "DeepPink" }}>super rare</strong> <strong style={{ color: "green" }}>Earring NFT</strong> for your <strong style={{ color: "red" }}>FancyLoogie</strong> minted with <strong style={{ color: "brown" }}>LoogieCoins</strong><strong style={{ color: "DarkViolet" }}>!!!</strong>
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 515, margin: "0 auto", paddingBottom: 32 }}>
        <Button
          style={{ fontSize: 30, height: 60 }}
          type="primary"
          onClick={async () => {
            try {
              const result = tx(writeContracts.Earring.mintItem(), function (transaction) {
                if (transaction.status) {
                  setUpdateSupply(updateSupply + 1);
                } else {
                  alert(transaction.data.message);
                }
              });
              if (DEBUG) console.log("awaiting metamask/web3 confirm result...", result);
              const result2 = await result;
              if (DEBUG) console.log("result2: ", result2);
            } catch (e) {
              console.log("mint failed", e);
            }
          }}
        >
          MINT for 200,000 LoogieCoins
        </Button>
        <p style={{ fontWeight: "bold" }}>Only {left} left!</p>
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
                xl: 5,
                xxl: 5,
              }}
              loading={loading}
              dataSource={nfts}
              renderItem={item => {
                const id = item.id;

                return (
                  <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                    <Card
                      style={{ backgroundColor: "#b3e2f4", border: "1px solid #0071bb", borderRadius: 10 }}
                      headStyle={{ fontWeight: "bold", borderBottomColor: "#0071bb" }}
                      title={
                        <div>
                          <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                          {item.owner.toLowerCase() === address.toLowerCase() && (
                            <Button
                              type="primary"
                              onClick={async () => {
                                showModal(item.id);
                              }}
                            >
                              Wear
                            </Button>
                          )}
                        </div>
                      }
                    >
                      <img src={item.image} alt={item.name} width="200" height="200" />
                      <div style={{ marginTop: 10 }}>{item.description}</div>
                      <div>
                        {item.owner.toLowerCase() === readContracts.FancyLoogie.address.toLowerCase() ? (
                          <span style={{ color: "darkgreen" }}>A FancyLoogie is wearing it!</span>
                        ) : (
                          <Address
                            address={item.owner}
                            ensProvider={mainnetProvider}
                            blockExplorer={blockExplorer}
                            fontSize={16}
                          />
                        )}
                      </div>
                    </Card>
                  </List.Item>
                );
              }}
            />
          </div>
        )}
      </div>

      <Modal title="" visible={isModalVisible} onOk={handleOk} onCancel={handleOk} footer={false} width={500}>
        <div>
          <List
            grid={{
              gutter: 1,
              xs: 1,
              sm: 1,
              md: 1,
              lg: 1,
              xl: 1,
              xxl: 1,
            }}
            pagination={{
              total: yourFancyLoogies ? yourFancyLoogies.length : 0,
              defaultPageSize: perPage,
              defaultCurrent: page,
              onChange: currentPage => {
                setPage(currentPage);
              },
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${yourFancyLoogies ? yourFancyLoogies.length : 0} items`,
            }}
            loading={loadingFancyLoogies}
            dataSource={yourFancyLoogies}
            renderItem={item => {
              const id = item.id.toNumber();

              return (
                <List.Item key={"fancyLoogie_" + id}>
                  <Card
                    style={{
                      backgroundColor: "#b3e2f4",
                      border: "1px solid #0071bb",
                      borderRadius: 10,
                      marginRight: 10,
                    }}
                    headStyle={{ paddingRight: 12, paddingLeft: 12, textAlign: "center" }}
                    title={
                      <div>
                        <span style={{ fontSize: 16, marginRight: 8 }}>FancyLoogie #{id}</span>
                        <Button
                          type="primary"
                          onClick={async () => {
                            try {
                              const fancyLoogieIdInBytes = "0x" + id.toString(16).padStart(64, "0");

                              const txCur = await tx(
                                writeContracts.Earring["safeTransferFrom(address,address,uint256,bytes)"](
                                  address,
                                  readContracts.FancyLoogie.address,
                                  selectedEarringId,
                                  fancyLoogieIdInBytes,
                                ),
                              );

                              await txCur.wait();
                              setUpdateEarrings(updateEarrings + 1);
                              setIsModalVisible(false);
                            } catch (e) {
                              console.log("Failed", e);
                            }
                          }}
                        >
                          Wear Earring
                        </Button>
                      </div>
                    }
                  >
                    <div dangerouslySetInnerHTML={{ __html: item.svg }}></div>
                  </Card>
                </List.Item>
              );
            }}
          />
        </div>
      </Modal>

      <div style={{ minHeight: 100, fontSize: 30, paddingBottom: 50 }}>
        <Card
          headStyle={{ fontWeight: "bold", borderBottomColor: "#0071bb", fontSize: 18, marginRight: 8 }}
          style={{
            backgroundColor: "#b3e2f4",
            border: "1px solid #0071bb",
            borderRadius: 10,
            width: "100%",
            margin: "0 auto",
            textAlign: "center",
            fontSize: 16,
          }}
          title="Do you need some FancyLoogies?"
        >
          <div>
            <p>
              You can mint <strong>OptmisticLoogies</strong> and <strong>FancyLoogies</strong> at
            </p>
            <p>
              <a style={{ fontSize: 22 }} href="https://www.fancyloogies.com" target="_blank" rel="noreferrer">
                www.fancyloogies.com
              </a>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}

export default Home;
