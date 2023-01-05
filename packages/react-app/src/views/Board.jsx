import React, { useEffect, useState } from "react";
import { Address, Blockie, Joystick } from "../components";
import { useContractReader } from "eth-hooks";
import { Table, Card, List, Button, Spin } from "antd";
import { gql, useQuery } from "@apollo/client";

function Board({
  readContracts,
  writeContracts,
  tx,
  mainnetProvider,
  blockExplorer,
  DEBUG,
  localProviderPollingTime,
  yourNfts,
  loadingYourNfts,
  address,
}) {
  const width = 24;
  const height = 24;
  const perPage = 1;
  const s = 64;
  const squareW = s;
  const squareH = s;

  const [currentPlayer, setCurrentPlayer] = useState();
  const [currentPlayerPosition, setCurrentPlayerPosition] = useState();
  const [page, setPage] = useState(1);
  const [activePlayer, setActivePlayer] = useState();
  const [playerData, setPlayerData] = useState();
  const [activeNftId, setActiveNftId] = useState();
  const [highScores, setHighScores] = useState();
  const [worldView, setWorldView] = useState();
  const [playerFieldCount, setPlayerFieldCount] = useState();

  const PLAYERS_GRAPHQL = `
    {
      players
      {
            id
            x
            y
            address
            nftId
      }
    }
  `;

  const PLAYERS_GQL = gql(PLAYERS_GRAPHQL);
  const worldPlayerData = useQuery(PLAYERS_GQL, { pollInterval: 1000 });

  if (DEBUG) console.log("worldPlayerData: ", worldPlayerData);

  const WORLD_TOKEN_GRAPHQL = `
    {
      tokens(
        where: {amount_gt: 0}
        ) {
            id
            x
            y
            amount
      }
    }
  `;

  const WORLD_TOKEN_GQL = gql(WORLD_TOKEN_GRAPHQL);
  const worldTokenData = useQuery(WORLD_TOKEN_GQL, { pollInterval: 1000 });

  if (DEBUG) console.log("worldTokenData: ", worldTokenData);

  const WORLD_HEALTH_GRAPHQL = `
    {
      healths(
        where: {amount_gt: 0}
        ) {
            id
            x
            y
            amount
      }
    }
  `;

  const WORLD_HEALTH_GQL = gql(WORLD_HEALTH_GRAPHQL);
  const worldHealthData = useQuery(WORLD_HEALTH_GQL, { pollInterval: 1000 });

  if (DEBUG) console.log("worldHealthData: ", worldHealthData);

  useEffect(() => {
    if (
      address &&
      worldPlayerData &&
      worldPlayerData.data &&
      worldPlayerData.data.players &&
      worldPlayerData.data.players.length > 0
    ) {
      let active = false;
      for (let p in worldPlayerData.data.players) {
        if (worldPlayerData.data.players[p].address.toLowerCase() === address.toLowerCase()) {
          active = true;
        }
      }
      setActivePlayer(active);
    }
  }, [address, worldPlayerData]);

  useEffect(() => {
    const updatePlayersData = async () => {
      if (readContracts.EmotilonBoardGame) {
        console.log("PARSE PLAYERS:::", worldPlayerData);
        let playerInfo = {};
        let playerField = {};
        if (worldPlayerData && worldPlayerData.data && worldPlayerData.data.players) {
          const playersData = worldPlayerData.data.players;
          for (let p in playersData) {
            const currentPosition = playersData[p];
            console.log("loading info for ", currentPosition);
            const tokenURI = await readContracts.EmotilonBoardGame.tokenURIOf(currentPosition.nftId);
            const healthStatus = await readContracts.Emotilon.healthStatus(currentPosition.nftId);
            const coins = await readContracts.Emotilon.coins(currentPosition.nftId);
            const dead = await readContracts.Emotilon.dead(currentPosition.nftId);
            const jsonManifestString = atob(tokenURI.substring(29));
            const jsonManifest = JSON.parse(jsonManifestString);
            const info = {
              // health: parseInt(currentPosition.player.health),
              position: { x: currentPosition.x, y: currentPosition.y },
              //contract: await readContracts.Game.yourContract(worldPlayerData.data[p]),
              image: jsonManifest.image,
              // gold: parseInt(currentPosition.player.token),
              address: currentPosition.address,
              nftId: currentPosition.nftId,
              health: healthStatus.toNumber(),
              gold: coins.toNumber(),
              dead: dead,
            };
            if (playerField[currentPosition.x]) {
              if (playerField[currentPosition.x][currentPosition.y]) {
                playerField[currentPosition.x][currentPosition.y] += 1;
              } else {
                playerField[currentPosition.x][currentPosition.y] = 1;
              }
            } else {
              playerField[currentPosition.x] = {};
              playerField[currentPosition.x][currentPosition.y] = 1;
            }
            playerInfo[currentPosition.nftId] = info;
            if (activeNftId && currentPosition.nftId == activeNftId) {
              console.log("current player: ", info);
              setCurrentPlayer(info);
            }
          }
          console.log("final player info", playerInfo);
          setPlayerData(playerInfo);
          console.log("playerField: ", playerField);
          setPlayerFieldCount(playerField);
        }
      }
    };
    updatePlayersData();
  }, [address, worldPlayerData, readContracts.EmotilonBoardGame, activeNftId]);

  useEffect(() => {
    let playersSorted = [];

    console.log("playerData", playerData);

    for (let p in playerData) {
      playersSorted.push({
        address: playerData[p].address,
        health: playerData[p].health,
        gold: playerData[p].gold,
        image: playerData[p].image,
      });
    }

    playersSorted.sort((a, b) => {
      if (a.health <= b.health) return 1;
      else return -1;
    });

    playersSorted.sort((a, b) => {
      if (a.gold <= b.gold) return 1;
      else return -1;
    });

    setHighScores(playersSorted);
  }, [playerData]);

  useEffect(() => {
    console.log("rendering world...");
    if (worldTokenData.data && worldHealthData.data) {
      console.log("rendering world2...");
      let worldUpdate = [];
      for (let y = 0; y < height; y++) {
        for (let x = width - 1; x >= 0; x--) {
          let goldHere = 0;
          let healthHere = 0;
          for (let d in worldTokenData.data.tokens) {
            if (worldTokenData.data.tokens[d].x === x && worldTokenData.data.tokens[d].y === y) {
              goldHere = parseInt(worldTokenData.data.tokens[d].amount);
            }
          }
          for (let d in worldHealthData.data.healths) {
            if (worldHealthData.data.healths[d].x === x && worldHealthData.data.healths[d].y === y) {
              healthHere = parseInt(worldHealthData.data.healths[d].amount);
            }
          }

          //look for players here...
          let playerDisplay = "";

          let count = 0;
          for (let p in playerData) {
            if (playerData[p].position.x === x && playerData[p].position.y === y) {
              count += 1;
              const player = playerData[p];
              if (playerFieldCount && playerFieldCount[x] && playerFieldCount[x][y] && playerFieldCount[x][y] > 1) {
                if (count === 1) {
                  playerDisplay = (
                    <div style={{ position: "relative" }}>
                      <img
                        alt="Player"
                        src={player.image}
                        style={{
                          transform: "rotate(45deg) scale(1,3)",
                          width: 55,
                          height: 55,
                          marginLeft: 40,
                          marginTop: -50,
                        }}
                      />
                    </div>
                  );
                } else {
                  playerDisplay = (
                    <div style={{ position: "relative" }}>
                      {playerDisplay}
                      <img
                        alt="Player"
                        src={player.image}
                        style={{
                          transform: "rotate(45deg) scale(1,3)",
                          width: 55,
                          height: 55,
                          marginLeft: -10,
                          marginTop: -10,
                        }}
                      />
                    </div>
                  );
                }
              } else {
                playerDisplay = (
                  <div style={{ position: "relative" }}>
                    <img
                      alt="Player"
                      src={player.image}
                      style={{
                        transform: "rotate(45deg) scale(1,3)",
                        width: 110,
                        height: 110,
                        marginLeft: 20,
                        marginTop: -70,
                      }}
                    />
                  </div>
                );
              }
            }
          }

          worldUpdate.push(
            <div
              style={{
                width: squareW,
                height: squareH,
                padding: 1,
                position: "absolute",
                left: squareW * x,
                top: squareH * y,
              }}
            >
              <div style={{ position: "relative", height: "100%", background: (x + y) % 2 ? "#BBBBBB" : "#EEEEEE" }}>
                {playerDisplay ? playerDisplay : <span style={{ opacity: 0.4 }}>{"" + x + "," + y}</span>}
                {goldHere > 0 && (
                  <div style={{ opacity: 0.7, position: "absolute", left: squareW / 2 - 15, top: -15 }}>
                    <img
                      alt="LoogieCoins"
                      src="Gold_Full.svg"
                      style={{
                        transform: "rotate(45deg) scale(1,3)",
                        width: 30,
                        height: 30,
                      }}
                    />
                  </div>
                )}
                {healthHere > 0 && (
                  <div style={{ opacity: 0.7, position: "absolute", left: squareW / 2 + 15, top: 15 }}>
                    <img
                      alt="Health"
                      src="Health_Full.svg"
                      style={{
                        transform: "rotate(45deg) scale(1,3)",
                        width: 30,
                        height: 30,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>,
          );
        }
      }
      setWorldView(worldUpdate);
    }
  }, [squareH, squareW, worldTokenData.data, worldHealthData.data, playerData, playerFieldCount]);

  useEffect(() => {
    console.log("Getting current player position data...", currentPlayer);
    if (currentPlayer) {
      const x = currentPlayer.position.x;
      const y = currentPlayer.position.y;
      let hasToken = false;
      let hasHealth = false;
      if (worldTokenData.data) {
        const tokenIndex = worldTokenData.data.tokens.findIndex(data => data.x === x && data.y === y);
        if (tokenIndex >= 0) {
          hasToken = true;
        }
      }
      if (worldHealthData.data) {
        const healthIndex = worldHealthData.data.healths.findIndex(data => data.x === x && data.y === y);
        if (healthIndex >= 0) {
          hasHealth = true;
        }
      }
      let hasAnotherNft = false;
      let sameOwner = false;
      let dead = false;
      let health = 0;
      let otherNftId;
      if (playerData) {
        const playerDataArray = Object.values(playerData);
        const nftIndex = playerDataArray.findIndex(
          data => data.position.x === x && data.position.y === y && data.nftId !== currentPlayer.nftId,
        );
        if (nftIndex >= 0) {
          hasAnotherNft = true;
          sameOwner = playerDataArray[nftIndex].address === currentPlayer.address;
          dead = playerDataArray[nftIndex].dead;
          health = playerDataArray[nftIndex].health;
          otherNftId = playerDataArray[nftIndex].nftId;
        }
      }
      const currentPlayerPositionUpdate = {
        hasToken: hasToken,
        hasHealth: hasHealth,
        hasAnotherNft: hasAnotherNft,
        sameOwner: sameOwner,
        dead: dead,
        health: health,
        otherNftId: otherNftId,
      };
      if (DEBUG) console.log("currentPlayerPositionUpdate: ", currentPlayerPositionUpdate);
      setCurrentPlayerPosition(currentPlayerPositionUpdate);
    }
  }, [DEBUG, worldTokenData.data, worldHealthData.data, playerData, currentPlayer]);

  const rankingColumns = [
    {
      title: "Loogie",
      dataIndex: "image",
      align: "center",
      render: (text, record) => {
        return <img alt="Player" src={text} style={{ transform: "scale(1.3,1.3)", width: 50, height: 50 }} />;
      },
    },
    {
      title: "Owner",
      dataIndex: "address",
      render: (text, record) => {
        return <Address address={text} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={14} />;
      },
    },
    {
      title: "LoogieCoins",
      dataIndex: "gold",
      align: "right",
      render: (text, record) => {
        return <span>{text}🏵</span>;
      },
    },
    {
      title: "Health",
      dataIndex: "health",
      align: "right",
      render: (text, record) => {
        return <span style={{ marginLeft: 10 }}>{text}❤️</span>;
      },
    },
  ];

  return (
    <>
      <div id="ranking" style={{ position: "absolute", left: 100, top: 100 }}>
        <Card
          style={{ backgroundColor: "#b3e2f4", border: "1px solid #0071bb", borderRadius: 10 }}
          bodyStyle={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}
          headStyle={{ height: 35, fontWeight: "bold", fontSize: 24 }}
          title={<div>Ranking</div>}
        >
          <Table
            pagination={{ defaultPageSize: 5 }}
            showHeader={false}
            rowClassName="ranking-row"
            dataSource={highScores}
            columns={rankingColumns}
          />
        </Card>
      </div>
      <div style={{ position: "absolute", right: 50, top: 100, width: 620 }}>
        {activePlayer && activeNftId ? (
          <div style={{ display: "flex" }}>
            {currentPlayer ? (
              <>
                <div style={{ marginRight: 30, paddingTop: 5 }}>
                  <div>
                    <span style={{ margin: 16, minWidth: 65, margin: 0, display: "inline-block" }}>
                      {currentPlayer.gold}🏵
                    </span>
                    <span style={{ margin: 16, opacity: 0.77, minWidth: 65, margin: 0, display: "inline-block" }}>
                      {currentPlayer.health}❤️
                    </span>
                  </div>
                  <div style={{ width: 130, height: 130 }}>
                    <img
                      src={currentPlayer.image}
                      alt="Current Emotilon"
                      style={{
                        transform: "scale(0.7,0.7)",
                        width: 400,
                        height: 400,
                        marginTop: -130,
                        marginLeft: -130,
                      }}
                    />
                  </div>
                  <div>
                    <Address
                      value={address}
                      ensProvider={mainnetProvider}
                      blockExplorer={blockExplorer}
                      fontSize={14}
                    />
                  </div>
                </div>
                <div style={{ width: 400 }}>
                  <Joystick
                    writeContracts={writeContracts}
                    tx={tx}
                    nftId={currentPlayer.nftId}
                    currentPlayerPosition={currentPlayerPosition}
                    setActiveNftId={setActiveNftId}
                    setCurrentPlayer={setCurrentPlayer}
                  />
                </div>
              </>
            ) : (
              <Spin />
            )}
          </div>
        ) : (
          <div>
            <div style={{ padding: 4 }}>
              {loadingYourNfts || (yourNfts && yourNfts.length > 0) ? (
                <div id="your-emotilons">
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
                        total: yourNfts ? yourNfts.length : 0,
                        defaultPageSize: perPage,
                        defaultCurrent: page,
                        onChange: currentPage => {
                          setPage(currentPage);
                        },
                        showTotal: (total, range) =>
                          `${range[0]}-${range[1]} of ${yourNfts ? yourNfts.length : 0} items`,
                      }}
                      loading={loadingYourNfts}
                      dataSource={yourNfts}
                      renderItem={item => {
                        const id = item.id.toNumber();

                        return (
                          <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                            <Card
                              style={{
                                backgroundColor: "#b3e2f4",
                                border: "1px solid #0071bb",
                                borderRadius: 10,
                                marginRight: 10,
                              }}
                              headStyle={{ paddingRight: 12, paddingLeft: 12 }}
                              title={
                                <div>
                                  <span style={{ fontSize: 16, marginRight: 8 }}>{item.name}</span>
                                  <Button
                                    onClick={() => {
                                      setActiveNftId(id);
                                    }}
                                  >
                                    Select
                                  </Button>
                                </div>
                              }
                            >
                              <img alt={item.id} src={item.image} width="120" />
                            </Card>
                          </List.Item>
                        );
                      }}
                    />
                  </div>
                </div>
              ) : (
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
                        <span style={{ fontSize: 18, marginRight: 8, fontWeight: "bold" }}>No Emotilons!</span>
                      </div>
                    }
                  >
                    <div>
                      <p>You need at least one Emotilon to play.</p>
                      <p>
                        <Button
                          style={{ width: 300, height: 40, fontSize: 20 }}
                          type="primary"
                          onClick={async () => {
                            try {
                              tx(writeContracts.Emotilon.mintItem({ gasLimit: 400000 }), function (transaction) {
                                // TODO
                              });
                            } catch (e) {
                              console.log("mint failed", e);
                            }
                          }}
                        >
                          MINT
                        </Button>
                      </p>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div style={{ transform: "scale(0.8,0.3)" }}>
        <div
          style={{
            transform: "rotate(-45deg)",
            color: "#111111",
            fontWeight: "bold",
            width: width * squareW,
            height: height * squareH,
            margin: "auto",
            position: "relative",
            top: -700,
          }}
        >
          {worldView}
        </div>
      </div>
    </>
  );
}

export default Board;
