import { Button, Col, Row } from "antd";

import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  // useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import {
  Account,
  Address,
  Contract,
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
import { getRPCPollTime, Transactor, Web3ModalSetup } from "./helpers";
import { YourLoogies, Home } from "./views";
import { useStaticJsonRPC } from "./hooks";
import NavBar from "./components/Navbar";
import ScaffoldIcon from "./components/Icons/ScaffoldIcon";
import ForkIcon from "./components/Icons/ForkIcon";
import axios from "axios";

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
const initialNetwork = NETWORKS.optimism; // <------- select your target frontend network (localhost, goerli, xdai, mainnet)

const serverUrl = "https://indexer.buidlguidl.com:32889";
// const serverUrl = "http://localhost:32889";

// 😬 Sorry for all the console logging
const DEBUG = true;
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
  const networkOptions = [initialNetwork.name, "mainnet", "goerli"];

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

  const mainnetProvider = useStaticJsonRPC(providers, localProvider);

  // Sensible pollTimes depending on the provider you are using
  const localProviderPollingTime = getRPCPollTime(localProvider);
  const mainnetProviderPollingTime = getRPCPollTime(mainnetProvider);

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
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider, mainnetProviderPollingTime);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast", localProviderPollingTime);
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
  const yourLocalBalance = useBalance(localProvider, address, localProviderPollingTime);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address, mainnetProviderPollingTime);

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
  // useOnBlock(mainnetProvider, () => {
  //   console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  // });

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(
    mainnetContracts,
    "DAI",
    "balanceOf",
    ["0x34aA3F359A9D614239015126635CE7732c18fDF3"],
    mainnetProviderPollingTime,
  );

  const priceToMint = useContractReader(readContracts, "YourCollectible", "price", [], localProviderPollingTime);
  if (DEBUG) console.log("🤗 priceToMint:", priceToMint);

  const totalSupply = useContractReader(readContracts, "YourCollectible", "totalSupply", [], localProviderPollingTime);
  if (DEBUG) console.log("🤗 totalSupply:", totalSupply);
  const loogiesLeft = 3728 - totalSupply;

  // keep track of a variable from the contract in the local React state:
  // const balance = useContractReader(readContracts, "YourCollectible", "balanceOf", [address], localProviderPollingTime);
  // if (DEBUG) console.log("🤗 address: ", address, " balance:", balance);

  const [balance, setBalance] = useState();

  useEffect(() => {
    const updateBalance = async () => {
      if (address) {
        axios
          .get(`${serverUrl}/loogies/${address}/balance`)
          .then(function (response) {
            if (DEBUG) console.log("balanceFromServer: ", response);
            setBalance(response.data);
          })
          .catch(async function (error) {
            console.log("Error getting balance from indexer: ", error.message);
            if (readContracts.YourCollectible) {
              const balanceFromContract = await readContracts.YourCollectible.balanceOf(address);
              if (DEBUG) console.log("balanceFromContract: ", balanceFromContract.toNumber());
              setBalance(balanceFromContract.toNumber());
            }
          });
      }
    };
    updateBalance();
  }, [address, readContracts.YourCollectible]);

  //
  // 🧠 This effect will update yourCollectibles by polling when your balance changes
  //
  const [yourCollectibles, setYourCollectibles] = useState();
  const [isYourCollectibleLoading, setIsYourCollectibleLoading] = useState(false);
  const [transferToAddresses, setTransferToAddresses] = useState({});

  useEffect(() => {
    const updateYourCollectibles = async () => {
      setIsYourCollectibleLoading(true);
      if (address) {
        axios
          .get(`${serverUrl}/loogies/${address}`)
          .then(function (response) {
            if (DEBUG) console.log("loogiesData: ", response);
            const collectibleUpdate = response.data;
            setYourCollectibles(collectibleUpdate);
            setIsYourCollectibleLoading(false);
          })
          .catch(async function (error) {
            console.log("Error getting your loogies from indexer: ", error.message);
            if (readContracts.YourCollectible) {
              const collectibleUpdate = [];
              for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
                try {
                  if (DEBUG) console.log("Getting token index", tokenIndex);
                  const tokenId = await readContracts.YourCollectible.tokenOfOwnerByIndex(address, tokenIndex);
                  if (DEBUG) console.log("Getting Loogie tokenId: ", tokenId);
                  const tokenURI = await readContracts.YourCollectible.tokenURI(tokenId);
                  if (DEBUG) console.log("tokenURI: ", tokenURI);
                  const jsonManifestString = atob(tokenURI.substring(29));

                  try {
                    const jsonManifest = JSON.parse(jsonManifestString);
                    collectibleUpdate.push({ id: tokenId, owner: address, ...jsonManifest });
                  } catch (e) {
                    console.log(e);
                  }
                } catch (e) {
                  console.log(e);
                }
              }
              setYourCollectibles(collectibleUpdate.reverse());
              setIsYourCollectibleLoading(false);
            }
          });
      }
    };
    updateYourCollectibles();
  }, [address, balance, readContracts.YourCollectible]);
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
      console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
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
    myMainnetDAIBalance,
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
      {/* TODO remove after design update */}
      {/* {yourLocalBalance.lte(ethers.BigNumber.from("0")) && (
        <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
      )} */}
      <NetworkDisplay
        NETWORKCHECK={NETWORKCHECK}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
      />
      <NavBar
        useBurner={USE_BURNER_WALLET}
        address={address}
        localProvider={localProvider}
        userSigner={userSigner}
        mainnetProvider={mainnetProvider}
        price={price}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
      />
      <Switch>
        <Route exact path="/">
          <Home
            readContracts={readContracts}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            totalSupply={totalSupply}
            priceToMint={priceToMint}
            DEBUG={DEBUG}
            tx={tx}
            writeContracts={writeContracts}
            loogiesLeft={loogiesLeft}
            serverUrl={serverUrl}
            address={address}
            setBalance={setBalance}
          />
        </Route>
        <div className="App__page-content-wrapper">
          <Route exact path="/yourLoogies">
            <YourLoogies
              readContracts={readContracts}
              writeContracts={writeContracts}
              priceToMint={priceToMint}
              yourCollectibles={yourCollectibles}
              tx={tx}
              mainnetProvider={mainnetProvider}
              blockExplorer={blockExplorer}
              transferToAddresses={transferToAddresses}
              setTransferToAddresses={setTransferToAddresses}
              address={address}
              loading={isYourCollectibleLoading}
            />
          </Route>
          <Route exact path="/guide">
            <div style={{ fontSize: 18, maxWidth: 820, margin: "auto", paddingRight: 20, paddingLeft: 20 }}>
              <h2 style={{ fontSize: "2em", fontWeight: "bold" }}>
                How to add Optimistic Ethereum network on MetaMask
              </h2>
              <div style={{ textAlign: "left", marginLeft: 50, marginBottom: 50 }}>
                <ul>
                  <li>
                    Go to{" "}
                    <a target="_blank" href="https://chainid.link/?network=optimism" rel="noreferrer">
                      https://chainid.link/?network=optimism
                    </a>
                  </li>
                  <li>
                    Click on <strong>connect</strong> to add the <strong>Optimistic Ethereum</strong> network in{" "}
                    <strong>MetaMask</strong>.
                  </li>
                </ul>
              </div>
              <h2 style={{ fontSize: "2em", fontWeight: "bold" }}>
                How to add funds to your wallet on Optimistic Ethereum network
              </h2>
              <div style={{ textAlign: "left", paddingLeft: 50, paddingBottom: 100 }}>
                <ul>
                  <li>
                    <a href="https://portr.xyz/" target="_blank" rel="noreferrer">
                      The Teleporter
                    </a>
                    : the cheaper option, but with a 0.05 ether limit per transfer.
                  </li>
                  <li>
                    <a href="https://gateway.optimism.io/" target="_blank" rel="noreferrer">
                      The Optimism Gateway
                    </a>
                    : larger transfers and cost more.
                  </li>
                  <li>
                    <a
                      href="https://app.hop.exchange/send?token=ETH&sourceNetwork=ethereum&destNetwork=optimism"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Hop.Exchange
                    </a>
                    : where you can send from/to Ethereum mainnet and other L2 networks.
                  </li>
                </ul>
              </div>
            </div>
          </Route>
          <Route exact path="/contracts">
            <div style={{ padding: 32 }}>
              <Address
                value={readContracts && readContracts.YourCollectible && readContracts.YourCollectible.address}
              />
            </div>
            <Contract
              name="YourCollectible"
              price={price}
              signer={userSigner}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
              contractConfig={contractConfig}
            />
          </Route>
        </div>
      </Switch>

      <div className="App__footer-wrapper">
        <div className="App__footer">
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 500 }}>
            Built with <ScaffoldIcon />
            <a
              href="https://github.com/scaffold-eth/scaffold-eth"
              target="_blank"
              rel="noreferrer"
              style={{ fontWeight: 600 }}
            >
              scaffold-eth
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 500 }}>
            <ForkIcon />
            <a
              href="https://github.com/scaffold-eth/scaffold-eth"
              target="_blank"
              rel="noreferrer"
              style={{ fontWeight: 600 }}
            >
              Fork this repo
            </a>{" "}
            and build a cool SVG NFT!
          </div>
        </div>
      </div>

      <ThemeSwitch />

      {/* TODO remove after design update */}
      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ display: "none", position: "fixed", textAlign: "left", left: 0, bottom: 100, padding: 10 }}>
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
