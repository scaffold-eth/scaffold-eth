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
import { formatEther, parseEther } from "@ethersproject/units";
import { utils, ethers } from "ethers";
//import Hints from "./Hints";
import { Hints, ExampleUI, Subgraph } from "./views";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { INFURA_ID, DAI_ADDRESS, DAI_ABI, NETWORK, NETWORKS } from "./constants";
import StackGrid from "react-stack-grid";
import ReactJson from "react-json-view";
import assets from "./assets.js";

const { BufferList } = require("bl");
// https://www.npmjs.com/package/ipfs-http-client
const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });


console.log("📦 Assets: ", assets);

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
const targetNetwork = NETWORKS["mainnet"]; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;

//EXAMPLE STARTING JSON:
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

//helper function to "Get" from IPFS
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
  let localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  if (DEBUG) console.log("🏠 localChainId", localChainId);

  let selectedChainId = userProvider && userProvider._network && userProvider._network.chainId;
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

  //📟 Listen for broadcast events
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
      let collectibleUpdate = [];
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
    updateYourCollectibles();
  }, [address, yourBalance]);
  
  //
  // 🧠 This effect will update latestMintedBots by polling when your balance or address changes. 
  //
  useEffect(() => {
    const getLatestMintedBots = async () => {

      let latestMintedBotsUpdate = [];
      if (transferEvents.length > 0){
        for ( let botIndex = 0; botIndex < transferEvents.length - 1 ; botIndex++){
          if (transferEvents[botIndex].from == "0x0000000000000000000000000000000000000000" && latestMintedBotsUpdate.length < 3) {
            try{
            let tokenId = transferEvents[botIndex].tokenId.toNumber()
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
    }
    getLatestMintedBots();
  }, [amountMintedAlready])

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  let networkDisplay = "";
  if (localChainId && selectedChainId && localChainId != selectedChainId) {
    networkDisplay = (
      <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
        <Alert
          message={"⚠️ Wrong Network"}
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
          type={"primary"}
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
  useEffect(() => {
    const updateYourCollectibles = async () => {
      let assetUpdate = [];
      for (let a in assets) {
        try {
          const forSale = await readContracts.YourCollectible.forSale(utils.id(a));
          let owner;
          if (!forSale) {
            const tokenId = await readContracts.YourCollectible.uriToTokenId(utils.id(a));
            owner = await readContracts.YourCollectible.ownerOf(tokenId);
          }
          assetUpdate.push({ id: a, ...assets[a], forSale: forSale, owner: owner });
        } catch (e) {
          console.log(e);
        }
      }
      setLoadedAssets(assetUpdate);
    };
    if (readContracts && readContracts.YourCollectible) updateYourCollectibles();
  }, [assets, readContracts, transferEvents]);

  let galleryList = [];
  for (let a in loadedAssets) {
    console.log("loadedAssets", a, loadedAssets[a]);

    let cardActions = [];
    if (loadedAssets[a].forSale) {
      cardActions.push(
        <div>
          <Button
            onClick={() => {
              console.log("gasPrice,", gasPrice);
              tx(
                writeContracts.YourCollectible.mintItem(loadedAssets[a].id, {
                  value: parseEther("1"),
                  gasPrice: gasPrice,
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
            minimized={true}
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
        <Switch>
          <Route exact path="/">
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

            <div class="colorme">
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
            </div>

            {yourCollectibles && yourCollectibles.length > 0 ? (
              <div style={{ width: 640, margin: "auto", marginTop: 32, padding: 32 }}>
                <h4 style={{ padding: 5 }}>Your MoonshotBots 🤖🚀🌕</h4>
                <br />
                <br />

                <List
                  bordered
                  dataSource={yourCollectibles}
                  renderItem={item => {
                    const id = item.id.toNumber();
                    return (
                      <List.Item style={{display: "block", backgroundColor: "rgb(127, 81, 214)", border: "1px solid #DA5892"}}>
                        <Card
                          title={
                            <div>
                              <span style={{ fontSize: 16, marginRight: 8 }}>#{id}</span> {item.name}
                            </div>
                          }
                        >
                          <div>
                            <img src={item.image} style={{ maxWidth: 150 }} />
                          </div>
                          <div>{item.description}</div>
                        </Card>

                        <Space direction="vertical" style={{ marginTop: 8, width: "100%" }}>
                          <div>
                            owner:{" "}
                            <Address
                              address={item.owner}
                              ensProvider={mainnetProvider}
                              blockExplorer={blockExplorer}
                              fontSize={16}
                            />
                          </div>
                          <AddressInput
                            ensProvider={mainnetProvider}
                            placeholder="transfer to address"
                            value={transferToAddresses[id]}
                            onChange={newValue => {
                              let update = {};
                              update[id] = newValue;
                              setTransferToAddresses({ ...transferToAddresses, ...update });
                            }}
                          />
                          <Button
                            style={{border: "1px solid rgb(218, 88, 146)"}}
                            onClick={() => {
                              console.log("writeContracts", writeContracts);
                              tx(writeContracts.MoonshotBot.transferFrom(address, transferToAddresses[id], id));
                            }}
                          >
                            Transfer
                          </Button>
                        </Space>
                      </List.Item>
                    );
                  }}
                />
              </div>
            ) : (
              <div id="preview">
                <h4>Give these bots a loving home 🤖🏠❤️</h4>
                <br />
                <br />
                <h5>{amountMintedAlready && (amountMintedAlready.toNumber())} Minted so far of 303 Maximum Possible</h5>
                <br />
                <br />
                <img src="nfts/Abrupt_Paste.png" title="Abrupt_Paste" /> <img src="nfts/Hungry_Inbox.png" />{" "}
                <img src="nfts/Acidic_Digital.png" /> <img src="nfts/Hungry_Windows.png" />{" "}
                <img src="nfts/Adorable_Malware.png" /> <img src="nfts/Hurt_App.png" />{" "}
                <img src="nfts/Adorable_Platform.png" /> <img src="nfts/Hurt_Bug.png" />{" "}
                <img src="nfts/Adventurous_Hack.png" /> <img src="nfts/Hurt_Byte.png" />{" "}
                <img src="nfts/Aggressive_Kernel.png" /> <img src="nfts/Hurt_Spyware.png" />{" "}
                <img src="nfts/Alert_Flash.png" /> <img src="nfts/Icy_Hyperlink.png" />{" "}
                <img src="nfts/Alert_Privacy.png" /> <img src="nfts/Ideal_Captcha.png" />{" "}
                <img src="nfts/Alert_Status_bar.png" /> <img src="nfts/Ideal_Node.png" />{" "}
                <img src="nfts/Aloof_Data.png" /> <img src="nfts/Immense_Enter.png" />{" "}
                <img src="nfts/Aloof_Text_editor.png" /> <img src="nfts/Impressionable_Surf.png" />{" "}
                <img src="nfts/Aloof_Url.png" /> <img src="nfts/Intrigued_Blogger.png" />{" "}
                <img src="nfts/Amiable_Shift.png" /> <img src="nfts/Intrigued_Database.png" />{" "}
                <img src="nfts/Anxious_Status_bar.png" /> <img src="nfts/Irate_Scanner.png" />{" "}
                <img src="nfts/Apprehensive_Email.png" /> <img src="nfts/Irritable_Cloud_computing.png" />{" "}
                <img src="nfts/Apprehensive_Teminal.png" /> <img src="nfts/Irritable_Xml.png" />{" "}
                <img src="nfts/Arrogant_Dns_.png" /> <img src="nfts/Itchy_Notebook_computer.png" />{" "}
                <img src="nfts/Ashamed_Backup.png" /> <img src="nfts/Jealous_Html.png" />{" "}
                <img src="nfts/Ashamed_Password.png" /> <img src="nfts/Jittery_Script.png" />{" "}
                <img src="nfts/Average_Platform.png" /> <img src="nfts/Jolly_Domain_name.png" />{" "}
                <img src="nfts/Average_Router.png" /> <img src="nfts/Jolly_Real-time.png" />{" "}
                <img src="nfts/Batty_Cypherpunk.png" /> <img src="nfts/Joyous_Queue.png" />{" "}
                <img src="nfts/Beefy_Binary.png" /> <img src="nfts/Joyous_Security.png" />{" "}
                <img src="nfts/Bland_Domain.png" /> <img src="nfts/Juicy_Template.png" />{" "}
                <img src="nfts/Blushing_Malware.png" /> <img src="nfts/Jumpy_Widget.png" />{" "}
                <img src="nfts/Blushing_Platform.png" /> <img src="nfts/Kind_Cd-rom.png" />{" "}
                <img src="nfts/Blushing_Storage.png" /> <img src="nfts/Lackadaisical_Phishing.png" />{" "}
                <img src="nfts/Bright_Log_out.png" /> <img src="nfts/Lackadaisical_Windows.png" />{" "}
                <img src="nfts/Broad_Save.png" /> <img src="nfts/Lackadaisical_Zip.png" />{" "}
                <img src="nfts/Burly_Configure.png" /> <img src="nfts/Large_Linux.png" />{" "}
                <img src="nfts/Cheeky_Hacker.png" /> <img src="nfts/Large_Table.png" />{" "}
                <img src="nfts/Cheeky_Spam.png" /> <img src="nfts/Large_Undo.png" /> <img src="nfts/Clueless_App.png" />{" "}
                <img src="nfts/Lively_Scroll_bar.png" /> <img src="nfts/Clueless_Operating_system.png" />{" "}
                <img src="nfts/Lively_Template.png" /> <img src="nfts/Colorful_Development.png" />{" "}
                <img src="nfts/Lucky_Tag.png" /> <img src="nfts/Colorful_Email.png" /> <img src="nfts/Macho_Bite.png" />{" "}
                <img src="nfts/Combative_Log_out.png" /> <img src="nfts/Magnificent_Captcha.png" />{" "}
                <img src="nfts/Combative_Shareware.png" /> <img src="nfts/Maniacal_Dns_.png" />{" "}
                <img src="nfts/Condemned_Bandwidth.png" /> <img src="nfts/Maniacal_Scan.png" />{" "}
                <img src="nfts/Condemned_Keyword.png" /> <img src="nfts/Massive_Browser.png" />{" "}
                <img src="nfts/Condescending_Kernel.png" /> <img src="nfts/Massive_Captcha.png" />{" "}
                <img src="nfts/Condescending_Qwerty.png" /> <img src="nfts/Massive_Login.png" />{" "}
                <img src="nfts/Contemplative_Dashboard.png" /> <img src="nfts/Massive_Offline.png" />{" "}
                <img src="nfts/Convincing_Flash.png" /> <img src="nfts/Melancholy_Buffer.png" />{" "}
                <img src="nfts/Convincing_Lurking.png" /> <img src="nfts/Melancholy_Bus.png" />{" "}
                <img src="nfts/Cooperative_Computer.png" /> <img src="nfts/Melancholy_Shift_key.png" />{" "}
                <img src="nfts/Cooperative_Screen.png" /> <img src="nfts/Miniature_Java.png" />{" "}
                <img src="nfts/Corny_Internet.png" /> <img src="nfts/Misty_Drag.png" />{" "}
                <img src="nfts/Corny_Motherboard.png" /> <img src="nfts/Misty_Zip.png" />{" "}
                <img src="nfts/Crabby_Macro.png" /> <img src="nfts/Muddy_Backup.png" />{" "}
                <img src="nfts/Crooked_Virus.png" /> <img src="nfts/Narrow_Hacker.png" />{" "}
                <img src="nfts/Cruel_Dns_.png" /> <img src="nfts/Narrow_Hypertext.png" />{" "}
                <img src="nfts/Cumbersome_Worm.png" /> <img src="nfts/Nasty_Faq__frequently_asked_questions_.png" />{" "}
                <img src="nfts/Cynical_Desktop.png" /> <img src="nfts/Nasty_Pirate.png" />{" "}
                <img src="nfts/Dashing_Clip_art.png" /> <img src="nfts/Naughty_Backup.png" />{" "}
                <img src="nfts/Dashing_Cpu_.png" /> <img src="nfts/Naughty_Logic.png" />{" "}
                <img src="nfts/Dashing_Data_mining.png" /> <img src="nfts/Naughty_Wireless.png" />{" "}
                <img src="nfts/Dashing_Interface.png" /> <img src="nfts/Nervous_Html.png" />{" "}
                <img src="nfts/Deceitful_Bus.png" /> <img src="nfts/Nonchalant_Log_out.png" />{" "}
                <img src="nfts/Deceitful_Log_out.png" /> <img src="nfts/Nonsensical_Backup.png" />{" "}
                <img src="nfts/Defeated_Host.png" /> <img src="nfts/Nonsensical_Gigabyte.png" />{" "}
                <img src="nfts/Delicious_Widget.png" /> <img src="nfts/Nutritious_Flash_drive.png" />{" "}
                <img src="nfts/Delightful_App.png" /> <img src="nfts/Odd_Clip_board.png" />{" "}
                <img src="nfts/Delightful_Database.png" /> <img src="nfts/Odd_Gigabyte.png" />{" "}
                <img src="nfts/Delightful_Hacker.png" /> <img src="nfts/Old-fashioned_Broadband.png" />{" "}
                <img src="nfts/Distinct_Url.png" /> <img src="nfts/Panicky_Keyword.png" />{" "}
                <img src="nfts/Disturbed_Domain_name.png" /> <img src="nfts/Panicky_User.png" />{" "}
                <img src="nfts/Eager_Frame.png" /> <img src="nfts/Petite_Worm.png" />{" "}
                <img src="nfts/Ecstatic_Version.png" /> <img src="nfts/Petty_Clip_art.png" />{" "}
                <img src="nfts/Ecstatic_Zip.png" /> <img src="nfts/Plain_Cd.png" /> <img src="nfts/Elated_Bug.png" />{" "}
                <img src="nfts/Plain_Firmware.png" /> <img src="nfts/Elated_Data_mining.png" />{" "}
                <img src="nfts/Plain_Multimedia.png" /> <img src="nfts/Elegant_Wiki.png" />{" "}
                <img src="nfts/Pleasant_Flaming.png" /> <img src="nfts/Emaciated_Page.png" />{" "}
                <img src="nfts/Pleasant_Tag.png" /> <img src="nfts/Emaciated_Rom__read_only_memory_.png" />{" "}
                <img src="nfts/Poised_Shell.png" /> <img src="nfts/Embarrassed_Server.png" />{" "}
                <img src="nfts/Poised_Trojan_horse.png" /> <img src="nfts/Enchanting_Privacy.png" />{" "}
                <img src="nfts/Poised_User.png" /> <img src="nfts/Enormous_Template.png" />{" "}
                <img src="nfts/Precious_Computer.png" /> <img src="nfts/Enthusiastic_Disk.png" />{" "}
                <img src="nfts/Precious_Logic.png" /> <img src="nfts/Exasperated_Encrypt.png" />{" "}
                <img src="nfts/Prickly_Supercomputer.png" /> <img src="nfts/Exasperated_Finder.png" />{" "}
                <img src="nfts/Proud_Storage.png" /> <img src="nfts/Excited_Hacker.png" />{" "}
                <img src="nfts/Pungent_Floppy_disk.png" /> <img src="nfts/Excited_Home_page.png" />{" "}
                <img src="nfts/Puny_Mirror.png" /> <img src="nfts/Extensive_Plug-in.png" />{" "}
                <img src="nfts/Quaint_Bus.png" /> <img src="nfts/Exuberant_Broadband.png" />{" "}
                <img src="nfts/Quaint_Shell.png" /> <img src="nfts/Exuberant_Kernel.png" />{" "}
                <img src="nfts/Quizzical_Spyware.png" /> <img src="nfts/Fantastic_Linux.png" />{" "}
                <img src="nfts/Repulsive_Analog.png" /> <img src="nfts/Fantastic_Screenshot.png" />{" "}
                <img src="nfts/Responsive_Kernel.png" /> <img src="nfts/Flat_Portal.png" />{" "}
                <img src="nfts/Responsive_Output.png" /> <img src="nfts/Floppy_Cloud_computing.png" />{" "}
                <img src="nfts/Responsive_Shell.png" /> <img src="nfts/Floppy_Interface.png" />{" "}
                <img src="nfts/Responsive_Tag.png" /> <img src="nfts/Fluttering_Integer.png" />{" "}
                <img src="nfts/Robust_Interface.png" /> <img src="nfts/Fluttering_Upload.png" />{" "}
                <img src="nfts/Round_Finder.png" /> <img src="nfts/Foolish_Kernel.png" />{" "}
                <img src="nfts/Round_Username.png" /> <img src="nfts/Foolish_Network.png" />{" "}
                <img src="nfts/Salty_Cybercrime.png" /> <img src="nfts/Frantic_Java.png" />{" "}
                <img src="nfts/Salty_Shift_key.png" /> <img src="nfts/Fresh_Domain_name.png" />{" "}
                <img src="nfts/Sarcastic_Desktop.png" /> <img src="nfts/Fresh_Laptop.png" />{" "}
                <img src="nfts/Sarcastic_Save.png" /> <img src="nfts/Fresh_Password.png" />{" "}
                <img src="nfts/Scary_Router.png" /> <img src="nfts/Fresh_Ram.png" /> <img src="nfts/Shaky_Output.png" />{" "}
                <img src="nfts/Fresh_Shareware.png" /> <img src="nfts/Shallow_Link.png" />{" "}
                <img src="nfts/Frustrating_Bug.png" /> <img src="nfts/Silky_Dot.png" />{" "}
                <img src="nfts/Funny_Bitmap.png" /> <img src="nfts/Silky_Screenshot.png" />{" "}
                <img src="nfts/Funny_Real-time.png" /> <img src="nfts/Silky_Trash.png" />{" "}
                <img src="nfts/Fuzzy_Buffer.png" /> <img src="nfts/Slimy_Qwerty.png" />{" "}
                <img src="nfts/Fuzzy_Virtual.png" /> <img src="nfts/Small_Internet.png" />{" "}
                <img src="nfts/Gaudy_Data_mining.png" /> <img src="nfts/Small_Path.png" />{" "}
                <img src="nfts/Gentle_Malware.png" /> <img src="nfts/Smarmy_Dynamic.png" />{" "}
                <img src="nfts/Ghastly_Joystick.png" /> <img src="nfts/Smoggy_Monitor.png" />{" "}
                <img src="nfts/Ghastly_Podcast.png" /> <img src="nfts/Soggy_Root.png" />{" "}
                <img src="nfts/Ghastly_Pop-up.png" /> <img src="nfts/Sour_Paste.png" />{" "}
                <img src="nfts/Ghastly_Status_bar.png" /> <img src="nfts/Spicy_Array.png" />{" "}
                <img src="nfts/Ghastly_Version.png" /> <img src="nfts/Spicy_Database.png" />{" "}
                <img src="nfts/Giddy_Computer.png" /> <img src="nfts/Stale_Download.png" />{" "}
                <img src="nfts/Giddy_Laptop.png" /> <img src="nfts/Steady_Modem.png" />{" "}
                <img src="nfts/Gigantic_Bug.png" /> <img src="nfts/Steady_Privacy.png" />{" "}
                <img src="nfts/Gigantic_Log_out.png" /> <img src="nfts/Sticky_Font.png" />{" "}
                <img src="nfts/Glamorous_Desktop.png" /> <img src="nfts/Stormy_Url.png" />{" "}
                <img src="nfts/Gleaming_Byte.png" /> <img src="nfts/Stout_Cloud_computing.png" />{" "}
                <img src="nfts/Gleaming_Process.png" /> <img src="nfts/Stunning_Programmer.png" />{" "}
                <img src="nfts/Gleaming_Scan.png" /> <img src="nfts/Substantial_Monitor.png" />{" "}
                <img src="nfts/Glorious_Integer.png" /> <img src="nfts/Succulent_Icon.png" />{" "}
                <img src="nfts/Glorious_Programmer.png" /> <img src="nfts/Superficial_Array.png" />{" "}
                <img src="nfts/Gorgeous_Piracy.png" /> <img src="nfts/Superior_Wiki.png" />{" "}
                <img src="nfts/Graceful_Security.png" /> <img src="nfts/Swanky_Trojan_horse.png" />{" "}
                <img src="nfts/Graceful_Software.png" /> <img src="nfts/Sweet_Host.png" />{" "}
                <img src="nfts/Greasy_Bus.png" /> <img src="nfts/Tasty_Url.png" /> <img src="nfts/Greasy_Digital.png" />{" "}
                <img src="nfts/Tense_Blogger.png" /> <img src="nfts/Grieving_Freeware.png" />{" "}
                <img src="nfts/Terrible_Shift_key.png" /> <img src="nfts/Grotesque_Clip_art.png" />{" "}
                <img src="nfts/Thoughtless_Html.png" /> <img src="nfts/Grotesque_Password.png" />{" "}
                <img src="nfts/Uneven_Spam.png" /> <img src="nfts/Grubby_Computer.png" />{" "}
                <img src="nfts/Uneven_Workstation.png" /> <img src="nfts/Grubby_Media.png" />{" "}
                <img src="nfts/Unsightly_Backup.png" /> <img src="nfts/Grumpy_Bite.png" />{" "}
                <img src="nfts/Unsightly_Network.png" /> <img src="nfts/Grumpy_Script.png" />{" "}
                <img src="nfts/Unsightly_Word_processor.png" /> <img src="nfts/Grumpy_Teminal.png" />{" "}
                <img src="nfts/Upset_Runtime.png" /> <img src="nfts/Grumpy_Url.png" />{" "}
                <img src="nfts/Uptight_Restore.png" /> <img src="nfts/Handsome_Worm.png" />{" "}
                <img src="nfts/Uptight_Text_editor.png" /> <img src="nfts/Happy_Delete.png" />{" "}
                <img src="nfts/Vast_Cloud_computing.png" /> <img src="nfts/Happy_Drag.png" />{" "}
                <img src="nfts/Vast_Compile.png" /> <img src="nfts/Happy_Macro.png" />{" "}
                <img src="nfts/Victorious_Cyberspace.png" /> <img src="nfts/Healthy_Encryption.png" />{" "}
                <img src="nfts/Victorious_Motherboard.png" /> <img src="nfts/Helpful_Version.png" />{" "}
                <img src="nfts/Vivacious_Bug.png" /> <img src="nfts/Helpless_Flowchart.png" />{" "}
                <img src="nfts/Vivid_Domain_name.png" /> <img src="nfts/Helpless_Laptop.png" />{" "}
                <img src="nfts/Wacky_Cpu_.png" /> <img src="nfts/Helpless_Pirate.png" />{" "}
                <img src="nfts/Wacky_Logic.png" /> <img src="nfts/Helpless_Shell.png" />{" "}
                <img src="nfts/Whimsical_Pirate.png" /> <img src="nfts/High_Rom__read_only_memory_.png" />{" "}
                <img src="nfts/Whopping_Screen.png" /> <img src="nfts/Hollow_Interface.png" />{" "}
                <img src="nfts/Wicked_Development.png" /> <img src="nfts/Hollow_Kernel.png" />{" "}
                <img src="nfts/Wicked_Key.png" /> <img src="nfts/Hollow_Spammer.png" />{" "}
                <img src="nfts/Wicked_Online.png" /> <img src="nfts/Homely_Word_processor.png" />
              </div>
            )}

            <footer class="colorme" style={{ padding: 64 }}>
              <h4 style={{ padding: 5 }}>FAQ</h4>
              <br />
              <br />
              <ul id="faq">
                <li>
                  <p>
                    <strong>🙋‍♂️ Why is the MoonshotBots Maximum Supply 303?</strong>
                    <br />
                    Because this project was made with &lt;3 in Colorado + our area code out here is 303. #shillcolorado
                  </p>
                </li>
                <li>
                  <p>
                    <strong>🙋‍♂️ How many Moonshot Bots have been minted so far?</strong>
                    <br />
                    {amountMintedAlready && (amountMintedAlready.toNumber())} Minted so far of 303 Maximum Possible.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>🙋‍♀️ When was this project launched?</strong>
                    <br />
                    This project was launched at the demo session of the monthly{" "}
                    <a href="https://moonshotcollective.space">Moonshot Collective</a> call to Moonshot'ers, during the
                    demo session (a few minutes after 12pm MST on 8/23).  Aside from the project authors (Kevin/Austin), who minted a 1 token each for testing, everyone got the the opportunity to mint their tokens all at the same time -- Woo
                    Fair Launch!!!1!
                  </p>
                </li>
                <li>
                  <p>
                    <strong>🙋‍♂️ Why was this project launched?</strong>
                    <br />
                    These PFPs were designed to celebrate the BUIDLers in the Moonshot Collective (and the ecosystem
                    they serve writ large). Builders in this space are doing amazing work!
                  </p>
                </li>
                <li>
                  <p>
                    <strong>🙋‍♀️ What are all the cool kids doing?</strong>
                    <br />
                    You are welcome to purchase 2 MoonshotBots. Keep one for yourself, and send another to your favorite
                    Builder.
                    <br />
                    <br />
                    Karma FTW!{" "}
                  </p>
                </li>
                <li>
                  <p>
                    <strong>🙋‍♂️ How is the price calculated?</strong>
                    <br />
                    These PFPs are minted on a bonding curve that increases 4.7% each purchase, and starts with a price
                    of 0.0033 ETH. Here's the bonding curve:
                    <br />
                    <a href="https://docs.google.com/spreadsheets/d/1TCdfHjCs21frJyNaR7EYtZ-zZ7xXW8vtoTH9_Qvie70/edit#gid=0">
                      <img src="chart.png" class="chart" />
                    </a>
                    <br/>
                    The price goes up IFF people are willing to buy more MoonshotBots.  There are no guarantees that this will happen; it is probably unlikely to happen.   Please buy a MoonshotBot to support public goods or because you like the art or to show appreciation for your favorite dev, please DO NOT buy them for other reasons.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>🙋‍♀️Where does the ETH go when I purchase a MoonshotBot?</strong>
                    <br />
                    100% of funds will go to the{" "}
                    <a href="https://etherscan.io/address/0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6">
                      Gitcoin Grants Multisig
                    </a>{" "}
                    to fund public goods on Gitcoin.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>🙋‍♂️Which MoonshotBots are the rarest?</strong>
                    <br />
                    1. All attributes (legs, arms, face, body, quadratic vs plain, smile) have been distributed
                    according to a bell curve to the bots.
                    <br />
                    2. We have distributed hyper-mega-rare attributes (Quadratic backgrounds, a picture of a Chad, a bow
                    tie) placed into the PFPs further along the curve.
                    <br />
                    3. See for yourself by browsing the bots above, or on{" "}
                    <a href="https://gitcoin.co/l/moonshotbots_opensea">OpenSea</a>.
                    <br />
                  </p>
                </li>
                <li>
                  <p>
                    <strong>🙋‍♂️ Whats the Moonshot Collective?</strong>
                    <br />
                    It's the prototyping workstream of the GitcoinDAO. For more information,{" "}
                    <a href="https://moonshotcollective.space">click here</a>.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>🙋‍♂️What else should we know?</strong>
                    <br />
                    <a href="https://gitcoin.co/grants/">Gitcoin Grants Round 11</a> starts September 8th! It's going to
                    have new discoverability features, new checkout options, and will feature the launch of{" "}
                    <a href="https://github.com/dcgtc/dgrants">dGrants</a>, the first decentralized Gitcoin Grants
                    Round.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>🙋‍♂️I has another question, where can I get in touch?</strong>
                    <br />
                    Tweet at us; <a href="https://twitter.com/owocki">@owocki</a> &{" "}
                    <a href="https://twitter.com/austingriffith">@austingriffith</a>.
                  </p>
                </li>
              </ul>
              <br />
              <div id="bot_interlude2">
                <img src="nfts/bot00.png" />
                <img src="nfts/bot1.png" />
                <img src="nfts/bot2.png" />
                <img src="nfts/bot3.png" />
                <img src="nfts/bot4.png" />
                <img src="nfts/bot5.png" />
                <img src="nfts/bot6.png" />
                <img src="nfts/bot7.png" />
                <img src="nfts/bot8.png" />
                <img src="nfts/bot1.png" />
                <img src="nfts/bot2.png" />
                <img src="nfts/bot4.png" />
                <img src="nfts/bot5.png" />
                <img src="nfts/bot7.png" />
                <img src="nfts/bot9.png" />
                <img src="nfts/bot00.png" />
                <img src="nfts/bot2.png" />
                <img src="nfts/bot5.png" />
                <img src="nfts/bot6.png" />
                <img src="nfts/bot7.png" />
                <img src="nfts/bot8.png" />
                <img src="nfts/bot9.png" />
              </div>
              <a
                style={{ padding: 8 }}
                href="https://github.com/austintgriffith/scaffold-eth/tree/moonshot-bots-with-curve"
              >
                Github
              </a>
              |
              <a style={{ padding: 8 }} href="https://gitcoin.co/l/moonshotbots_opensea">
                OpenSea
              </a>
              |
              <a
                style={{ padding: 8 }}
                href="https://etherscan.io/token/0x8b13e88ead7ef8075b58c94a7eb18a89fd729b18"
              >
                EtherScan
              </a>
              |
              <a style={{ padding: 8 }} href="https://t.me/joinchat/v6N_GHY-8kU3ZmRh">
                Telegram
              </a>
              |
              <a style={{ padding: 8 }} href="https://discord.gg/ACKb28pSSP">
                Discord
              </a>
              |
              <a style={{ padding: 8 }} href="https://moonshotcollective.space">
                Moonshot Collective
              </a>
              | Art by{" "}
              <a style={{ padding: 8 }} href="https://Gitcoin.co/theCydonian">
                @theCydonian
              </a>
              /
              <a style={{ padding: 8 }} href="https://Gitcoin.co/nasehim7">
                @nasehim7
              </a>
              <div id="bot_interlude2">
                <img src="nfts/bot00.png" />
                <img src="nfts/bot2.png" />
                <img src="nfts/bot3.png" />
                <img src="nfts/bot1.png" />
                <img src="nfts/bot4.png" />
                <img src="nfts/bot6.png" />
                <img src="nfts/bot7.png" />
                <img src="nfts/bot5.png" />
                <img src="nfts/bot8.png" />
                <img src="nfts/bot1.png" />
                <img src="nfts/bot4.png" />
                <img src="nfts/bot5.png" />
                <img src="nfts/bot2.png" />
                <img src="nfts/bot7.png" />
                <img src="nfts/bot9.png" />
                <img src="nfts/bot00.png" />
                <img src="nfts/bot2.png" />
                <img src="nfts/bot5.png" />
                <img src="nfts/bot2.png" />
                <img src="nfts/bot6.png" />
                <img src="nfts/bot7.png" />
                <img src="nfts/bot2.png" />
                <img src="nfts/bot8.png" />
              </div>
              <br />
              <img src="builtoneth.png" />
              <br />
            </footer>
          </Route>

          <Route path="/transfers">
            <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
              <List
                bordered
                dataSource={transferEvents}
                renderItem={item => {
                  return (
                    <List.Item key={item[0] + "_" + item[1] + "_" + item.blockNumber + "_" + item[2].toNumber()}>
                      <span style={{ fontSize: 16, marginRight: 8 }}>#{item[2].toNumber()}</span>
                      <Address address={item[0]} ensProvider={mainnetProvider} fontSize={16} /> =>
                      <Address address={item[1]} ensProvider={mainnetProvider} fontSize={16} />
                    </List.Item>
                  );
                }}
              />
            </div>
          </Route>

          <Route path="/ipfsup">
            <div style={{ paddingTop: 32, width: 740, margin: "auto", textAlign: "left" }}>
              <ReactJson
                style={{ padding: 8 }}
                src={yourJSON}
                theme={"pop"}
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
                const result = await ipfs.add(JSON.stringify(yourJSON)); //addToIPFS(JSON.stringify(yourJSON))
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
                placeHolder={"IPFS hash (like QmadqNw8zkdrrwdtPFK1pLi8PPxmkQ4pDJXY8ozHtz6tZq)"}
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
                const result = await getFromIPFS(ipfsDownHash); //addToIPFS(JSON.stringify(yourJSON))
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

      {/*}<ThemeSwitch />*/}

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
