import { Alert, Button, Card, Col, Input, List, Menu, Row, Tabs, Dropdown, Badge } from "antd";
import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
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
  Footer,
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { YourLoogies, YourFancyLoogies, YourAccesories, FancyLoogiePreview, FancyLoogies } from "./views";
import { useStaticJsonRPC } from "./hooks";
const { TabPane } = Tabs;

const { ethers } = require("ethers");
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/scaffold-eth/scaffold-eth

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
const NETWORKCHECK = true;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const location = useLocation();

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

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
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider);
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

  const [updateBalances, setUpdateBalances] = useState(0);

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
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const nfts = ["Bow", "Eyelash", "Mustache", "ContactLenses"];

  const nftsSvg = {
    Bow: (
      <g class="bow" transform="translate(0,0) scale(0.07 0.07)">
        <path fill="#1890ff" d="M476.532,135.396c-12.584-7.796-29-7.356-46.248,1.228l-117.868,59.88c-10.048-9.7-23.728-14.452-38.816-14.452h-50.156c-15.204,0-28.992,4.828-39.064,14.652L66.1,137.256c-17.232-8.58-33.836-9.336-46.412-1.544C7.1,143.508,0,158.1,0,177.368v141.104c0,19.268,7.1,34.18,19.68,41.96c5.972,3.708,12.904,5.556,20.28,5.556c8.164,0,17.04-2.256,26.092-6.764l118.312-58.14c10.072,9.824,23.88,16.588,39.08,16.588H273.6c15.084,0,28.78-6.692,38.82-16.396l117.884,58.276c9.068,4.512,17.9,6.596,26.064,6.596c7.388,0,14.192-1.928,20.164-5.636C489.108,352.72,496,337.744,496,318.476V177.368C496,158.1,489.108,143.192,476.532,135.396z"/>
      </g>
    ),
    Eyelash: (
      <g class="eyelash" transform="translate(-60,-45) scale(0.4 0.4)">
        <g id="eye1">
          <ellipse stroke-width="1" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="gray" fill="#fff"/>
        </g>
        <g id="eye2">
          <ellipse stroke-width="1" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="gray" fill="#fff"/>
        </g>
        <path d="M 164 130 Q 154 125 169 120" stroke-width="1" fill="transparent" stroke="#1890ff" />
        <path d="M 171 127 Q 161 122 176 117" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 179 125 Q 169 120 184 115" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 186 126 Q 176 121 191 116" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 194 127 Q 184 122 199 117" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 196 142 Q 186 137 201 132" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 203 140 Q 193 135 208 130" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 211 139 Q 201 134 216 129" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 218 141 Q 208 136 223 131" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 226 143 Q 216 138 231 133" stroke="#1890ff" stroke-width="1" fill="transparent"/>
      </g>
    ),
    Mustache: (
      <g class="mustache" transform="translate(0,0) scale(1.40 1.40)">,
        <path fill="#1890ff" d="M21.455,13.025c-0.604-3.065-5.861-4.881-7.083-2.583c-1.22-2.299-6.477-0.483-7.081,2.583C6.501,16.229,2.321,17.11,0,15.439c0,3.622,3.901,3.669,6.315,3.9c5.718-0.25,7.525-2.889,8.057-4.093c0.532,1.205,2.34,3.843,8.058,4.093c2.416-0.231,6.315-0.278,6.315-3.9C26.423,17.11,22.244,16.229,21.455,13.025z"/>
      </g>
    ),
    ContactLenses: (
      <g class="contact-lenses" transform="translate(-60,-47) scale(0.4 0.4)">
        <g id="eye1">
          <ellipse stroke-width="1" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="gray" fill="#fff"/>
          <ellipse ry="3.5" rx="2.5" id="svg_3" cy="154.5" cx="173.5" stroke-width="3" stroke="#1890ff" fill="#000000"/>
        </g>
        <g id="eye2">
          <ellipse stroke-width="1" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="gray" fill="#fff"/>
          <ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#000000" stroke="#1890ff"/>
        </g>
      </g>
    ),
  };

  const [fancyLoogieContracts, setFancyLoogieContracts] = useState([]);
  const [fancyLoogiesNfts, setFancyLoogiesNfts] = useState();
  const [selectedFancyLoogie, setSelectedFancyLoogie] = useState();
  const [selectedNfts, setSelectedNfts] = useState({});
  const [selectedFancyLoogiePreview, setSelectedFancyLoogiePreview] = useState({});

  const initCount = {
    Bow: 0,
    Eyelash: 0,
    Mustache: 0,
    ContactLenses: 0,
  };

  const [yourNftsCount, setYourNftsCount] = useState(initCount);

  useEffect(() => {
    const updateFancyLoogieContracts = async () => {
      if (readContracts.FancyLoogie) {
        if (DEBUG) console.log("Updating FancyLoogie contracts address...");
        const fancyLoogieContractsAddress = await readContracts.FancyLoogie.getContractsAddress();
        if (DEBUG) console.log("🤗 fancy loogie contracts:", fancyLoogieContractsAddress);
        setFancyLoogieContracts(fancyLoogieContractsAddress);
      }
    };
    updateFancyLoogieContracts();
  }, [address, readContracts.FancyLoogie]);

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      <NetworkDisplay
        NETWORKCHECK={NETWORKCHECK}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
      />
      <Menu style={{ textAlign: "center" }} selectedKeys={[location.pathname]} mode="horizontal">
        <Menu.Item key="/">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="/yourLoogies">
          <Link to="/yourLoogies">Your Optimistic Loogies</Link>
        </Menu.Item>
        <Menu.Item key="/yourFancyLoogies">
          <Link to="/yourFancyLoogies">Your Fancy Loogies</Link>
        </Menu.Item>
        <Menu.Item key="/yourAccesories">
          <Link to="/yourAccesories">Your Accesories</Link>
        </Menu.Item>
        <Menu.Item key="/howto">
          <Link to="/howto">How To Use Optimistic Network</Link>
        </Menu.Item>
      </Menu>

      <Switch>
        <Route exact path="/">
          <FancyLoogies
            readContracts={readContracts}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            DEBUG={DEBUG}
          />
        </Route>
        <Route exact path="/yourLoogies">
          <YourLoogies
            DEBUG={DEBUG}
            readContracts={readContracts}
            writeContracts={writeContracts}
            tx={tx}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            address={address}
            updateBalances={updateBalances}
            setUpdateBalances={setUpdateBalances}
          />
        </Route>
        <Route exact path="/yourFancyLoogies">
          <YourFancyLoogies
            DEBUG={DEBUG}
            readContracts={readContracts}
            writeContracts={writeContracts}
            tx={tx}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            address={address}
            updateBalances={updateBalances}
            setUpdateBalances={setUpdateBalances}
            fancyLoogieContracts={fancyLoogieContracts}
            fancyLoogiesNfts={fancyLoogiesNfts}
            setFancyLoogiesNfts={setFancyLoogiesNfts}
            selectedFancyLoogie={selectedFancyLoogie}
            setSelectedFancyLoogie={setSelectedFancyLoogie}
            selectedNfts={selectedNfts}
            setSelectedFancyLoogiePreview={setSelectedFancyLoogiePreview}
            nfts={nfts}
            setSelectedNfts={setSelectedNfts}
          />
        </Route>
        <Route exact path="/yourAccesories">
          <FancyLoogiePreview
            DEBUG={DEBUG}
            readContracts={readContracts}
            writeContracts={writeContracts}
            tx={tx}
            address={address}
            updateBalances={updateBalances}
            setUpdateBalances={setUpdateBalances}
            nfts={nfts}
            nftsSvg={nftsSvg}
            fancyLoogiesNfts={fancyLoogiesNfts}
            selectedFancyLoogie={selectedFancyLoogie}
            selectedFancyLoogiePreview={selectedFancyLoogiePreview}
            setSelectedFancyLoogiePreview={setSelectedFancyLoogiePreview}
            selectedNfts={selectedNfts}
            setSelectedNfts={setSelectedNfts}
            setFancyLoogiesNfts={setFancyLoogiesNfts}
          />
          <Tabs defaultActiveKey="/" tabPosition="left" id="tabs-accesories" tabBarExtraContent={
            <Alert
              message="Choose an accesory type and mint a new NFT."
              description={
                <p>
                  If:
                  <ul>
                    <li>You have a <strong>FancyLoogie selected to wear</strong> and</li>
                    <li>The loogie <strong>doesn't have this kind of accesory</strong>,</li>
                  </ul>
                  Then, you will be able to preview the accesory on your <strong>FancyLoogie</strong>.
                </p>
              }
              type="info"
            />
          }>
            {nfts.map(function (nft) {
              return (
                <TabPane
                  tab={
                    <div class="tab-item">
                      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" style={{ float: "left" }}>
                        {nftsSvg[nft]}
                      </svg>
                      <Badge count={yourNftsCount[nft]}>
                        <p style={{ float: "left", marginBottom: 0, fontSize: 24, fontWeight: "bold", marginLeft: 5 }}>{nft}</p>
                      </Badge>
                    </div>
                  }
                  key={nft}
                >
                  <YourAccesories
                    DEBUG={DEBUG}
                    readContracts={readContracts}
                    writeContracts={writeContracts}
                    tx={tx}
                    mainnetProvider={mainnetProvider}
                    blockExplorer={blockExplorer}
                    address={address}
                    updateBalances={updateBalances}
                    setUpdateBalances={setUpdateBalances}
                    nft={nft}
                    fancyLoogiesNfts={fancyLoogiesNfts}
                    selectedFancyLoogie={selectedFancyLoogie}
                    selectedNfts={selectedNfts}
                    setSelectedNfts={setSelectedNfts}
                  />
                </TabPane>
              );
            })}
          </Tabs>
        </Route>
        <Route exact path="/howto">
          <div style={{ fontSize: 18, width: 820, margin: "auto" }}>
            <h2 style={{ fontSize: "2em", fontWeight: "bold" }}>How to add Optimistic Ethereum network on MetaMask</h2>
            <div style={{ textAlign: "left", marginLeft: 50, marginBottom: 50 }}>
              <ul>
                <li>
                  Go to <a target="_blank" href="https://chainid.link/?network=optimism">https://chainid.link/?network=optimism</a>
                </li>
                <li>
                  Click on <strong>connect</strong> to add the <strong>Optimistic Ethereum</strong> network in <strong>MetaMask</strong>.
                </li>
              </ul>
            </div>
            <h2 style={{ fontSize: "2em", fontWeight: "bold" }}>How to add funds to your wallet on Optimistic Ethereum network</h2>
            <div style={{ textAlign: "left", marginLeft: 50, marginBottom: 100 }}>
              <ul>
                <li><a href="https://portr.xyz/" target="_blank">The Teleporter</a>: the cheaper option, but with a 0.05 ether limit per transfer.</li>
                <li><a href="https://gateway.optimism.io/" target="_blank">The Optimism Gateway</a>: larger transfers and cost more.</li>
                <li><a href="https://app.hop.exchange/send?token=ETH&sourceNetwork=ethereum&destNetwork=optimism" target="_blank">Hop.Exchange</a>: where you can send from/to Ethereum mainnet and other L2 networks.</li>
              </ul>
            </div>
          </div>
        </Route>
        <Route exact path="/debug">
          <div style={{ padding: 32 }}>
            <Address value={readContracts && readContracts.FancyLoogie && readContracts.FancyLoogie.address} />
          </div>
          <Contract
            name="FancyLoogie"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        </Route>
      </Switch>

      <Footer />

      <ThemeSwitch />

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
        <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
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
