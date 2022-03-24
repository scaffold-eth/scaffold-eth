import React, { useEffect, useState } from "react";
import { Alert, Button, Card, List, Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { ethers } from "ethers";

function AddCrew({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  mainnetProvider,
  blockExplorer,
  address,
  selectedShip,
  shipCrew,
  setShipCrew,
}) {
  const [loogieBalance, setLoogieBalance] = useState(0);
  const [yourLoogieBalance, setYourLoogieBalance] = useState(0);
  const [yourLoogies, setYourLoogies] = useState();
  const [loadingLoogies, setLoadingLoogies] = useState(true);
  const [selectedShipPreview, setSelectedShipPreview] = useState("");
  const [updateBalances, setUpdateBalances] = useState(0);
  const [selectedCrew, setSelectedCrew] = useState();
  const [page, setPage] = useState(1);
  const perPage = 4;
  const crew = [
    {
      number: 0,
      name: "Captain",
      nft: "Bow",
    },
    {
      number: 1,
      name: "Chief Engineer",
      nft: "Mustache",
    },
    {
      number: 2,
      name: "Deck Officer",
      nft: "Contact Lenses",
    },
    {
      number: 3,
      name: "Seaman",
      nft: "Eyelashes",
    },
  ];

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating balances...");
      if (readContracts.FancyLoogie) {
        const loogieNewBalance = await readContracts.FancyLoogie.balanceOf(address);
        if (DEBUG) console.log("NFT: FancyLoogie - Balance: ", loogieNewBalance);
        const yourLoogieNewBalance = loogieNewBalance && loogieNewBalance.toNumber && loogieNewBalance.toNumber();
        setLoogieBalance(loogieNewBalance);
        setYourLoogieBalance(yourLoogieNewBalance);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updateBalances();
  }, [DEBUG, address, readContracts.FancyLoogie, updateBalances]);

  useEffect(() => {
    const updateYourCollectibles = async () => {
      setLoadingLoogies(true);
      const loogieUpdate = [];
      for (let tokenIndex = 0; tokenIndex < yourLoogieBalance; tokenIndex++) {
        try {
          const tokenId = await readContracts.FancyLoogie.tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting FancyLoogie tokenId: ", tokenId);
          const tokenURI = await readContracts.FancyLoogie.tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));

          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            const bow = await readContracts.FancyLoogie.hasNft(readContracts.Bow.address, tokenId);
            const mustache = await readContracts.FancyLoogie.hasNft(readContracts.Mustache.address, tokenId);
            const contactLenses = await readContracts.FancyLoogie.hasNft(readContracts.ContactLenses.address, tokenId);
            const eyelashes = await readContracts.FancyLoogie.hasNft(readContracts.Eyelashes.address, tokenId);
            loogieUpdate.push({
              id: tokenId,
              uri: tokenURI,
              bow: bow,
              mustache: mustache,
              contactLenses: contactLenses,
              eyelashes: eyelashes,
              owner: address,
              ...jsonManifest,
            });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourLoogies(loogieUpdate.reverse());
      setLoadingLoogies(false);
    };
    updateYourCollectibles();
  }, [DEBUG, address, readContracts.FancyLoogie, yourLoogieBalance]);

  useEffect(() => {
    const updatePreview = async () => {
      if (DEBUG) console.log("Updating preview...");
      if (selectedShip) {
        const tokenURI = await readContracts.LoogieShip.tokenURI(selectedShip);
        if (DEBUG) console.log("tokenURI: ", tokenURI);
        const jsonManifestString = atob(tokenURI.substring(29));
        try {
          const jsonManifest = JSON.parse(jsonManifestString);
          const svg = jsonManifest.image;
          setSelectedShipPreview(svg);

          let crew = {};

          const captainId = await readContracts.LoogieShip.crewById(0, selectedShip);
          if (captainId > 0) {
            const captainTokenURI = await readContracts.FancyLoogie.tokenURI(captainId);
            const captainJsonManifestString = atob(captainTokenURI.substring(29));
            const captainJsonManifest = JSON.parse(captainJsonManifestString);
            crew[0] = captainJsonManifest.image;
          }

          const engineerId = await readContracts.LoogieShip.crewById(1, selectedShip);
          if (engineerId > 0) {
            const engineerTokenURI = await readContracts.FancyLoogie.tokenURI(engineerId);
            const engineerJsonManifestString = atob(engineerTokenURI.substring(29));
            const engineerJsonManifest = JSON.parse(engineerJsonManifestString);
            crew[1] = engineerJsonManifest.image;
          }

          const officerId = await readContracts.LoogieShip.crewById(2, selectedShip);
          if (officerId > 0) {
            const officerTokenURI = await readContracts.FancyLoogie.tokenURI(officerId);
            const officerJsonManifestString = atob(officerTokenURI.substring(29));
            const officerJsonManifest = JSON.parse(officerJsonManifestString);
            crew[2] = officerJsonManifest.image;
          }

          const seamanId = await readContracts.LoogieShip.crewById(3, selectedShip);
          if (seamanId > 0) {
            const seamanTokenURI = await readContracts.FancyLoogie.tokenURI(seamanId);
            const seamanJsonManifestString = atob(seamanTokenURI.substring(29));
            const seamanJsonManifest = JSON.parse(seamanJsonManifestString);
            crew[3] = seamanJsonManifest.image;
          }
          setSelectedCrew(crew);
        } catch (e) {
          console.log(e);
          setSelectedShipPreview("");
        }
      } else {
        setSelectedShipPreview("");
      }
    };
    updatePreview();
  }, [DEBUG, address, readContracts.LoogieShip, selectedShip, updateBalances]);

  return (
    <>
      <div style={{ maxWidth: 1020, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <div style={{ fontSize: 16 }}>
          <p>
            Selected LoogieShip <strong>#{selectedShip}</strong>
          </p>
        </div>

        {selectedShipPreview ? (
          <div
            className={`ship-preview ${
              selectedCrew && selectedCrew[0] && selectedCrew[1] && selectedCrew[2] && selectedCrew[3]
                ? "ready-to-fishing"
                : ""
            }`}
          >
            <Card style={{ width: 900 }} bordered={false}>
              <img style={{ height: 450 }} src={selectedShipPreview} alt={selectedShip} />

              <Alert
                message={
                  <List
                    size="large"
                    header={
                      <>
                        {selectedCrew && selectedCrew[0] && selectedCrew[1] && selectedCrew[2] && selectedCrew[3] ? (
                          <div style={{ fontWeight: "bold", textAlign: "center", fontSize: 16, color: "green" }}>
                            Ready to go fishing!
                          </div>
                        ) : (
                          <div style={{ fontWeight: "bold", textAlign: "center", fontSize: 16 }}>
                            Add Crew to <strong>LoogieShip</strong>
                          </div>
                        )}
                      </>
                    }
                  >
                    {crew.map(function (member) {
                      return (
                        <List.Item key={member.number}>
                          {selectedCrew && selectedCrew[member.number] ? (
                            <div className="crew-member">
                              <div>
                                {selectedCrew && selectedCrew[member.number] && (
                                  <img
                                    src={selectedCrew[member.number]}
                                    alt={"FancyLoogie #"+shipCrew[selectedShip][member.name]}
                                    title={"FancyLoogie #"+shipCrew[selectedShip][member.name]}
                                    style={{ width: 100 }}
                                  />
                                )}
                                <span>{member.name}</span>
                              </div>
                              <Button
                                className="action-inline-button"
                                onClick={() => {
                                  tx(writeContracts.LoogieShip.removeCrew(member.number, selectedShip), function (transaction) {
                                    setShipCrew(prevState => ({
                                      ...prevState,
                                      [selectedShip]: {
                                        ...prevState[selectedShip],
                                        [member.name]: 0
                                      }
                                    }));
                                    setUpdateBalances(updateBalances + 1);
                                  });
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <p>No <strong>{member.name}</strong></p>
                              <p>(must wear <strong>{member.nft}</strong>)</p>
                            </div>
                          )}
                        </List.Item>
                      )
                    })}
                  </List>
              } type="info" />

            </Card>
          </div>
        ) : (
          <div className="ship-preview">
            <Card
              style={{ width: 515 }}
              title={
                <div style={{ height: 45 }}>
                  <span style={{ fontSize: 18, marginRight: 8 }}>No LoogieShip selected</span>
                </div>
              }
            />
          </div>
        )}
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
              total: yourLoogies ? yourLoogies.length : 0,
              defaultPageSize: perPage,
              defaultCurrent: page,
              onChange: currentPage => {
                setPage(currentPage);
              },
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${yourLoogies ? yourLoogies.length : 0} items`,
            }}
            loading={loadingLoogies}
            dataSource={yourLoogies}
            renderItem={item => {
              const id = item.id.toNumber();

              const promoteCaptain =
                item.bow && shipCrew && shipCrew[selectedShip] && shipCrew[selectedShip]["Captain"] == 0;
              const promoteEngineer =
                item.mustache && shipCrew && shipCrew[selectedShip] && shipCrew[selectedShip]["Chief Engineer"] == 0;
              const promoteOfficer =
                item.contactLenses &&
                shipCrew &&
                shipCrew[selectedShip] &&
                shipCrew[selectedShip]["Deck Officer"] == 0;
              const promoteSeaman =
                item.eyelashes && shipCrew && shipCrew[selectedShip] && shipCrew[selectedShip]["Seaman"] == 0;

              const promoteAny = promoteCaptain || promoteEngineer || promoteOfficer || promoteSeaman;

              return (
                <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                  <Card
                    title={
                      <div>
                        <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                        {promoteAny && (
                          <Dropdown
                            overlay={
                              <Menu>
                                {promoteCaptain && (
                                  <Menu.Item key="promote-captain">
                                    <Button
                                      type="primary"
                                      className="action-inline-button promote-button"
                                      onClick={() => {
                                        const abiCoder = new ethers.utils.AbiCoder();
                                        const encoded = abiCoder.encode(["uint256", "uint8"], [selectedShip, 0]);
                                        tx(
                                          writeContracts.FancyLoogie["safeTransferFrom(address,address,uint256,bytes)"](
                                            address,
                                            readContracts.LoogieShip.address,
                                            id,
                                            encoded,
                                          ),
                                          function (transaction) {
                                            setShipCrew(prevState => ({
                                              ...prevState,
                                              [selectedShip]: {
                                                ...prevState[selectedShip],
                                                ["Captain"]: id
                                              },
                                            }));
                                            setUpdateBalances(updateBalances + 1);
                                          },
                                        );
                                      }}
                                    >
                                      Captain
                                    </Button>
                                  </Menu.Item>
                                )}
                                {promoteEngineer && (
                                  <Menu.Item key="promote-engineer">
                                    <Button
                                      type="primary"
                                      className="action-inline-button promote-button"
                                      onClick={() => {
                                        const abiCoder = new ethers.utils.AbiCoder();
                                        const encoded = abiCoder.encode(["uint256", "uint8"], [selectedShip, 1]);
                                        tx(
                                          writeContracts.FancyLoogie["safeTransferFrom(address,address,uint256,bytes)"](
                                            address,
                                            readContracts.LoogieShip.address,
                                            id,
                                            encoded,
                                          ),
                                          function (transaction) {
                                            setShipCrew(prevState => ({
                                              ...prevState,
                                              [selectedShip]: {
                                                ...prevState[selectedShip],
                                                ["Chief Engineer"]: id
                                              },
                                            }));
                                            setUpdateBalances(updateBalances + 1);
                                          },
                                        );
                                      }}
                                    >
                                      Chief Engineer
                                    </Button>
                                  </Menu.Item>
                                )}
                                {promoteOfficer && (
                                  <Menu.Item key="promote-officer">
                                    <Button
                                      type="primary"
                                      className="action-inline-button promote-button"
                                      onClick={() => {
                                        const abiCoder = new ethers.utils.AbiCoder();
                                        const encoded = abiCoder.encode(["uint256", "uint8"], [selectedShip, 2]);
                                        tx(
                                          writeContracts.FancyLoogie["safeTransferFrom(address,address,uint256,bytes)"](
                                            address,
                                            readContracts.LoogieShip.address,
                                            id,
                                            encoded,
                                          ),
                                          function (transaction) {
                                            setShipCrew(prevState => ({
                                              ...prevState,
                                              [selectedShip]: {
                                                ...prevState[selectedShip],
                                                ["Deck Officer"]: id
                                              },
                                            }));
                                            setUpdateBalances(updateBalances + 1);
                                          },
                                        );
                                      }}
                                    >
                                      Deck Officer
                                    </Button>
                                  </Menu.Item>
                                )}
                                {promoteSeaman && (
                                  <Menu.Item key="promote-seaman">
                                    <Button
                                      type="primary"
                                      className="action-inline-button promote-button"
                                      onClick={() => {
                                        const abiCoder = new ethers.utils.AbiCoder();
                                        const encoded = abiCoder.encode(["uint256", "uint8"], [selectedShip, 3]);
                                        tx(
                                          writeContracts.FancyLoogie["safeTransferFrom(address,address,uint256,bytes)"](
                                            address,
                                            readContracts.LoogieShip.address,
                                            id,
                                            encoded,
                                          ),
                                          function (transaction) {
                                            setShipCrew(prevState => ({
                                              ...prevState,
                                              [selectedShip]: {
                                                ...prevState[selectedShip],
                                                ["Seaman"]: id
                                              },
                                            }));
                                            setUpdateBalances(updateBalances + 1);
                                          },
                                        );
                                      }}
                                    >
                                      Seaman
                                    </Button>
                                  </Menu.Item>
                                )}
                              </Menu>
                            }
                          >
                            <Button>
                              Promote To <DownOutlined />
                            </Button>
                          </Dropdown>
                        )}
                      </div>
                    }
                  >
                    <img alt={item.id} src={item.image} />
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

export default AddCrew;
