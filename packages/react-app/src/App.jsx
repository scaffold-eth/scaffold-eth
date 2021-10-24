import WalletConnectProvider from "@walletconnect/web3-provider";
//import Torus from "@toruslabs/torus-embed"
import WalletLink from "walletlink";
import { Alert, Button, Col, Menu, Row, List, Card, Typography, Collapse, Space, Breadcrumb } from "antd";
import { GithubOutlined, TwitterOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch, useParams } from "react-router-dom";
import Web3Modal from "web3modal";
import "./App.css";
import { Account, Contract, Faucet, GasGauge, Header, Ramp, ThemeSwitch, Address, AddressInput } from "./components";
import { INFURA_ID, NETWORK, NETWORKS } from "./constants";
import { Transactor, generateSVG } from "./helpers";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useEventListener,
  useExchangePrice,
  useGasPrice,
  useOnBlock,
  usePoller,
  useUserSigner,
  useBurnerSigner,
} from "./hooks";
import { ViewBurnyBoy, BurnyBoyList } from "./views";
import { gql, useQuery } from "@apollo/client";
import ImageUploading from "react-images-uploading";

import { NFTStorage, File } from "nft.storage";

const { RelayProvider } = require("@opengsn/provider");
const Web3HttpProvider = require("web3-providers-http");

const apiKey = process.env.REACT_APP_NFT_STORAGE;
const client = new NFTStorage({ token: apiKey });

const { ethers } = require("ethers");

