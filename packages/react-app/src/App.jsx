import WalletConnectProvider from "@walletconnect/web3-provider";
//import Torus from "@toruslabs/torus-embed"
import WalletLink from "walletlink";
import { Alert, Button, Col, Menu, Row, List, Card, Typography, Collapse, Space, Breadcrumb } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";
import "./App.css";
import { Account, Contract, Faucet, GasGauge, Header, Ramp, ThemeSwitch, Address, AddressInput } from "./components";
import { INFURA_ID, NETWORK, NETWORKS } from "./constants";
import { Transactor } from "./helpers";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useEventListener,
  useExchangePrice,
  useGasPrice,
  useUserSigner,
} from "./hooks";

const { ethers } = require("ethers");
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
const targetNetwork = NETWORKS.rinkeby; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
  : null;
const mainnetInfura = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
  : null;
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I )

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

// Coinbase walletLink init
const walletLink = new WalletLink({
  appName: "coinbase",
});

// WalletLink provider
const walletLinkProvider = walletLink.makeWeb3Provider(`https://mainnet.infura.io/v3/${INFURA_ID}`, 1);

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
  cacheProvider: true, // optional
  theme: "light", // optional. Change to "dark" for a dark theme.
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        bridge: "https://polygon.bridge.walletconnect.org",
        infuraId: INFURA_ID,
        rpc: {
          1: `https://mainnet.infura.io/v3/${INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
          100: "https://dai.poa.network", // xDai
        },
      },
    },
    /*torus: {
      package: Torus,
    },*/
    "custom-walletlink": {
      display: {
        logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
        name: "Coinbase",
        description: "Connect to Coinbase Wallet (not Coinbase App)",
      },
      package: walletLinkProvider,
      connector: async (provider, options) => {
        await provider.enable();
        return provider;
      },
    },
  },
});

function App(props) {
  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();

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
  const price = useExchangePrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userSigner = useUserSigner(injectedProvider, localProvider);

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

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, { chainId: localChainId });

  const totalSupply = useContractReader(readContracts, "BurnNFT", "totalSupply");
  const tokenPrice = useContractReader(readContracts, "BurnNFT", "price");
  const tokenLimit = useContractReader(readContracts, "BurnNFT", "limit");

  const [minting, setMinting] = useState(false);

  const STARTS_WITH = "data:application/json,";
  //let token1Image = token1 && JSON.parse(token1.slice(STARTS_WITH.length));

  const [burnyBoys, setBurnyBoys] = useState();
  const [transferToAddresses, setTransferToAddresses] = useState({});

  useEffect(() => {
    let active = true;
    const updateBurnyBoys = async () => {
      const tokenUpdate = [];
      for (let tokenIndex = totalSupply; tokenIndex > 0 && tokenIndex > totalSupply - 5; tokenIndex--) {
        try {
          if (active) {
            console.log("Getting token index", tokenIndex);
            const tokenURI = await readContracts.BurnNFT.tokenURI(tokenIndex);
            const STARTS_WITH = "data:application/json;base64,";
            let tokenURIJSON = JSON.parse(atob(tokenURI.slice(STARTS_WITH.length)));
            tokenUpdate.push({ id: tokenIndex, uri: tokenURIJSON });
            console.log(tokenURIJSON);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setBurnyBoys(tokenUpdate);
      return () => {
        active = false;
      };
    };
    updateBurnyBoys();
  }, [totalSupply]);

  let networkDisplay = "";
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network ID"
            description={
              <div>
                You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
                HardHat.
                <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    } else {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network"
            description={
              <div>
                You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
                <Button
                  onClick={async () => {
                    const ethereum = window.ethereum;
                    const data = [
                      {
                        chainId: "0x" + targetNetwork.chainId.toString(16),
                        chainName: targetNetwork.name,
                        nativeCurrency: targetNetwork.nativeCurrency,
                        rpcUrls: [targetNetwork.rpcUrl],
                        blockExplorerUrls: [targetNetwork.blockExplorer],
                      },
                    ];
                    console.log("data", data);
                    const tx = await ethereum.request({ method: "wallet_addEthereumChain", params: data }).catch();
                    if (tx) {
                      console.log(tx);
                    }
                  }}
                >
                  <b>{networkLocal && networkLocal.name}</b>
                </Button>
                .
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    }
  } else {
    networkDisplay = (
      <div style={{ zIndex: 0, position: "absolute", right: 15, top: 40, padding: 16, color: "white" }}>
        {targetNetwork.name}
      </div>
    );
  }

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

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      {networkDisplay}
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Typography.Title style={{ marginBottom: 8, paddingTop: 60 }}>{`🔥 Burny Boys 🔥`}</Typography.Title>
            <div style={{ width: 450, margin: "auto" }}>
              <Typography.Text>{`🦇🔊 Dynamic basefee NFTs 🦇🔊`}</Typography.Text>
            </div>
            <Typography.Title level={2} style={{ margin: 8 }}>{`${totalSupply || "..."} out of ${
              tokenLimit || "..."
            } minted`}</Typography.Title>
            <div>
              <Typography.Text>{`Get 'em while they're hot!`}</Typography.Text>
            </div>
            {address ? (
              <Button
                style={{ margin: 8 }}
                type="primary"
                size="large"
                loading={minting}
                disabled={!address || price > yourLocalBalance}
                onClick={async () => {
                  try {
                    setMinting(true);
                    const result = tx(
                      writeContracts.BurnNFT.mint({
                        value: tokenPrice,
                      }),
                    );
                    console.log("awaiting metamask/web3 confirm result...", result);
                    console.log(await result);
                    setMinting(false);
                  } catch (e) {
                    console.log(e);
                    setMinting(false);
                  }
                }}
              >
                {`Mint for ${tokenPrice ? ethers.utils.formatEther(tokenPrice) : "..."} ETH`}
              </Button>
            ) : (
              <Button
                key="loginbutton"
                type="primary"
                style={{ verticalAlign: "top", margin: 8 }}
                shape="round"
                size="large"
                /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
                onClick={loadWeb3Modal}
              >
                connect to mint
              </Button>
            )}
            <p>
              <a href={"https://medium.com/@azfuller20/burny-boys-so-hot-right-now-f16482c5f474"} target="_blank">
                {"About"}
              </a>
              <span>{" / "}</span>
              <a href="https://github.com/austintgriffith/scaffold-eth/tree/burny-boy" target="_blank">
                <GithubOutlined />
              </a>
              <span>{" / "}</span>
              <a
                href={readContracts && targetNetwork.blockExplorer + "address/" + readContracts.BurnNFT.address}
                target="_blank"
              >
                {"Smart contract"}
              </a>
              <span>{" / "}</span>
              <a
                href={`https://${targetNetwork.name == "rinkeby" ? `testnets.` : ""}opensea.io/collection/burnyboy-v4`}
                target="_blank"
              >
                {"OpenSea"}
              </a>
            </p>
            <p>
              <a href="https://buidlguidl.com/" target="_blank">
                🏰 BuidlGuidl
              </a>
              <span>{" with art by "}</span>
              <a href="https://twitter.com/tomosaito" target="_blank">
                {"@tomosaito"}
              </a>
            </p>
            <Card style={{ width: 640, margin: "auto", marginTop: 32, marginBottom: 32 }} title="Latest Burny Boys">
              <List
                bordered
                dataSource={burnyBoys}
                renderItem={item => {
                  const id = item.id;
                  return (
                    <List.Item key={id} extra={<img src={item.uri && item.uri.image_data} height="200" alt="" />}>
                      <List.Item.Meta
                        title={
                          <div>
                            <span style={{ fontSize: 16, marginRight: 8 }}>
                              {" "}
                              <a
                                href={`https://${targetNetwork.name == "rinkeby" ? `testnets.` : ""}opensea.io/assets/${
                                  readContracts.BurnNFT.address
                                }/${id}`}
                                target="_blank"
                              >
                                {item.uri.name}
                              </a>
                            </span>
                          </div>
                        }
                        description={
                          <div style={{ padding: 4 }}>
                            <p>{item.uri.description}</p>
                            <Address
                              address={item.uri.owner}
                              ensProvider={mainnetProvider}
                              blockExplorer={blockExplorer}
                              fontSize={16}
                            />
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </Card>
            {/*
            <Contract
              name="BurnNFT"
              signer={userSigner}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />*/}
          </Route>
        </Switch>
      </BrowserRouter>

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
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
