import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { LinkOutlined } from "@ant-design/icons";
import "./App.css";
import { Row, Col, Button, Menu, Alert, Input, List, Card, Switch as SwitchD, Space } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { formatEther, parseEther } from "@ethersproject/units";
import { utils, ethers } from "ethers";
import { useThemeSwitcher } from "react-css-theme-switcher";
import StackGrid from "react-stack-grid";
import ReactJson from "react-json-view";
import {
  useExchangePrice,
  useGasPrice,
  useUserProvider,
  useContractLoader,
  useContractReader,
  useEventListener,
  useBalance,
  useExternalContractLoader,
} from "./hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge, Address, AddressInput, ThemeSwitch } from "./components";
import { Transactor } from "./helpers";
// import Hints from "./Hints";
import { Hints, ExampleUI, Subgraph } from "./views";
import { INFURA_ID, DAI_ADDRESS, DAI_ABI, NETWORK, NETWORKS } from "./constants";
import MainUI from "./views/MainUI";
import WhalesUI from "./views/WhalesUI";

const { BufferList } = require("bl");
// https://www.npmjs.com/package/ipfs-http-client
const ipfsAPI = require("ipfs-http-client");

const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    🌏 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;

// EXAMPLE STARTING JSON:
const STARTING_JSON = {
  description: "It's actually a bison?",
  external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
  image: "https://austingriffith.com/images/paintings/buffalo.jpg",
  name: "Buffalo",
  attributes: [
    {
      trait_type: "BackgroundColor",
      value: "green",
    },
    {
      trait_type: "Eyes",
      value: "googly",
    },
  ],
};

// helper function to "Get" from IPFS
// you usually go content.toString() after this...
const getFromIPFS = async hashToGet => {
  for await (const file of ipfs.get(hashToGet)) {
    console.log(file.path);
    if (!file.content) continue;
    const content = new BufferList();
    for await (const chunk of file.content) {
      content.append(chunk);
    }
    console.log(content);
    return content;
  }
};

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
const scaffoldEthProvider = new JsonRpcProvider("https://rpc.scaffoldeth.io:48544");
const mainnetInfura = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

