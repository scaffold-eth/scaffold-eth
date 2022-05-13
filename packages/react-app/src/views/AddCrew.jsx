import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Button, Card, List, Menu, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { ethers } from "ethers";
import "html-midi-player";
import ConfettiGenerator from "confetti-js";

function AddCrew({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  mainnetProvider,
  blockExplorer,
  address,
  currentDay,
  loogieCoinBalance,
}) {
  const [loogieBalance, setLoogieBalance] = useState(0);
  const [yourLoogieBalance, setYourLoogieBalance] = useState(0);
  const [yourLoogies, setYourLoogies] = useState();
  const [loadingLoogies, setLoadingLoogies] = useState(true);
  const [selectedShipPreview, setSelectedShipPreview] = useState("");
  const [updateBalances, setUpdateBalances] = useState(0);
  const [selectedCrew, setSelectedCrew] = useState();
  const [sendingLoogies, setSendingLoogies] = useState(false);
  const [fishingReward, setFishingReward] = useState(0);
  const [fishingRewardSize, setFishingRewardSize] = useState("");
  const [todayPlayed, setTodayPlayed] = useState(0);
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

  const selectedShip = useParams().id;

  useEffect(() => {
    if (fishingReward > 0) {
      const confettiSettings = {
        target: "confetti-holder",
        props: [{ type: "svg", src: "/images/fish-confetti.svg" }],
        size: 2.5,
        max: fishingReward / 100,
      };
      const confettiUpdate = new ConfettiGenerator(confettiSettings);
      confettiUpdate.render();
      setTimeout(
        function (confettiUpdate) {
          confettiUpdate.clear();
        }.bind(this),
        10000,
        confettiUpdate,
      );
    }
  }, [fishingReward]);

  useEffect(() => {
    const updatePlayed = async () => {
      if (DEBUG) console.log("Updating played...");
      if (readContracts.SailorLoogiesGame && selectedShip && currentDay) {
        const playedNew = await readContracts.SailorLoogiesGame.played(selectedShip, currentDay);
        if (DEBUG) console.log("playedNew: ", playedNew);
        setTodayPlayed(playedNew);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updatePlayed();
  }, [DEBUG, selectedShip, readContracts.SailorLoogiesGame, currentDay]);

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
      if (readContracts.LoogieShip && selectedShip) {
        const shipSvg = await readContracts.LoogieShip.renderTokenById(selectedShip);

        let svg = `
          <div style="height: 580px; background-image: url(images/sunset.jpg); background-position-y: 400px">
            <svg width='878' height='580' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
        `;

        let wavesSvg = `
          <defs>
            <style>
              .cls-100{fill:url(#linear-gradient-11);}.cls-200{fill:url(#linear-gradient-12);}.cls-300{fill:url(#linear-gradient-13);}.cls-400{fill:url(#linear-gradient-14);}
            </style>
            <linearGradient id="linear-gradient-11" x1="564.7" y1="68.65" x2="564.7" y2="256.75" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#1c67a0"/>
              <stop offset="1" stop-color="#00468d"/>
            </linearGradient>
            <linearGradient id="linear-gradient-12" x1="563.95" y1="147.12" x2="563.95" y2="279.88" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#1c77a0"/>
              <stop offset="1" stop-color="#005b8d"/>
            </linearGradient>
            <linearGradient id="linear-gradient-13" x1="564.7" y1="232.12" x2="564.7" y2="420.21" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#2b8abf"/>
              <stop offset="1" stop-color="#005bbb"/>
            </linearGradient>
            <linearGradient id="linear-gradient-14" x1="563.95" y1="317.12" x2="563.95" y2="552.96" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#29aae1"/>
              <stop offset="1" stop-color="#0071bb"/>
            </linearGradient>
          </defs>
          <g id="waves" data-name="Layer 2" transform="scale(1 0.83) translate(-35 320)">
            <g>
              <path class="cls-100" d="M1072.34,73.62l-40.91,19.55a74.44,74.44,0,0,1-65.34,0l-14.56-7-26.35-12.6a80.65,80.65,0,0,0-8-3.31q-3-1.05-6.1-1.85c-1.36-.36-2.73-.67-4.1-.95a73,73,0,0,0-15.3-1.43,75.35,75.35,0,0,0-33.49,7.54L817.29,93.17a75.39,75.39,0,0,1-31.85,7.54h-1.26c-1.38,0-2.77-.12-4.15-.24a76.36,76.36,0,0,1-26.45-7.29l-40.9-19.55a80.65,80.65,0,0,0-8-3.31q-3-1.05-6.1-1.85c-1.36-.36-2.73-.67-4.1-.95a73.15,73.15,0,0,0-15.3-1.43c-1,0-1.93,0-2.9,0-1.38,0-2.76.11-4.14.23a76.3,76.3,0,0,0-26.45,7.29L604.79,93.17a80.65,80.65,0,0,1-8,3.31q-3,1.06-6.09,1.86c-1.37.35-2.73.67-4.1.94a73.43,73.43,0,0,1-13.67,1.43,75.58,75.58,0,0,1-31.86-7.54l-40.9-19.55c-.66-.32-1.32-.62-2-.92a75.32,75.32,0,0,0-30.7-6.63h-.82c-1,0-1.92,0-2.89,0-1.38,0-2.76.11-4.15.23a76.25,76.25,0,0,0-26.44,7.29L392.29,93.17a71.06,71.06,0,0,1-63.71,0l-40.9-19.55a75.31,75.31,0,0,0-33.74-7.54h-.57a75.45,75.45,0,0,0-32.68,7.55L179.93,93.11l-.14.06a74.46,74.46,0,0,1-65.35,0L73.54,73.62a74.7,74.7,0,0,0-41-7.08V321.48H1096.84V66.53A76.2,76.2,0,0,0,1072.34,73.62Z"/>
              <animateMotion path="M0 0 H -100 0Z" dur="15s" repeatCount="indefinite"></animateMotion>
            </g>
            <g>
              <path class="cls-200" d="M1021.62,153.71a74.5,74.5,0,0,0-65.34,0l-40.91,19.56a74.44,74.44,0,0,1-65.34,0l-14.56-7-26.35-12.6a80.56,80.56,0,0,0-8-3.3q-3-1.07-6.09-1.86c-1.37-.35-2.73-.67-4.11-.94a73.87,73.87,0,0,0-16.56-1.42c-1.38,0-2.76.12-4.15.24a76.23,76.23,0,0,0-26.44,7.28l-40.91,19.56a78.23,78.23,0,0,1-8,3.3q-3,1.06-6.1,1.86c-1.36.36-2.73.67-4.1.95a73.28,73.28,0,0,1-16.56,1.41c-1.38,0-2.77-.11-4.15-.23a76.36,76.36,0,0,1-26.45-7.29l-40.9-19.56a80.56,80.56,0,0,0-8-3.3q-3-1.07-6.1-1.86c-1.36-.35-2.73-.67-4.1-.94a73.87,73.87,0,0,0-16.56-1.42c-1.38,0-2.77.12-4.15.24a76.34,76.34,0,0,0-26.45,7.28l-40.9,19.56a74.46,74.46,0,0,1-65.35,0l-40.9-19.56-2-.91a74.38,74.38,0,0,0-63.37.91L278,173.2l-.14.07a74.46,74.46,0,0,1-65.35,0l-40.9-19.56a74.53,74.53,0,0,0-65.35,0L32.69,188.89V401.57H1095.2V188.89Z"/>
              <animateMotion path="M0 0 H -100 0Z" dur="10s" repeatCount="indefinite"></animateMotion>
            </g>
            <g>
              <path class="cls-300" d="M1072.34,237.08l-40.91,19.56a74.44,74.44,0,0,1-65.34,0l-14.56-7-26.35-12.6a78.23,78.23,0,0,0-8-3.3q-3-1.07-6.1-1.86c-1.36-.36-2.73-.67-4.1-.95a73.7,73.7,0,0,0-15.3-1.43,75.35,75.35,0,0,0-33.49,7.54l-40.91,19.56a75.54,75.54,0,0,1-31.85,7.54l-1.26,0c-1.38,0-2.77-.12-4.15-.24a76.13,76.13,0,0,1-26.45-7.28l-40.9-19.56a78.23,78.23,0,0,0-8-3.3q-3-1.07-6.1-1.86c-1.36-.36-2.73-.67-4.1-.95a73.83,73.83,0,0,0-15.3-1.43c-1,0-1.93,0-2.9,0-1.38,0-2.76.12-4.14.23a76.3,76.3,0,0,0-26.45,7.29l-40.91,19.56a78.23,78.23,0,0,1-8,3.3q-3,1.06-6.09,1.86c-1.37.35-2.73.67-4.1.94a73.44,73.44,0,0,1-13.67,1.44,75.58,75.58,0,0,1-31.86-7.54l-40.9-19.56c-.66-.31-1.32-.62-2-.91a75.17,75.17,0,0,0-30.7-6.64h-.82c-1,0-1.92,0-2.89,0-1.38,0-2.76.12-4.15.23a76.25,76.25,0,0,0-26.44,7.29l-40.91,19.56a71.06,71.06,0,0,1-63.71,0l-40.9-19.56a75.45,75.45,0,0,0-33.74-7.54h-.57a75.59,75.59,0,0,0-32.68,7.55l-40.76,19.49-.14.07a74.46,74.46,0,0,1-65.35,0l-40.9-19.56a74.88,74.88,0,0,0-41-7.08V484.94H1096.84V230A76.46,76.46,0,0,0,1072.34,237.08Z"/>
              <animateMotion path="M0 0 H -100 0Z" dur="7s" repeatCount="indefinite"></animateMotion>
            </g>
          </g>`;

        svg += wavesSvg;
        svg += "<g transform='scale(1 1) translate(200 215)'>" + shipSvg + "</g>";

        svg += `
          <g id="front-wave" transform="scale(1 0.83) translate(-40 300)">
            <path opacity="0.8" class="cls-400" d="M1021.62,320.45a74.44,74.44,0,0,0-65.34,0L915.37,340A74.44,74.44,0,0,1,850,340l-14.56-7-26.35-12.59a80.65,80.65,0,0,0-8-3.31q-3-1-6.09-1.86c-1.37-.35-2.73-.66-4.11-.94a73.87,73.87,0,0,0-16.56-1.42c-1.38,0-2.76.12-4.15.24a76.25,76.25,0,0,0-26.44,7.29L702.87,340a80.65,80.65,0,0,1-8,3.31q-3,1.05-6.1,1.86c-1.36.35-2.73.66-4.1.94a73.87,73.87,0,0,1-16.56,1.42c-1.38,0-2.77-.12-4.15-.24A76.36,76.36,0,0,1,637.52,340l-40.9-19.55a80.65,80.65,0,0,0-8-3.31q-3-1-6.1-1.86c-1.36-.35-2.73-.66-4.1-.94a73.87,73.87,0,0,0-16.56-1.42c-1.38,0-2.77.12-4.15.24a76.36,76.36,0,0,0-26.45,7.29L490.37,340A74.46,74.46,0,0,1,425,340l-40.9-19.55c-.66-.32-1.32-.62-2-.92a74.43,74.43,0,0,0-63.37.92L278,339.93l-.14.07a74.46,74.46,0,0,1-65.35,0l-40.9-19.55a74.46,74.46,0,0,0-65.35,0L32.69,355.62V568.31H1095.2V355.62Z"/>
            <animateMotion path="M0 0 H -100 0Z" dur="5s" repeatCount="indefinite"></animateMotion>
          </g>
        `;

        if (sendingLoogies) {
          svg += `<animateTransform
                    xlink:href="#loogie-ship"
                    attributeName="transform"
                    type="translate"
                    from="0"
                    to="-650"
                    begin="0.5s"
                    dur="10s"
                    repeatCount="1"
                    fill="freeze"
                    additive="sum"/>`;
        }
        svg += "</svg></div>";

        setSelectedShipPreview(svg);

        let crew = {};

        const captainId = await readContracts.LoogieShip.crewById(0, selectedShip);
        if (captainId > 0) {
          const captainTokenURI = await readContracts.FancyLoogie.tokenURI(captainId);
          const captainJsonManifestString = atob(captainTokenURI.substring(29));
          const captainJsonManifest = JSON.parse(captainJsonManifestString);
          crew[0] = { id: captainId, image: captainJsonManifest.image };
        }

        const engineerId = await readContracts.LoogieShip.crewById(1, selectedShip);
        if (engineerId > 0) {
          const engineerTokenURI = await readContracts.FancyLoogie.tokenURI(engineerId);
          const engineerJsonManifestString = atob(engineerTokenURI.substring(29));
          const engineerJsonManifest = JSON.parse(engineerJsonManifestString);
          crew[1] = { id: engineerId, image: engineerJsonManifest.image };
        }

        const officerId = await readContracts.LoogieShip.crewById(2, selectedShip);
        if (officerId > 0) {
          const officerTokenURI = await readContracts.FancyLoogie.tokenURI(officerId);
          const officerJsonManifestString = atob(officerTokenURI.substring(29));
          const officerJsonManifest = JSON.parse(officerJsonManifestString);
          crew[2] = { id: officerId, image: officerJsonManifest.image };
        }

        const seamanId = await readContracts.LoogieShip.crewById(3, selectedShip);
        if (seamanId > 0) {
          const seamanTokenURI = await readContracts.FancyLoogie.tokenURI(seamanId);
          const seamanJsonManifestString = atob(seamanTokenURI.substring(29));
          const seamanJsonManifest = JSON.parse(seamanJsonManifestString);
          crew[3] = { id: seamanId, image: seamanJsonManifest.image };
        }
        setSelectedCrew(crew);
      } else {
        setSelectedShipPreview("");
      }
    };
    updatePreview();
  }, [DEBUG, address, readContracts.LoogieShip, selectedShip, updateBalances, sendingLoogies, fishingReward]);

  return (
    <div style={{ backgroundColor: "#29aae1" }}>
      <div class="add-crew" style={{ width: 1280, margin: "auto", marginTop: 0, paddingBottom: 32, paddingTop: 40 }}>
        {selectedShipPreview ? (
          <div
            className={`ship-preview ${
              selectedCrew && (selectedCrew[0] || selectedCrew[1] || selectedCrew[2] || selectedCrew[3])
                ? "ready-to-fishing"
                : ""
            }`}
          >
            <Card style={{ width: 1200, backgroundColor: "#29aae1" }} bordered={false}>
              {fishingReward > 0 ? (
                <div style={{ height: 580, width: 878, backgroundColor: "white", position: "relative" }}>
                  <canvas
                    style={{ position: "absolute", display: "block", zIndex: 100, width: 1150, height: 580 }}
                    id="confetti-holder"
                  />
                  <div style={{ position: "absolute", marginLeft: 240 }}>
                    <p style={{ marginBottom: 0 }}>
                      <img
                        style={{ height: 450 }}
                        src={`/images/fish-${fishingRewardSize.toLowerCase()}.jpg`}
                        alt={`Fish ${fishingRewardSize}`}
                      />
                    </p>
                    <p style={{ fontSize: 30, marginBottom: 15 }}>
                      You got <strong>{fishingReward}</strong> LoogieCoins!!
                    </p>
                    <Button
                      style={{ zIndex: 200 }}
                      onClick={() => {
                        setFishingReward(0);
                        setSendingLoogies(false);
                        setFishingRewardSize("");
                      }}
                    >
                      Show LoogieShip
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  style={{ height: 580, width: 878 }}
                  dangerouslySetInnerHTML={{ __html: selectedShipPreview }}
                ></div>
              )}

              <Alert
                style={{ height: 580 }}
                message={
                  <List
                    size="large"
                    header={
                      <>
                        <p style={{ fontSize: 20, marginTop: -20, marginBottom: 20, color: "#1890ff", fontWeight: "bold" }}>
                          LoogieShip <strong>#{selectedShip}</strong>
                        </p>
                        {selectedCrew && (selectedCrew[0] || selectedCrew[1] || selectedCrew[2] || selectedCrew[3]) ? (
                          <div style={{ fontWeight: "bold", textAlign: "center", fontSize: 16, color: "green" }}>
                            Ready to go fishing!<br/>({3 - todayPlayed} left today)
                            <div style={{ marginTop: 20 }}>
                              <Button
                                type="primary"
                                disabled={sendingLoogies || todayPlayed >= 3}
                                onClick={async () => {
                                  try {
                                    const result = tx(
                                      writeContracts.SailorLoogiesGame.sendFishing(selectedShip, { gasLimit: 300000 }),
                                      function (transaction) {
                                        if (transaction.status) {
                                          document.getElementById("midi-player").start();
                                          setSendingLoogies(true);
                                          console.log("TX: ", transaction);
                                          console.log("logs: ", transaction.logs);
                                          const abiCoder = new ethers.utils.AbiCoder();
                                          const decoded = abiCoder.decode(
                                            ["uint256", "address"],
                                            transaction.logs[2].data,
                                          );
                                          // week
                                          // ethers.BigNumber.from(transaction.logs[2].topics[2]).toString()
                                          // day
                                          // ethers.BigNumber.from(transaction.logs[2].topics[3]).toString()
                                          const reward = decoded[0].toNumber();
                                          console.log("Reward: ", reward);
                                          setTodayPlayed(todayPlayed + 1);
                                          setTimeout(
                                            function (reward) {
                                              document.getElementById("midi-player").stop();
                                              document.getElementById("win-audio").play();
                                              console.log("reward on timeout: ", reward);
                                              setFishingReward(reward);
                                              if (reward >= 6000) {
                                                setFishingRewardSize("Big");
                                              } else if (reward >= 4500) {
                                                setFishingRewardSize("Medium");
                                              } else if (reward >= 3000) {
                                                setFishingRewardSize("Small");
                                              } else {
                                                setFishingRewardSize("Empty");
                                              }
                                            }.bind(this),
                                            13000,
                                            reward,
                                          );
                                        } else {
                                          alert(transaction.data.message);
                                        }
                                      },
                                    );
                                    console.log("awaiting metamask/web3 confirm result...", result);
                                    const result2 = await result;
                                    console.log("result2: ", result2);
                                  } catch (e) {
                                    console.log("sendFishing failed", e);
                                  }
                                }}
                              >
                                Send Ship (3,000 LoogieCoins)
                              </Button>
                            </div>
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
                                    src={selectedCrew[member.number].image}
                                    alt={"FancyLoogie #"+selectedCrew[member.number].id}
                                    title={"FancyLoogie #"+selectedCrew[member.number].id}
                                    style={{ width: 100 }}
                                  />
                                )}
                                <span>{member.name}</span>
                              </div>
                              <Button
                                className="action-inline-button"
                                onClick={() => {
                                  tx(writeContracts.LoogieShip.removeCrew(member.number, selectedShip), function (transaction) {
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
              style={{ width: 1200, backgroundColor: "#29aae1" }}
              bordered={false}
              title={
                <div style={{ height: 45 }}>
                  <span style={{ fontSize: 18, marginRight: 8 }}>No LoogieShip selected</span>
                </div>
              }
            />
          </div>
        )}
      </div>

      {(loadingLoogies || (yourLoogies && yourLoogies.length > 0)) && (
        <div
          id="your-loogies"
          style={{ width: "auto", margin: "auto", paddingBottom: 25, paddingRight: 40, paddingLeft: 40 }}
        >
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

                const promoteCaptain = item.bow && selectedCrew && !(0 in selectedCrew);
                const promoteEngineer = item.mustache && selectedCrew && !(1 in selectedCrew);
                const promoteOfficer = item.contactLenses && selectedCrew && !(2 in selectedCrew);
                const promoteSeaman = item.eyelashes && selectedCrew && !(3 in selectedCrew);

                const promoteAny = promoteCaptain || promoteEngineer || promoteOfficer || promoteSeaman;

                return (
                  <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                    <Card
                      style={{ backgroundColor: "#b3e2f4", border: "1px solid #0071bb", borderRadius: 10 }}
                      headStyle={{ paddingRight: 12, paddingLeft: 12 }}
                      title={
                        <div>
                          <span style={{ fontSize: 16, marginRight: 8 }}>{item.name}</span>
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
                      <img alt={item.id} src={item.image} width="240" />
                    </Card>
                  </List.Item>
                );
              }}
            />
          </div>
        </div>
      )}

      <div style={{ minHeight: 200, fontSize: 30 }}>
        <Card
          style={{
            backgroundColor: "#b3e2f4",
            border: "1px solid #0071bb",
            borderRadius: 10,
            width: 600,
            margin: "0 auto",
            textAlign: "center",
            fontSize: 16,
          }}
          title={
            <div>
              <span style={{ fontSize: 18, marginRight: 8, fontWeight: "bold" }}>Do you need some FancyLoogies?</span>
            </div>
          }
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

      <midi-player id="midi-player" src="/thesting.mid" autoplay={true} loop="1" />
      <audio id="win-audio">
        <source src="/win.wav" type="audio/wav" />
      </audio>
    </div>
  );
}

export default AddCrew;
