import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { ConsoleSqlOutlined, LinkOutlined } from "@ant-design/icons";
import "./App.css";
import { Row, Col, Button, Menu, Alert, Input, List, Card, Switch as SwitchD, Space, Dropdown } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import {
  useExchangePrice,
  useGasPrice,
  useContractLoader,
  useContractReader,
  useEventListener,
  useBalance,
} from "./hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge, Address, AddressInput, ThemeSwitch } from "./components";
import { Transactor } from "./helpers";
import { formatEther, parseEther } from "@ethersproject/units";
import { utils, ethers } from "ethers";
//import Hints from "./Hints";
import { INFURA_ID, NETWORK, NETWORKS } from "./constants";

import { getProof, premintAddresses } from "./mint/util";

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
const targetNetwork = NETWORKS["localhost"]; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;

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

  // keep track of a variable from the contract in the local React state:
  const balance = useContractReader(readContracts, "Bufficorn", "balanceOf", [address]);
  console.log("🤗 balance:", balance);

  const priceToMint = ethers.utils.parseEther("0.1");
  const priceToPremint = ethers.utils.parseEther("0.0528");
  // useContractReader(readContracts, "MoonshotBot", "price");
  console.log("🤗 priceToMint:", priceToMint);

  const amountMintedAlready = useContractReader(readContracts, "Bufficorn", "totalSupply");
  console.log("🤗 amountMintedAlready:", amountMintedAlready);

  //📟 Listen for broadcast events
  const transferEvents = useEventListener(readContracts, "Bufficorn", "Transfer", localProvider, 1);
  console.log("📟 Transfer events:", transferEvents);

  // Track if connected address qualifies for preminting
  const [premintQualified, setPremintQualified] = useState(false);
  console.log("premintQualified:", premintQualified);

  useEffect(() => {
    const checkQualified = async () => {
      if (premintAddresses.indexOf(address.toLowerCase()) > -1) setPremintQualified(true);
      else setPremintQualified(false);
    };
    checkQualified();
  }, [address]);

  // track the lastest bots minted
  const [latestMintedBufficorns, setLatestMintedBufficorns] = useState();
  console.log("📟 latestBuffsMinted:", latestMintedBufficorns);

  //
  // 🧠 This effect will update latestMintedBots by polling when your balance or address changes.
  //
  useEffect(() => {
    const getLatestMintedBufficorns = async () => {
      let latestMintedBufficornsUpdate = [];
      if (transferEvents.length > 0) {
        for (let buffIndex = 0; buffIndex < transferEvents.length; buffIndex++) {
          if (
            transferEvents[buffIndex].from == "0x0000000000000000000000000000000000000000" &&
            latestMintedBufficornsUpdate.length < 3
          ) {
            try {
              let tokenId = transferEvents[buffIndex].tokenId.toNumber();
              const tokenURI = await readContracts.Bufficorn.tokenURI(tokenId);
              // const ipfsHash = tokenURI.replace("https://gateway.pinata.cloud/ipfs/", "");
              // const jsonManifestBuffer = await getFromIPFS(ipfsHash);
              const jsonManifest = {
                name: "Placeholder",
                image: "logo.png",
              };

              try {
                // const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
                latestMintedBufficornsUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
              } catch (e) {
                console.log(e);
              }
            } catch (e) {
              console.log(e);
            }
          }
        }
      }
      setLatestMintedBufficorns(latestMintedBufficornsUpdate);
    };
    getLatestMintedBufficorns();
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

  async function premint(address, quantity) {
    const proof = getProof(address);
    tx(writeContracts.Bufficorn.mintPresale(quantity, proof, { value: priceToPremint.mul(quantity) }));
  }

  async function handleMenuClick(e) {
    premint(address, parseInt(e.key));
  }

  const premintMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Mint 1</Menu.Item>
      <Menu.Item key="3">Mint 3</Menu.Item>
      <Menu.Item key="5">Mint 5</Menu.Item>
    </Menu>
  );

  async function handlePublicMenuClick(e) {
    const qty = parseInt(e.key);
    tx(writeContracts.Bufficorn.mintOpensale(qty, { value: priceToMint.mul(qty) }));
  }

  const publicMintMenu = (
    <Menu onClick={handlePublicMenuClick}>
      <Menu.Item key="1">Mint 1</Menu.Item>
      <Menu.Item key="3">Mint 3</Menu.Item>
      <Menu.Item key="5">Mint 5</Menu.Item>
    </Menu>
  );

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

            <div class="background">
              <div class="Section Hero">
                <div class="FlexRow Content Block">
                  <div class="Column">
                    <img class="img_hero" src="Bufficorn_astronaut.png" />
                  </div>
                  <div class="Column">
                    <h1 class="Title" style={{marginBottom: 25}}>Bufficorn Buidl Brigade</h1>
                    <h2 style={{marginBottom: 25}}>An ETHDenver PFP (10000 max supply)</h2>
                    <h3 style={{marginBottom: 25}}>
                      Created by EthDenver <a href="https://twitter.com/EthereumDenver">@ethereumdenver</a>
                    </h3>

                    {address ? (
                        <Button class="Button" type="primary" href="#Mint">
                          Mint a Bufficorn &darr;
                        </Button>
                    ) : (
                      <Button class="Button" key="loginbutton" type="primary" onClick={loadWeb3Modal}>
                        connect to mint
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div class="Section Lore">
                <div class="FlexRow Block Content">
                  <div class="Column">
                    <img class="img" src="bufficorns.png" />
                  </div>
                  <div class="Column">
                    <h2>Lore of the Bufficorn</h2>
                    <p>The Bufficorn (monocerus magicalis bisonae) are a rare and magical creature native to the Continental Divide region of Colorado’s Rocky Mountains. Although endangered, their population is making considerable resurgence as of 2018. Currently, there are around 10,000 known Bufficorns roaming the wild.</p>
                    <p>Bufficorns were first discovered in the late 1850s, just outside of today’s ski town Breckenridge, Colorado by Casper Bunyan, a prominent silver prospector of his day. Bunyan, while prospecting the Mosquito Range, saw what he described as a “pink sparkling mass of brown fur” off in the distance, near the summit of Quandary Peak. In addition to their natural magesty, they are known as voraceous buidlers, with each having a unique personality, appearance, and skillset. Learn more about the Bufficorn in the <a href="" target="_blank" rel="noopener noreferrer">Medium post</a>.</p>
                  </div>
                </div>
              </div>
              <div class="Section Mint" id="Mint">
                <div class="FlexRow Content">
                  <h2>Mint Bufficorns</h2>
                </div>
                <div class="FlexRow Block Content">
                  <div class="Column">
                    <h3>Spork holders</h3>
                    <p>
                      <i>First 24 hrs of launch</i>
                    </p>
                    <p>
                      <i>Must hold 1900 Spork</i>
                    </p>
                    <p>5280 available</p>
                    <div>
                      {address ? (
                        <Dropdown.Button
                          class="Button"
                          type={"primary"}
                          disabled={!premintQualified}
                          overlay={premintMenu}
                          onClick={async () => premint(address, 1)}
                        >
                          MINT for Ξ{priceToMint && (+ethers.utils.formatEther(priceToPremint)).toFixed(4)}
                        </Dropdown.Button>
                    ) : (
                        <Button class="Button" key="loginbutton" type="primary" onClick={loadWeb3Modal}>
                          connect to mint
                        </Button>
                      )}
                    </div>
                  </div>
                  <div class="Column">
                    <h4>Everyone</h4>
                    <p>
                      <i>Open to everyone</i>
                    </p>
                    <p>Remaining Bufficorns up to 10000 total supply</p>
                    <div>
                      {address ? (
                        <Dropdown.Button
                          type={"primary"}
                          overlay={publicMintMenu}
                          onClick={async () => {
                            tx(writeContracts.Bufficorn.mintOpensale(1, { value: priceToMint }));
                          }}
                        >
                          MINT for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}
                        </Dropdown.Button>
                      ) : (
                        <Button key="loginbutton" type="primary" onClick={loadWeb3Modal}>
                          connect to mint
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div class="Section Trailmap">
                <div class="Content">
                  <div class="FlexRow" style={{width: '100%'}}>
                    <h2 style={{marginBottom: 50}}>Trail of the Bufficorns</h2>
                  </div>
                  <div class="FlexRow">
                    <div class="Column">
                      <div class="Point Filled" />
                      <div class="Line" />
                      <div class="Point" />
                      <div class="Line" />
                      <div class="Point" />
                    </div>
                    <div class="Column">
                      <div class="Stop"><h5>Halloween 2021</h5><h4>Launch of the Bufficorns</h4></div>
                      <div class="LineSpacer" />
                      <div class="Stop"><h5>Q1 2022</h5><h4>Cool stuff</h4></div>
                      <div class="LineSpacer" />
                      <div class="Stop"><h5>Q2 2022</h5><h4>Cooler stuff</h4></div>
                    </div>
                  </div>
                </div>
              </div>

              {latestMintedBufficorns && latestMintedBufficorns.length > 0 ? (
                <div class="latestBots">
                  <h2>Bufficorns recently released into the Wild</h2>

                  <List
                    dataSource={latestMintedBufficorns}
                    renderItem={item => {
                      const id = item.id;
                      return (
                        <a href={`https://opensea.io/assets/0x8b13e88EAd7EF8075b58c94a7EB18A89FD729B18/${item.id}`}>
                          <List.Item style={{ display: "inline-block", border: "none", margin: 10 }}>
                            <Card
                              style={{ borderBottom: "none", border: "none", background: "none" }}
                              title={
                                <div style={{ fontSize: 16, marginRight: 8, color: "white" }}>
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
                <div />
              )}
            </div>

            <footer class="colorme Section">
              <div class="Content">
                <h3>FAQ</h3>
                <br />
                <br />
                <ul id="faq">
                  <li>
                    <p>
                      <strong>🙋‍♂️ Why is the Maximum Supply 10000?</strong>
                      <br />
                      Because.
                    </p>
                  </li>
                </ul>
                <br />
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
                <br />
                <img src="builtoneth.png" />
                <br />
              </div>
            </footer>
          </Route>

          <Route path="/debugcontracts">
            <Contract
              name="Bufficorn"
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
