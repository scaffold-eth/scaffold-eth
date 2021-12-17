import { Alert, Button, Col, Menu, Row, notification } from "antd";
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
import { Transactor, Web3ModalSetup } from "./helpers";
import { Home, ExampleUI, Hints, Subgraph } from "./views";
import { OldEnglish, Drinks } from "./views";
import { useStaticJsonRPC } from "./hooks";

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



// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;

const targetNetworkString = "optimism" // <------ change this as you deploy do other networks

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

function App(props) {
  const oldEnglishContract = "EightPack";
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks


  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(targetNetworkString);
  const location = useLocation();

  /// 📡 What chain are your contracts deployed to?
  const targetNetwork = NETWORKS[selectedNetwork]; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

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

  const priceToMint = useContractReader(readContracts, oldEnglishContract, "price");

  const totalSupply = useContractReader(readContracts, oldEnglishContract, "totalSupply");
  const limit = useContractReader(readContracts, oldEnglishContract, "limit");

  // keep track of a variable from the contract in the local React state:
  const balance = useContractReader(readContracts, oldEnglishContract, "balanceOf", [address]);

  const buzzBalance = useContractReader(readContracts, "Buzz", "balanceOf", [address]);
  //
  // 🧠 This effect will update OldEnglishs by polling when your balance changes
  //
  const yourBalance = balance && balance.toNumber && balance.toNumber();

  const [minting, setMinting] = useState(false);
  const [startBlock, setStartBlock] = useState();

  useEffect(() => {
    if (startBlock == undefined && localProvider) {
      const updateStartBlock = async () => {
        let latestBlock = await localProvider.getBlock();
        setStartBlock(latestBlock.number);
      };
      updateStartBlock();
    }
  }, [localProvider]);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

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
      />

      <div style={{ maxWidth: 820, margin: "auto", marginTop: 12, paddingBottom: 32 }}>
        <div style={{ fontSize: 16, marginTop: 32 }}>
          {/*}<h2>{`Get yourself an oe40 `}</h2>*/}
          <p>Take a sip. Wrap it up. Pour one out. </p>
        </div>

        {totalSupply>=limit?<div>
          <h2> All 40s have been minted! </h2>

        <h3> Fork <a href="https://github.com/scaffold-eth/scaffold-eth/tree/sipping-oe" target="_blank">the repo</a>, follow the readme, and deploy your own to optimism! </h3>
        </div>:<Button
          type="primary"
          size="large"
          loading={minting}
          onClick={async () => {
            setMinting(true);
            const priceRightNow = await readContracts[oldEnglishContract].price();
            try {
              const txCur = await tx(writeContracts[oldEnglishContract].mintItem({ value: priceRightNow }));
              await txCur.wait();
              setMinting(false);
              notification.open({
                message: "🍻 Minted an OE 🍻",
                description: "Sip, wrap, pour and recycle!",
              });
            } catch (e) {
              console.log("mint failed", e);
              setMinting(false);
            }
          }}
          disabled={limit && totalSupply && limit.lt(totalSupply)}
        >
          MINT for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}
        </Button>}


        <div style={{ fontSize: 16, marginTop: 32 }}>
          <p>Recycle an empty to get your Ξ0.001 back!!</p>
          <p>
            {" "}
            {"" + totalSupply} / {"" + limit} minted
          </p>
        </div>

        <h2 style={{ marginTop: 12 }}>{`Your $BUZZ: ${
          buzzBalance ? ethers.utils.formatEther(buzzBalance) : "..."
        }`}</h2>
      </div>

      <Menu style={{ textAlign: "center" }} selectedKeys={[location.pathname]} mode="horizontal">
        <Menu.Item key="/">
          <Link to="/">Gallery</Link>
        </Menu.Item>
        <Menu.Item key="/activity">
          <Link to="/activity">Activity</Link>
        </Menu.Item>
        <Menu.Item key="/debug">
          <Link to="/debug">Contracts</Link>
        </Menu.Item>
      </Menu>

      <Switch>
        <Route exact path="/">
          <div style={{ fontSize: 16, marginTop: 32 }}>
            <OldEnglish
              readContracts={readContracts}
              mainnetProvider={mainnetProvider}
              blockExplorer={blockExplorer}
              totalSupply={totalSupply}
              writeContracts={writeContracts}
              localProvider={localProvider}
              tx={tx}
              address={address}
              DEBUG={DEBUG}
              oldEnglishContract={oldEnglishContract}
              balance={balance}
              startBlock={startBlock}
            />
          </div>
        </Route>
        <Route exact path="/activity">
          <div style={{ fontSize: 16, marginTop: 32 }}>
            <Drinks
              readContracts={readContracts}
              mainnetProvider={mainnetProvider}
              blockExplorer={blockExplorer}
              totalSupply={totalSupply}
              writeContracts={writeContracts}
              localProvider={localProvider}
              tx={tx}
              address={address}
              DEBUG={DEBUG}
              oldEnglishContract={oldEnglishContract}
              startBlock={startBlock}
            />
          </div>
        </Route>
        <Route exact path="/debug">
          {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}

          <Contract
            name="Buzz"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />

          <Contract
            name={oldEnglishContract}
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        </Route>
      </Switch>

      <ThemeSwitch />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          {/*<div style={{ marginRight: 20 }}>
            <NetworkSwitch
              networkOptions={networkOptions}
              selectedNetwork={selectedNetwork}
              setSelectedNetwork={setSelectedNetwork}
            />
          </div>*/}
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