function App(props) {
  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;
  if (DEBUG) console.log("🌎 mainnetProvider", mainnetProvider);

  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = injectedProvider;
  const address = useUserAddress(userProvider);
  if (DEBUG) console.log("👩‍💼 selected address:", address);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  if (DEBUG) console.log("🏠 localChainId", localChainId);

  const selectedChainId = userProvider && userProvider._network && userProvider._network.chainId;
  if (DEBUG) console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  if (DEBUG) console.log("💵 yourLocalBalance", yourLocalBalance ? formatEther(yourLocalBalance) : "...");

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);
  if (DEBUG) console.log("💵 yourMainnetBalance", yourMainnetBalance ? formatEther(yourMainnetBalance) : "...");

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider);
  if (DEBUG) console.log("📝 readContracts", readContracts);

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider);
  if (DEBUG) console.log("🔐 writeContracts", writeContracts);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI);
  console.log("🌍 DAI contract on mainnet:", mainnetDAIContract);
  //
  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader({ DAI: mainnetDAIContract }, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);
  console.log("🥇 myMainnetDAIBalance:", myMainnetDAIBalance);

  // keep track of a variable from the contract in the local React state:
  const balance = useContractReader(readContracts, "MoonshotBot", "balanceOf", [address]);
  console.log("🤗 balance:", balance);

  const priceToMint = useContractReader(readContracts, "MoonshotBot", "price");
  console.log("🤗 priceToMint:", priceToMint);

  const amountMintedAlready = useContractReader(readContracts, "MoonshotBot", "totalSupply");
  console.log("🤗 amountMintedAlready:", amountMintedAlready);

  // 📟 Listen for broadcast events
  const transferEvents = useEventListener(readContracts, "MoonshotBot", "Transfer", localProvider, 1);
  console.log("📟 Transfer events:", transferEvents);

  // track the lastest bots minted
  const [lastestMintedBots, setLatestMintedBots] = useState();
  console.log("📟 latestBotsMinted:", lastestMintedBots);

  //
  // 🧠 This effect will update yourCollectibles by polling when your balance changes
  //
  const yourBalance = balance && balance.toNumber && balance.toNumber();
  const [yourCollectibles, setYourCollectibles] = useState();

  useEffect(() => {
    const updateYourCollectibles = async () => {
      const collectibleUpdate = [];
      for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
        try {
          console.log("GEtting token index", tokenIndex);
          const tokenId = await readContracts.MoonshotBot.tokenOfOwnerByIndex(address, tokenIndex);
          console.log("tokenId", tokenId);
          const tokenURI = await readContracts.MoonshotBot.tokenURI(tokenId);
          console.log("tokenURI", tokenURI);

          const ipfsHash = tokenURI.replace("https://gateway.pinata.cloud/ipfs/", "");
          console.log("ipfsHash", ipfsHash);

          const jsonManifestBuffer = await getFromIPFS(ipfsHash);

          try {
            const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
            console.log("jsonManifest", jsonManifest);
            collectibleUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourCollectibles(collectibleUpdate);
    };
    // updateYourCollectibles();
  }, [address, yourBalance]);

  //
  // 🧠 This effect will update latestMintedBots by polling when your balance or address changes.
  //
  useEffect(() => {
    const getLatestMintedBots = async () => {
      const latestMintedBotsUpdate = [];
      if (transferEvents.length > 0) {
        for (let botIndex = 0; botIndex < transferEvents.length - 1; botIndex++) {
          if (
            transferEvents[botIndex].from == "0x0000000000000000000000000000000000000000" &&
            latestMintedBotsUpdate.length < 3
          ) {
            try {
              const tokenId = transferEvents[botIndex].tokenId.toNumber();
              const tokenURI = await readContracts.MoonshotBot.tokenURI(tokenId);
              const ipfsHash = tokenURI.replace("https://gateway.pinata.cloud/ipfs/", "");
              const jsonManifestBuffer = await getFromIPFS(ipfsHash);

              try {
                const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
                latestMintedBotsUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
              } catch (e) {
                console.log(e);
              }
            } catch (e) {
              console.log(e);
            }
          }
        }
      }
      setLatestMintedBots(latestMintedBotsUpdate);
    };
    // getLatestMintedBots();
  }, [amountMintedAlready]);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  let networkDisplay = "";
  if (localChainId && selectedChainId && localChainId != selectedChainId) {
    networkDisplay = (
      <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
        <Alert
          message="⚠️ Wrong Network"
          description={
            <div>
              You have <b>{NETWORK(selectedChainId).name}</b> selected and you need to be on{" "}
              <b>{NETWORK(localChainId).name}</b>.
            </div>
          }
          type="error"
          closable={false}
        />
      </div>
    );
  } else {
    networkDisplay = (
      <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
        {targetNetwork.name}
      </div>
    );
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3Provider(provider));
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  let faucetHint = "";
  const faucetAvailable =
    localProvider &&
    localProvider.connection &&
    localProvider.connection.url &&
    localProvider.connection.url.indexOf(window.location.hostname) >= 0 &&
    !process.env.REACT_APP_PROVIDER &&
    price > 1;

  const [faucetClicked, setFaucetClicked] = useState(false);
  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId == 31337 &&
    yourLocalBalance &&
    formatEther(yourLocalBalance) <= 0
  ) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            faucetTx({
              to: address,
              value: parseEther("0.01"),
            });
            setFaucetClicked(true);
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    );
  }

  const [yourJSON, setYourJSON] = useState(STARTING_JSON);
  const [sending, setSending] = useState();
  const [ipfsHash, setIpfsHash] = useState();
  const [ipfsDownHash, setIpfsDownHash] = useState();

  const [downloading, setDownloading] = useState();
  const [ipfsContent, setIpfsContent] = useState();

  const [transferToAddresses, setTransferToAddresses] = useState({});

  const [loadedAssets, setLoadedAssets] = useState();
  // useEffect(() => {
  //   const updateYourCollectibles = async () => {
  //     const assetUpdate = [];
  //     for (const a in assets) {
  //       try {
  //         const forSale = await readContracts.YourCollectible.forSale(utils.id(a));
  //         let owner;
  //         if (!forSale) {
  //           const tokenId = await readContracts.YourCollectible.uriToTokenId(utils.id(a));
  //           owner = await readContracts.YourCollectible.ownerOf(tokenId);
  //         }
  //         assetUpdate.push({ id: a, ...assets[a], forSale, owner });
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     }
  //     setLoadedAssets(assetUpdate);
  //   };
  //   if (readContracts && readContracts.YourCollectible) updateYourCollectibles();
  // }, [assets, readContracts, transferEvents]);

  const galleryList = [];
  for (const a in loadedAssets) {
    console.log("loadedAssets", a, loadedAssets[a]);

    const cardActions = [];
    if (loadedAssets[a].forSale) {
      cardActions.push(
        <div>
          <Button
            onClick={() => {
              console.log("gasPrice,", gasPrice);
              tx(
                writeContracts.YourCollectible.mintItem(loadedAssets[a].id, {
                  value: parseEther("1"),
                  gasPrice,
                }),
              );
            }}
          >
            BUY (1 ETH)
          </Button>
        </div>,
      );
    } else {
      cardActions.push(
        <div>
          owned by:{" "}
          <Address
            address={loadedAssets[a].owner}
            ensProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            minimized
          />
        </div>,
      );
    }

    galleryList.push(
      <Card
        style={{ width: 200 }}
        key={loadedAssets[a].name}
        actions={cardActions}
        title={
          <div>
            {loadedAssets[a].name}{" "}
            <a style={{ cursor: "pointer", opacity: 0.33 }} href={loadedAssets[a].external_url} target="_blank">
              <LinkOutlined />
            </a>
          </div>
        }
      >
        <img style={{ maxWidth: 130 }} src={loadedAssets[a].image} />
        <div style={{ opacity: 0.77 }}>{loadedAssets[a].description}</div>
      </Card>,
    );
  }

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}

      <BrowserRouter>
        <Menu style={{ textAlign: "center", marginBottom: "30px" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute("/");
              }}
              to="/"
            >
              My NFTs
            </Link>
          </Menu.Item>
          <Menu.Item key="/whales">
            <Link
              onClick={() => {
                setRoute("/whales");
              }}
              to="/whales"
            >
              Whales
            </Link>
          </Menu.Item>
        </Menu>

        <Switch>
          <Route exact path="/">
            <MainUI
              loadWeb3Modal={loadWeb3Modal}
              address={address}
              tx={tx}
              writeContracts={writeContracts}
              readContracts={readContracts}
              priceToMint={priceToMint}
            />
          </Route>
          <Route exact path="/whales">
            <WhalesUI
              address={address}
              tx={tx}
              writeContracts={writeContracts}
              readContracts={readContracts}
              priceToMint={priceToMint}
            />
          </Route>
          {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally

            <div style={{ maxWidth:820, margin: "auto", marginTop:32, paddingBottom:256 }}>
              <StackGrid
                columnWidth={200}
                gutterWidth={16}
                gutterHeight={16}
              >
                {galleryList}
              </StackGrid>
            </div>
            */}

          {/* <div class="colorme">
              <img class="logo_moonshot sub" src="logo.png" />
              <img class="logo_moonshot" src="logo1.png" />
              <img class="logo_moonshot sub" src="logo2.png" />
              <br />
              <h1>Moonshot Bots</h1>

              <h2>An ⭐️Ultra-Rare⭐️ PFP (303 max supply)</h2>
              <h2>
                Created by ya bois <a href="https://twitter.com/owocki">@owocki</a> &{" "}
                <a href="https://twitter.com/austingriffith">@austingriffith</a>
              </h2>
              <h2>
                ❤️🛠 Seeded on 8/23 @ 12pm MST to BUIDLers in{" "}
                <a href="https://moonshotcollective.space">Moonshot Collective</a>
              </h2>
              <div style={{ padding: 32 }}>
                {address ? (
                  <Button
                    type={"primary"}
                    onClick={async () => {
                      let priceRightNow = await readContracts.MoonshotBot.price();
                      //priceRightNow = priceRightNow.mul(1098).div(1000);//up the price by 3% for the initial launch to avoid errors?
                      tx(writeContracts.MoonshotBot.requestMint(address, { value: priceRightNow }));
                    }}
                  >
                    MINT for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}
                  </Button>
                ) : (
                  <Button key="loginbutton" type="primary" onClick={loadWeb3Modal}>
                    connect to mint
                  </Button>
                )}
                <p>Your purchase of the Bot NFT does NOT CONSTITUTE AN INVESTMENT.</p>
                
                <div class="publicgoodsgood">
                  <h2>🌱❤️100% Proceeds To Public Goods❤️🌱</h2>
                  🦧✊ <strong>Demand more from PFPs! 👇</strong> <br />
                  🌱🌱 <strong>100%</strong> of MoonshotBot Minting Fees go to fund Ethereum Public Goods on Gitcoin
                  Grants 🌱🌱 <br />
                  <strong>🦧✊🌱100%🌱✊🦧</strong>
                </div>
                <br />
                <br />
                <div class="bondingcurvegood">
                  <h2>Purchase Price Determined by a Bonding Curve</h2>
                  <strong>👇 Click the chart to see the pricing model 👇</strong> <br />
                    <a href="https://docs.google.com/spreadsheets/d/1TCdfHjCs21frJyNaR7EYtZ-zZ7xXW8vtoTH9_Qvie70/edit#gid=0">
                      <img src="chartarrow.png" class="chart" />
                    </a>
                </div>
                <br />
                <br />  
                
                {lastestMintedBots && lastestMintedBots.length > 0 ? (
                <div class="latestBots">
                <h2>Latest Minted Bots</h2>

                <List
                  dataSource={lastestMintedBots}
                  renderItem={item => {
                    const id = item.id;
                    return (
                      <a href={`https://opensea.io/assets/0x8b13e88EAd7EF8075b58c94a7EB18A89FD729B18/${item.id}`}>
                        <List.Item style={{ display: 'inline-block', border: 'none', margin: 10 }}> 
                          <Card
                            style={{ borderBottom:'none', border: 'none', background: "none"}}
                            title={
                              <div style={{ fontSize: 16, marginRight: 8, color: 'white' }}>
                                <span>#{id}</span> {item.name}
                              </div>
                            }
                          >
                            <div>
                              <img src={item.image} style={{ maxWidth: 150 }} />
                            </div>
                          </Card>
                        </List.Item>
                      </a>
                    );
                  }}
                />
                </div>
                ) : (
                  <div>
                  </div>
                )}
                <br />
                <br /> 
              </div>

              {yourCollectibles && yourCollectibles.length > 0 ? (
                <div></div>
              ) : (
                <div class="colorme2">
                  <div id="bot_interlude">
                    <img src="nfts/bot00.png" />
                    <img src="nfts/bot1.png" />
                    <img src="nfts/bot2.png" />
                    <img src="nfts/bot3.png" />
                    <img src="nfts/bot4.png" />
                    <img src="nfts/bot5.png" />
                    <img src="nfts/bot6.png" />
                    <img src="nfts/bot7.png" />
                    <img src="nfts/bot8.png" />
                    <img src="nfts/bot9.png" />
                  </div>

                  <h4 style={{ padding: 5 }}>Why We Think MoonShotBots Rock:</h4>
                  <br />
                  <br />
                  <ul class="rocks">
                    <li>🤖🍠 Fair Launch</li>
                    <li>🤖👑 Ultra Super Mega Giga-Chad Rare</li>
                    <li>🤖🌱 All Proceeds Support Public Goods</li>
                    <li>
                      🤖🛠 Early Holders are <a href="https://moonshotcollective.space">Moonshot Collective</a> Builders
                    </li>
                    <li>
                      🤖❤️ Hang with your botfrens on <a href="https://discord.gg/ACKb28pSSP">Discord</a> &{" "}
                      <a href="https://t.me/joinchat/v6N_GHY-8kU3ZmRh">Telegram</a>
                    </li>
                  </ul>
                </div>
              )}

              {yourCollectibles && yourCollectibles.length > 0 ? (
                <div></div>
              ) : (
                <div class="colorme3">
                  <h4 style={{ padding: 5 }}>Testimonials:</h4>
                  <br />
                  <br />
                  <div class="Testimonial">
                    <img src="nfts/testimonial01.png" />
                    <h5>Corny Internet Bot</h5>
                    <p>11011101 11011001 1100101 11011101 11011101 11011001 11011101 11011101 1100101</p>
                  </div>
                  <div class="Testimonial">
                    <img src="nfts/testimonial02.png" />
                    <h5>Large Linux Bot</h5>
                    <p>
                      ba bup ba bup bup bup bup kwwaaaaaaaaaaaaa eeeeeuuuueeuuueeuuuu **denga denga**
                      Krchhhhhhhhhhhhhhhhhhhhhhhhhhh
                    </p>
                  </div>
                  <div class="Testimonial">
                    <img src="nfts/testimonial03.png" />
                    <h5>Vicious MotherBoard Bot</h5>
                    <p>
                      Beep Boop Bop Bop Moonshot Collective Beep Boop Bot Boop Boop Bloop Beep Boop Boop Bloop Beep{" "}
                    </p>
                  </div>
                </div>
              )}
            </div> */}

          <Route path="/ipfsup">
            <div style={{ paddingTop: 32, width: 740, margin: "auto", textAlign: "left" }}>
              <ReactJson
                style={{ padding: 8 }}
                src={yourJSON}
                theme="pop"
                enableClipboard={false}
                onEdit={(edit, a) => {
                  setYourJSON(edit.updated_src);
                }}
                onAdd={(add, a) => {
                  setYourJSON(add.updated_src);
                }}
                onDelete={(del, a) => {
                  setYourJSON(del.updated_src);
                }}
              />
            </div>

            <Button
              style={{ margin: 8 }}
              loading={sending}
              size="large"
              shape="round"
              type="primary"
              onClick={async () => {
                console.log("UPLOADING...", yourJSON);
                setSending(true);
                setIpfsHash();
                const result = await ipfs.add(JSON.stringify(yourJSON)); // addToIPFS(JSON.stringify(yourJSON))
                if (result && result.path) {
                  setIpfsHash(result.path);
                }
                setSending(false);
                console.log("RESULT:", result);
              }}
            >
              Upload to IPFS
            </Button>

            <div style={{ padding: 16, paddingBottom: 150 }}>{ipfsHash}</div>
          </Route>
          <Route path="/ipfsdown">
            <div style={{ paddingTop: 32, width: 740, margin: "auto" }}>
              <Input
                value={ipfsDownHash}
                placeHolder="IPFS hash (like QmadqNw8zkdrrwdtPFK1pLi8PPxmkQ4pDJXY8ozHtz6tZq)"
                onChange={e => {
                  setIpfsDownHash(e.target.value);
                }}
              />
            </div>
            <Button
              style={{ margin: 8 }}
              loading={sending}
              size="large"
              shape="round"
              type="primary"
              onClick={async () => {
                console.log("DOWNLOADING...", ipfsDownHash);
                setDownloading(true);
                setIpfsContent();
                const result = await getFromIPFS(ipfsDownHash); // addToIPFS(JSON.stringify(yourJSON))
                if (result && result.toString) {
                  setIpfsContent(result.toString());
                }
                setDownloading(false);
              }}
            >
              Download from IPFS
            </Button>

            <pre style={{ padding: 16, width: 500, margin: "auto", paddingBottom: 150 }}>{ipfsContent}</pre>
          </Route>
          <Route path="/debugcontracts">
            <Contract
              name="MoonshotBot"
              signer={userProvider && userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
          </Route>
        </Switch>
      </BrowserRouter>

      {/* }<ThemeSwitch /> */}

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          localProvider={localProvider}
          userProvider={userProvider}
          mainnetProvider={mainnetProvider}
          price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
        {faucetHint}
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

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

window.ethereum &&
  window.ethereum.on("chainChanged", chainId => {
    setTimeout(() => {
      window.location.reload();
    }, 1);
  });

export default App;
