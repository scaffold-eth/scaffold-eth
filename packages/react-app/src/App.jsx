import { Button, Col, Row, Card, List, Table } from "antd";
import "antd/dist/antd.css";
import { useBalance, useContractLoader, useGasPrice, useOnBlock, useUserProviderAndSigner } from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import {
  Account,
  Contract,
  Faucet,
  GasGauge,
  Header,
  Ramp,
  ThemeSwitch,
  NetworkDisplay,
  FaucetHint,
  NetworkSwitch,
  Blockie,
  Address,
  Joystick,
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { Subgraph } from "./views";
import { useStaticJsonRPC } from "./hooks";
import { gql, useQuery } from "@apollo/client";

const { ethers } = require("ethers");
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/scaffold-eth/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Alchemy.com & Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = false;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = true; // toggle burner wallet feature
const USE_NETWORK_SELECTOR = false;

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

function App(props) {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, "mainnet", "rinkeby"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  // 🛰 providers
  if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // const contractConfig = useContractConfig();

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  const width = 24;
  const height = 24;

  const [currentPlayer, setcurrentPlayer] = useState();

  const WORLD_PLAYER_GRAPHQL = `
    {
      worldMatrixes(
        where: {player_not: null}
        ) {
            id
            x
            y
            tokenAmountToCollect
            healthAmountToCollect
            player {
              id
              address
              fancyLoogieId
              health
              token
            }
      }
    }
  `;

  const WORLD_PLAYER_GQL = gql(WORLD_PLAYER_GRAPHQL);
  const worldPlayerData = useQuery(WORLD_PLAYER_GQL, { pollInterval: 10000 });

  console.log("worldPlayerData: ", worldPlayerData);

  const WORLD_TOKEN_GRAPHQL = `
    {
      worldMatrixes(
        where: {tokenAmountToCollect_gt: 0}
        ) {
            id
            x
            y
            tokenAmountToCollect
            healthAmountToCollect
            player {
              id
              address
              fancyLoogieId
              health
              token
            }
      }
    }
  `;

  const WORLD_TOKEN_GQL = gql(WORLD_TOKEN_GRAPHQL);
  const worldTokenData = useQuery(WORLD_TOKEN_GQL, { pollInterval: 10000 });

  console.log("worldTokenData: ", worldTokenData);

  const WORLD_HEALTH_GRAPHQL = `
    {
      worldMatrixes(
        where: {healthAmountToCollect_gt: 0}
        ) {
            id
            x
            y
            tokenAmountToCollect
            healthAmountToCollect
            player {
              id
              address
              fancyLoogieId
              health
              token
            }
      }
    }
  `;

  const WORLD_HEALTH_GQL = gql(WORLD_HEALTH_GRAPHQL);
  const worldHealthData = useQuery(WORLD_HEALTH_GQL, { pollInterval: 10000 });

  console.log("worldHealthData: ", worldHealthData);

  const [yourLoogieBalance, setYourLoogieBalance] = useState(0);
  const [yourLoogies, setYourLoogies] = useState();
  const [loadingLoogies, setLoadingLoogies] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 1;

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating loogies balance...");
      if (readContracts.FancyLoogie) {
        const loogieNewBalance = await readContracts.FancyLoogie.balanceOf(address);
        if (DEBUG) console.log("NFT: FancyLoogie - Balance: ", loogieNewBalance);
        const yourLoogieNewBalance = loogieNewBalance && loogieNewBalance.toNumber && loogieNewBalance.toNumber();
        setYourLoogieBalance(yourLoogieNewBalance);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updateBalances();
  }, [address, readContracts.FancyLoogie]);

  useEffect(() => {
    const updateYourLoogies = async () => {
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
            loogieUpdate.push({
              id: tokenId,
              uri: tokenURI,
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
    updateYourLoogies();
  }, [address, readContracts.FancyLoogie, yourLoogieBalance]);

  const [activePlayer, setActivePlayer] = useState();

  useEffect(() => {
    if (address && worldPlayerData.data) {
      let active = false;
      for (let p in worldPlayerData.data.worldMatrixes) {
        if (worldPlayerData.data.worldMatrixes[p].player.address.toLowerCase() === address.toLowerCase()) {
          active = true;
        }
      }
      setActivePlayer(active);
    }
  }, [address, worldPlayerData.data]);

  const [playerData, setPlayerData] = useState();

  useEffect(() => {
    const updatePlayersData = async () => {
      if (readContracts.Game) {
        console.log("PARSE PLAYERS:::", worldPlayerData);
        let playerInfo = {};
        const playersData = worldPlayerData.data.worldMatrixes;
        for (let p in playersData) {
          const currentPosition = playersData[p];
          console.log("loading info for ", currentPosition);
          const tokenURI = await readContracts.Game.tokenURIOf(currentPosition.player.address);
          const jsonManifestString = atob(tokenURI.substring(29));
          const jsonManifest = JSON.parse(jsonManifestString);
          const info = {
            health: parseInt(currentPosition.player.health),
            position: { x: currentPosition.x, y: currentPosition.y },
            //contract: await readContracts.Game.yourContract(worldPlayerData.data[p]),
            image: jsonManifest.image,
            gold: parseInt(currentPosition.player.token),
            address: currentPosition.player.address,
          };
          playerInfo[currentPosition.player.address] = info;
          if (address && currentPosition.player.address.toLowerCase() === address.toLowerCase()) {
            setcurrentPlayer(info);
          }
        }
        console.log("final player info", playerInfo);
        setPlayerData(playerInfo);
      }
    };
    updatePlayersData();
  }, [address, worldPlayerData, readContracts.Game]);

  const [highScores, setHighScores] = useState();

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

  const s = 64;
  const squareW = s;
  const squareH = s;

  const [worldView, setWorldView] = useState();

  useEffect(() => {
    console.log("rendering world...");
    if (worldTokenData.data && worldHealthData.data) {
      console.log("rendering world2...");
      let worldUpdate = [];
      for (let y = 0; y < height; y++) {
        for (let x = width - 1; x >= 0; x--) {
          let goldHere = 0;
          let healthHere = 0;
          for (let d in worldTokenData.data.worldMatrixes) {
            if (worldTokenData.data.worldMatrixes[d].x === x && worldTokenData.data.worldMatrixes[d].y === y) {
              goldHere = parseInt(worldTokenData.data.worldMatrixes[d].tokenAmountToCollect);
            }
          }
          for (let d in worldHealthData.data.worldMatrixes) {
            if (worldHealthData.data.worldMatrixes[d].x === x && worldHealthData.data.worldMatrixes[d].y === y) {
              healthHere = parseInt(worldHealthData.data.worldMatrixes[d].healthAmountToCollect);
            }
          }

          let fieldDisplay = "";

          if (goldHere > 0) {
            fieldDisplay = (
              <img
                alt="LoogieCoins"
                src="Gold_Full.svg"
                style={{
                  transform: "rotate(45deg) scale(1,3)",
                  width: 60,
                  height: 60,
                  marginLeft: 15,
                  marginTop: -45,
                }}
              />
            );
          }

          if (healthHere > 0) {
            fieldDisplay = (
              <img
                alt="Health"
                src="Health_Full.svg"
                style={{
                  transform: "rotate(45deg) scale(1,3)",
                  width: 60,
                  height: 60,
                  marginLeft: 15,
                  marginTop: -45,
                }}
              />
            );
          }

          //look for players here...
          let playerDisplay = "";

          for (let p in playerData) {
            if (playerData[p].position.x === x && playerData[p].position.y === y) {
              const player = playerData[p];
              playerDisplay = (
                <div style={{ position: "relative" }}>
                  <Blockie address={player.address} size={8} scale={7.5} />
                  <img
                    alt="Player"
                    src={player.image}
                    style={{
                      transform: "rotate(45deg) scale(1,3)",
                      width: 170,
                      height: 170,
                      marginLeft: -10,
                      marginTop: -190,
                    }}
                  />
                </div>
              );
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
                <div style={{ opacity: 0.7, position: "absolute", left: squareW / 2 - 10, top: 0 }}>{fieldDisplay}</div>
              </div>
            </div>,
          );
        }
      }
      setWorldView(worldUpdate);
    }
  }, [squareH, squareW, worldTokenData.data, worldHealthData.data, playerData]);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
    localChainId,
  ]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

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
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      <NetworkDisplay
        NETWORKCHECK={NETWORKCHECK}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
      />
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
      <div style={{ position: "absolute", right: 50, top: 150, width: 600 }}>
        {activePlayer ? (
          <div style={{ display: "flex" }}>
            {currentPlayer && (
              <div style={{ marginRight: 30, paddingTop: 5 }}>
                <div>
                  <span style={{ margin: 16 }}>{currentPlayer.gold}🏵</span>
                  <span style={{ margin: 16, opacity: 0.77 }}>{currentPlayer.health}❤️</span>
                </div>
                <div style={{ overflow: "hidden", width: 130, height: 130 }}>
                  <img
                    src={currentPlayer.image}
                    alt="Current Loogie"
                    style={{ transform: "scale(0.7,0.7)", width: 400, height: 400, marginTop: -130, marginLeft: -130 }}
                  />
                </div>
                <div>
                  <Address value={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={14} />
                </div>
              </div>
            )}
            <div style={{ width: 400 }}>
              <Joystick writeContracts={writeContracts} tx={tx} />
            </div>
          </div>
        ) : (
          <div>
            <div style={{ padding: 4 }}>
              {loadingLoogies || (yourLoogies && yourLoogies.length > 0) ? (
                <div id="your-loogies" style={{ paddingTop: 20 }}>
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
                        total: yourLoogies ? yourLoogies.length : 0,
                        defaultPageSize: perPage,
                        defaultCurrent: page,
                        onChange: currentPage => {
                          setPage(currentPage);
                        },
                        showTotal: (total, range) =>
                          `${range[0]}-${range[1]} of ${yourLoogies ? yourLoogies.length : 0} items`,
                      }}
                      loading={loadingLoogies}
                      dataSource={yourLoogies}
                      renderItem={item => {
                        const id = item.id.toNumber();

                        return (
                          <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                            <Card
                              style={{
                                backgroundColor: "#b3e2f4",
                                border: "1px solid #0071bb",
                                borderRadius: 10,
                                marginRight: 10
                              }}
                              headStyle={{ paddingRight: 12, paddingLeft: 12 }}
                              title={
                                <div>
                                  <span style={{ fontSize: 16, marginRight: 8 }}>{item.name}</span>
                                  <Button
                                    onClick={async () => {
                                      tx(writeContracts.Game.register(id));
                                    }}
                                  >
                                    Register
                                  </Button>
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
                        <span style={{ fontSize: 18, marginRight: 8, fontWeight: "bold" }}>
                          Do you need some FancyLoogies?
                        </span>
                      </div>
                    }
                  >
                    <div>
                      <p>
                        You can mint <strong>OptmisticLoogies</strong> and <strong>FancyLoogies</strong> at
                      </p>
                      <p>
                        <a
                          style={{ fontSize: 22 }}
                          href="https://www.fancyloogies.com"
                          target="_blank"
                          rel="noreferrer"
                        >
                          www.fancyloogies.com
                        </a>
                      </p>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Switch>
        <Route exact path="/">
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
        </Route>
        <Route exact path="/debug">
          <Contract
            name="Game"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
          <Contract
            name="LoogieCoin"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        </Route>
        <Route path="/subgraph">
          <Subgraph
            subgraphUri={props.subgraphUri}
            tx={tx}
            writeContracts={writeContracts}
            mainnetProvider={mainnetProvider}
          />
        </Route>
      </Switch>

      <ThemeSwitch />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          {USE_NETWORK_SELECTOR && (
            <div style={{ marginRight: 20 }}>
              <NetworkSwitch
                networkOptions={networkOptions}
                selectedNetwork={selectedNetwork}
                setSelectedNetwork={setSelectedNetwork}
              />
            </div>
          )}
          <Account
            useBurner={USE_BURNER_WALLET}
            address={address}
            localProvider={localProvider}
            userSigner={userSigner}
            mainnetProvider={mainnetProvider}
            price={price}
            web3Modal={web3Modal}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
            blockExplorer={blockExplorer}
          />
        </div>
        {yourLocalBalance.lte(ethers.BigNumber.from("0")) && (
          <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
        )}
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={8}>
            <Ramp price={price} address={address} networks={NETWORKS} />
          </Col>

          <Col span={8} style={{ textAlign: "center", opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice} />
          </Col>
          <Col span={8} style={{ textAlign: "center", opacity: 1 }}>
            <Button
              onClick={() => {
                window.open("https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA");
              }}
              size="large"
              shape="round"
            >
              <span style={{ marginRight: 8 }} role="img" aria-label="support">
                💬
              </span>
              Support
            </Button>
          </Col>
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              faucetAvailable ? (
                <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
