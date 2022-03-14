import { Button, Col, Row, List, Card, Spin, Table } from "antd";
import "antd/dist/antd.css";
import { useBalance, useContractLoader, useGasPrice, useUserProviderAndSigner } from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import {
  Account,
  Faucet,
  GasGauge,
  Header,
  Ramp,
  ThemeSwitch,
  NetworkDisplay,
  FaucetHint,
  NetworkSwitch,
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Web3ModalSetup } from "./helpers";
import { useStaticJsonRPC } from "./hooks";
const axios = require("axios");

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

const targetClaimNetwork = NETWORKS.kovanOptimism;

const serverUrl = "http://localhost:8080/";

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = false;
const USE_BURNER_WALLET = false; // toggle burner wallet feature
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
  const targetProvider = useStaticJsonRPC([targetClaimNetwork.rpcUrl]);
  const mainnetProvider = useStaticJsonRPC(providers);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

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

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  // const contractConfig = useContractConfig();

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);
  const targetReadContracts = useContractLoader(targetProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  const [yourCollectibles, setYourCollectibles] = useState();
  const [isSendingTx, setIsSendingTx] = useState(false);
  const [isLoadingClaims, setIsLoadingClaims] = useState(true);
  const [claims, setClaims] = useState([]);
  const [yourClaims, setYourClaims] = useState([]);
  const [anyUnclaimed, setAnyUnclaimed] = useState(false);
  const [updateLoogies, setUpdateLoogies] = useState(0);
  const [claimedLogs, setClaimedLogs] = useState([]);

  const logColumns = [
    { 
      dataIndex: 'id', 
      title: 'ID', 
      key: 'id' 
    },
    { 
      dataIndex: 'address', 
      title: 'Address', 
      key: 'address',
      render: address => <a target="_blank" href={targetClaimNetwork.blockExplorer + "address/" + address}>{address}</a>,
    },
    { 
      dataIndex: 'tokenId', 
      title: 'TokenId', 
      key: 'tokenId' 
    },    
    { 
      dataIndex: 'claimed', 
      title: 'Claimed', 
      key: 'claimed', 
      render: boolean =>  boolean ? "✓" : "✖",
    },
    { 
      dataIndex: 'claimedTimestamp', 
      title: 'ClaimedTimestamp', 
      key: 'claimedTimestamp',
      render: timestamp => (new Date(timestamp)).toUTCString(),
    },
    { 
      dataIndex: 'minted', 
      title: 'Minted', 
      key: 'minted', 
      render: boolean =>  boolean ? "✓" : "✖",
    },
    { 
      dataIndex: 'optimisticTokenId', 
      title: 'OptimisticTokenId', 
      key: 'optimisticTokenId' 
    },
    { 
      dataIndex: 'transactionHash', 
      title: 'TransactionHash', 
      key: 'transactionHash',
      render: hash => <a target="_blank" href={targetClaimNetwork.blockExplorer + "tx/" + hash}>{hash}</a>, 
    },
    { 
      dataIndex: 'transactionHashTransfer', 
      title: 'TransactionHashTransfer', 
      key: 'transactionHashTransfer',
      render: hash => <a target="_blank" href={targetClaimNetwork.blockExplorer + "tx/" + hash}>{hash}</a>,
    },
  ];

  useEffect(() => {
    const updateYourCollectibles = async () => {
      if (readContracts["Loogies"]) {
        const balance = await readContracts.Loogies.balanceOf(address);
        if (DEBUG) console.log("Balance: ", balance);
        const balanceNumber = balance && balance.toNumber && balance.toNumber();
        const collectibleUpdate = [];
        setAnyUnclaimed(false);
        for (let tokenIndex = 0; tokenIndex < balanceNumber; tokenIndex++) {
          try {
            if (DEBUG) console.log("Getting token index", tokenIndex);
            const tokenId = await readContracts.Loogies.tokenOfOwnerByIndex(address, tokenIndex);
            if (DEBUG) console.log("Getting Loogie tokenId: ", tokenId);
            const tokenURI = await readContracts.Loogies.tokenURI(tokenId);
            if (DEBUG) console.log("tokenURI: ", tokenURI);
            const jsonManifestString = atob(tokenURI.substring(29));

            const jsonManifest = JSON.parse(jsonManifestString);

            await axios
              .get(serverUrl + "claim/" + tokenId.toNumber())
              .then(response => {
                console.log("claimData: ", response);
                if (!response.data.claimed) {
                  setAnyUnclaimed(true);
                }
                collectibleUpdate.push({
                  id: tokenId,
                  claim: response.data,
                  uri: tokenURI,
                  owner: address,
                  ...jsonManifest,
                });
              })
              .catch(e => {
                console.log("Error on getting claim data: ", e);
                collectibleUpdate.push({ id: tokenId, claim: false, uri: tokenURI, owner: address, ...jsonManifest });
              });
          } catch (e) {
            console.log(e);
          }
        }
        setYourCollectibles(collectibleUpdate.reverse());
      }
    };
    updateYourCollectibles();
  }, [address, readContracts, updateLoogies]);

  useEffect(() => {
    const updateClaims = async () => {
      if (DEBUG) console.log("updateClaims...");
      if (targetReadContracts["Loogies"]) {
        if (DEBUG) console.log("started...")
        setIsLoadingClaims(true);
        axios
          .get(serverUrl + "claims/" + address)
          .then(response => {
            console.log("claimsData: ", response);
            setClaims(response.data);
          })
          .catch(e => {
            console.log("Error on getting claims data: ", e);
            setClaims([]);
          });
        setIsLoadingClaims(false);
      }
    };
    updateClaims();
  }, [address, targetReadContracts]);

  useEffect(() => {
    const updateYourClaims = async () => {
      if (targetReadContracts["Loogies"]) {
        const collectibleUpdate = [];
        for (let i = 0; i < claims.length; i++) {
          try {
            if (DEBUG) console.log("Getting claim index", i);
            const tokenId = claims[i].optimisticTokenId;
            if (DEBUG) console.log("Getting Optimistic Loogie tokenId: ", tokenId);
            const tokenURI = await targetReadContracts.Loogies.tokenURI(tokenId);
            if (DEBUG) console.log("tokenURI: ", tokenURI);
            const jsonManifestString = atob(tokenURI.substring(29));

            const jsonManifest = JSON.parse(jsonManifestString);

            collectibleUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }
        }
        setYourClaims(collectibleUpdate.reverse());
      }
    };
    updateYourClaims();
  }, [address, claims, targetReadContracts]);

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      yourMainnetBalance &&
      readContracts &&
      writeContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourMainnetBalance,
    readContracts,
    writeContracts,
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

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />

      <Switch>
        <Route exact path="/">
          <div style={{ fontSize: 20 }}>
            <p>
              We are giving away free <a href="https://optimistic.loogies.io">OptimisticLoogies</a> to <a href="https://loogies.io">Mainnet Loogies</a> owners!!!
            </p>
            <p>
              If you own some <strong>Mainnet Loogies</strong> you can claim now your <strong>OptimisticLoogies</strong>!
            </p>
          </div>

          {!address ? (
            <div class="main-connect">
              <Button
                key="loginbutton"
                style={{ fontSize: 30, width: 600, padding: 30 }}
                shape="round"
                size="large"
                type="primary"
                onClick={loadWeb3Modal}
              >
                Connect Wallet
              </Button>
            </div>
          ) : (
            <>
            {claims.length > 0 ? (
              <div style={{ margin: "auto", paddingBottom: 25 }}>
                <h2>
                  You have claimed {claims.length} <strong>Optimistic Loogies</strong>
                </h2>
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
                  loading={isLoadingClaims}
                  dataSource={yourClaims}
                  renderItem={item => {
                    console.log("item: ", item);
                    const id = item.id;

                    return (
                      <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                        <Card
                          title={
                            <div>
                              <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                            </div>
                          }
                        >
                          <img src={item.image} width="200" alt={"Loogie #" + id} />
                        </Card>
                      </List.Item>
                    );
                  }}
                />
              </div>
            ) : (
              <div>
                You didn't claimed any <strong>OptimisticLoogies</strong> yet
              </div>
            )}

            {yourCollectibles && yourCollectibles.length > 0 && anyUnclaimed && (
              <>
                <Button
                  type="primary"
                  style={{ marginBottom: 20 }}
                  disabled={isSendingTx}
                  onClick={async () => {
                    try {
                      const message = "loogie-claim-" + address;

                      const signature = await userSigner.signMessage(message);

                      setIsSendingTx(true);

                      axios
                        .post(serverUrl + "claim/", {
                          address: address,
                          signature: signature,
                        })
                        .then(response => {
                          console.log(response);
                          setClaims(response.data);
                          setIsSendingTx(false);
                          setUpdateLoogies(updateLoogies + 1);
                        })
                        .catch(e => {
                          console.log("Error on claim");
                          setIsSendingTx(false);
                        });
                    } catch (e) {
                      console.log("Claim failed", e);
                    }
                  }}
                >
                  Claim
                </Button>
                {isSendingTx && <Spin />}
              </>
            )}

            {yourCollectibles && yourCollectibles.length > 0 ? (
              <div style={{ margin: "auto", paddingBottom: 25 }}>
                <h2>
                  You have {yourCollectibles.length} <strong>Mainnet Loogies</strong>
                </h2>

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
                  dataSource={yourCollectibles}
                  renderItem={item => {
                    console.log("item: ", item);
                    const id = item.id.toNumber();

                    return (
                      <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                        <Card
                          title={
                            <div>
                              <span style={{ fontSize: 18, marginRight: 8 }}>
                                {item.name} -
                                {item.claim && item.claim.claimed ? (
                                  <span style={{ color: "green" }}>Claimed!</span>
                                ) : (
                                  <span style={{ color: "orange" }}>Pending Claim</span>
                                )}
                              </span>
                            </div>
                          }
                        >
                          <img src={item.image} width="200" alt={"Loogie #" + id} />
                        </Card>
                      </List.Item>
                    );
                  }}
                />
              </div>
            ) : (
              <div>You don't have any Loogies</div>
            )}
            </>
          )}
        </Route>
        <Route exact path="/logs">
          {address && (
            <>
              <Button
                type="primary"
                style={{ marginBottom: 20 }}
                disabled={isSendingTx}
                onClick={async () => {
                  try {
                    const message = "loogie-claim-logs-" + address;

                    const signature = await userSigner.signMessage(message);

                    setIsSendingTx(true);

                    axios
                      .post(serverUrl + "logs", {
                        address: address,
                        signature: signature,
                      })
                      .then(response => {
                        console.log(response);
                        setClaimedLogs(response.data);
                        setIsSendingTx(false);
                      })
                      .catch(e => {
                        console.log("Error getting logs");
                        setIsSendingTx(false);
                      });
                  } catch (e) {
                    console.log("Logs get failed", e);
                  }
                }}
              >
                Show Logs
              </Button>
              {claimedLogs && (
                <h2>{claimedLogs.length} Claims - {claimedLogs.filter((log) => log.minted).length} Minted</h2>
              )}
              <Table dataSource={claimedLogs} columns={logColumns} rowKey="id" />
            </>
          )}
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