const targetNetwork = NETWORKS.rinkeby; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

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
  const burnerSigner = useBurnerSigner(localProvider);
  const [burnerGsnSigner, setBurnerGsnSigner] = useState();

  let httpProvider = new Web3HttpProvider(localProviderUrl);

  const gsnConfig = {
    paymasterAddress: "0xA6e10aA9B038c9Cddea24D2ae77eC3cE38a0c016", //"0xdA78a11FD57aF7be2eDD804840eA7f4c2A38801d", //"0x9e59Ea5333cD4f402dAc320a04fafA023fe3810D",
    loggerConfiguration: {
      logLevel: "debug",
      // loggerUrl: 'logger.opengsn.org',
    },
  };

  useEffect(() => {
    const updateGsnSigner = async () => {
      let burnerAddress = await burnerSigner.getAddress();
      // Adding a burner meta provider
      const burnerGsnProvider = await RelayProvider.newProvider({ provider: httpProvider, config: gsnConfig }).init();
      burnerGsnProvider.addAccount(burnerSigner.privateKey);
      const burnerGsnWeb3Provider = new ethers.providers.Web3Provider(burnerGsnProvider);
      const newBurnerGsnSigner = burnerGsnWeb3Provider.getSigner(burnerAddress);
      setBurnerGsnSigner(newBurnerGsnSigner);
    };
    if (burnerSigner) updateGsnSigner();
  }, [burnerSigner]);

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

  const totalSupply = useContractReader(readContracts, "NataNFT", "totalSupply");
  const dao = useContractReader(readContracts, "NataNFT", "dao");

  const [latestBlock, setLatestBlock] = useState();
  usePoller(async () => {
    const newBlock = await localProvider.getBlock("latest");
    setLatestBlock(newBlock);
  }, 10000);

  const [minting, setMinting] = useState(false);

  const STARTS_WITH = "data:application/json,";
  //let token1Image = token1 && JSON.parse(token1.slice(STARTS_WITH.length));

  const [burnyBoyFilters, setBurnyBoyFilters] = useState({ owner_not: "0x0000000000000000000000000000000000000000" });
  const [transferToAddresses, setTransferToAddresses] = useState({});

  const [images, setImages] = useState([]);

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const NATA_GQL = gql`
    query ($filters: Nata_filter, $boyCount: Int!) {
      natas(first: $boyCount, orderBy: createdAt, orderDirection: desc, where: $filters) {
        id
        ipfsHash
        createdAt
        minter {
          id
        }
        owner
      }
    }
  `;
  const { loading, data, error } = useQuery(NATA_GQL, {
    pollInterval: 5000,
    variables: { boyCount: 1000, filters: burnyBoyFilters },
  });
  let networkDisplay = (
    <div style={{ zIndex: 0, position: "absolute", right: 15, top: 40, padding: 16, color: "white" }}>
      {targetNetwork.name}
    </div>
  );

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

  const header = (
    <>
      <Typography.Title style={{ marginBottom: 8, paddingTop: 100 }}>
        <Link
          onClick={() => {
            setRoute("/");
          }}
          to="/"
        >{`Proof de Nata`}</Link>
      </Typography.Title>
      <p>
        <a href={"https://azf.notion.site/Proof-de-nata-6cc8cd8afa504bb8a5fda5b5f1761973"} target="_blank">
          {"About"}
        </a>
        <span>{" / "}</span>
        <a
          href={readContracts && targetNetwork.blockExplorer + "address/" + readContracts.NataNFT.address}
          target="_blank"
        >
          {"Contract"}
        </a>
      </p>
    </>
  );

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      {networkDisplay}
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            {header}
            {address ? (
              <>
                <ImageUploading value={images} onChange={onChange} dataURLKey="data_url">
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    // write your building UI
                    <div>
                      {imageList.length == 0 && (
                        <Button
                          type="primary"
                          size="large"
                          style={isDragging ? { color: "red" } : undefined}
                          onClick={onImageUpload}
                          {...dragProps}
                        >
                          Upload Proof de Nata
                        </Button>
                      )}
                      {imageList.map((image, index) => (
                        <div key={index} className="image-item">
                          <img src={image["data_url"]} alt="" width="100" />
                          <div>
                            <Button onClick={() => onImageUpdate(index)}>Update</Button>
                            <Button onClick={() => onImageRemove(index)}>Remove</Button>
                          </div>
                        </div>
                      ))}
                      {images.length > 0 && (
                        <Button
                          style={{ margin: 8, fontSize: 24, height: 50 }}
                          type="primary"
                          size="large"
                          loading={minting}
                          disabled={!address}
                          onClick={async () => {
                            try {
                              setMinting(true);

                              const ipfsHash = await client.storeBlob(images[0]["file"]);

                              let hashToSign = ethers.utils.solidityKeccak256(
                                ["address", "string"],
                                [address, ipfsHash],
                              );
                              console.log(hashToSign);
                              let signature = await injectedProvider.send("personal_sign", [hashToSign, address]);
                              console.log(signature);
                              let gsnContract = writeContracts.NataNFT.connect(burnerGsnSigner);
                              const result = tx(
                                gsnContract.mintFromSignature(address, ipfsHash, signature, {
                                  gasLimit: "2000000",
                                }),
                              );
                              console.log("awaiting metamask/web3 confirm result...", result);
                              console.log(await result);
                              setMinting(false);
                              onImageRemove(0);
                            } catch (e) {
                              console.log(e);
                              setMinting(false);
                            }
                          }}
                        >
                          {`Mint`}
                        </Button>
                      )}
                    </div>
                  )}
                </ImageUploading>
              </>
            ) : (
              <Button
                key="loginbutton"
                type="primary"
                style={{ verticalAlign: "top", margin: 8, fontSize: 24, height: 50 }}
                shape="round"
                size="large"
                /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
                onClick={loadWeb3Modal}
              >
                connect to mint
              </Button>
            )}
            <Typography.Title level={2} style={{ marginTop: 14 }}>
              Recent Proof de nata
            </Typography.Title>
            <ul style={{ padding: 0, textAlign: "center", listStyle: "none" }}>
              {data &&
                data.natas.map((item, index) => {
                  const id = item.id;
                  if (index > 12) return;
                  return (
                    <Link to={`/token/${id}`} key={id}>
                      <LazyLoadImage
                        height={"180"}
                        src={`https://${item.ipfsHash}.ipfs.dweb.link/`} // use normal <img> attributes as props
                      />
                    </Link>
                  );
                })}
            </ul>
            {address && dao && address == dao && (
              <Contract
                name="NataNFT"
                signer={userSigner}
                provider={localProvider}
                address={address}
                blockExplorer={blockExplorer}
              />
            )}
            <p>
              <a href="https://github.com/austintgriffith/scaffold-eth/tree/proof-de-nata" target="_blank">
                <GithubOutlined />
              </a>
              <span>{" / "}</span>
              <a href="https://buidlguidl.com/" target="_blank">
                🏰 BuidlGuidl
              </a>
            </p>
          </Route>
          <Route path="/token/:id">
            {header}
            <ViewBurnyBoy
              readContracts={readContracts}
              blockExplorer={blockExplorer}
              mainnetProvider={mainnetProvider}
              targetNetwork={targetNetwork}
              totalSupply={totalSupply}
            />
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
