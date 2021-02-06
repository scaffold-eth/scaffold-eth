import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link, Redirect } from "react-router-dom";
import "antd/dist/antd.css";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { Row, Col, Button, Menu, Checkbox } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { formatEther } from "@ethersproject/units";
import {
  useExchangePrice,
  useGasPrice,
  useUserProvider,
  useContractLoader,
  useContractReader,
  useBalance,
} from "./hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge } from "./components";
import { Transactor } from "./helpers";
// import Hints from "./Hints";
import { Hints, Create, Manage } from "./views";

import { INFURA_ID } from "./constants";

// 😬 Sorry for all the console logging 🤡
const DEBUG = false;

// 🔭 block explorer URL
const blockExplorer = "https://etherscan.io/"; // for xdai: "https://blockscout.com/poa/xdai/"

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)
console.log("window.location.hostname", window.location.hostname);
// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = "http://" + window.location.hostname + ":8545"; // for xdai: https://dai.poa.network
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);

function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 this hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(mainnetProvider); // 1 for xdai

  /* 🔥 this hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice("fast"); // 1000000000 for xdai

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  // const faucetTx = Transactor(localProvider, gasPrice);
  // console.log(faucetTx);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  if (DEBUG) console.log("💵 yourLocalBalance", yourLocalBalance ? formatEther(yourLocalBalance) : "...");

  // just plug in different 🛰 providers to get your balance on different chains:
  // const yourMainnetBalance = useBalance(mainnetProvider, address);
  // if (DEBUG) console.log("💵 yourMainnetBalance", yourMainnetBalance ? formatEther(yourMainnetBalance) : "...");

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider);
  if (DEBUG) console.log("📝 readContracts", readContracts);

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider);
  if (DEBUG) console.log("🔐 writeContracts", writeContracts);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  // const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI)
  // console.log("🥇DAI contract on mainnet:",mainnetDAIContract)
  //
  // Then read your DAI balance like:
  // const myMainnetBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])
  //

  // keep track of a variable from the contract in the local React state:
  // const purpose = useContractReader(readContracts,"YourContract", "purpose")
  // console.log("🤗 purpose:",purpose)

  // 📟 Listen for broadcast events
  // const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);
  // console.log("📟 SetPurpose events:",setPurposeEvents)

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  // const ownerNoun = useContractReader(readContracts, "Noun", "_owner");
  const [modo, setModo] = useState(false);

  // const setCreate = useEventListener(readContracts, "Noun", "WillCreated", localProvider, 1);

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

  const [willIndex, setWillIndex] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const handleWillSelected = value => {
    setWillIndex(value + 1);
    setRoute("/create");
    setRedirect(true);
  };

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />

      <BrowserRouter>
        <Menu style={{ textAlign: "center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute("/");
              }}
              to="/"
            >
              Admin
            </Link>
          </Menu.Item>
          <Menu.Item key="/create">
            <Link
              onClick={() => {
                setRoute("/create");
              }}
              to="/create"
            >
              Create
            </Link>
          </Menu.Item>
          <Menu.Item key="/manage">
            <Link
              onClick={() => {
                setRoute("/manage");
                setRedirect(false);
                setWillIndex(null);
              }}
              to="/manage"
            >
              Manage
            </Link>
          </Menu.Item>
          <Menu.Item key="/hints">
            <Link
              onClick={() => {
                setRoute("/hints");
              }}
              to="/hints"
            >
              Hints
            </Link>
          </Menu.Item>
          {/*          <Menu.Item key="/dethlockui">
            <Link onClick={()=>{setRoute("/dethlockui")}} to="/dethlockui">DethlockUI</Link>
          </Menu.Item> */}
        </Menu>

        <Switch>
          <Route exact path="/">
            {/*{address === ownerNoun ||*/}
              {!modo ? (
              <div>
                Only owner of contract should see this (admin page)
                <br />
                <Contract
                  name="Noun"
                  signer={userProvider.getSigner()}
                  provider={localProvider}
                  address={address}
                  blockExplorer={blockExplorer}
                />
                <Contract
                  name="CurlyCoin"
                  signer={userProvider.getSigner()}
                  provider={localProvider}
                  address={address}
                  blockExplorer={blockExplorer}
                />
                <Contract
                  name="MoCoin"
                  signer={userProvider.getSigner()}
                  provider={localProvider}
                  address={address}
                  blockExplorer={blockExplorer}
                />
                <Contract
                  name="LarryCoin"
                  signer={userProvider.getSigner()}
                  provider={localProvider}
                  address={address}
                  blockExplorer={blockExplorer}
                />
              </div>
            ) : (
              <Redirect to="/manage" />
            )}
          </Route>
          <Route path="/hints">
            <Hints
              address={address}
              yourLocalBalance={yourLocalBalance}
              mainnetProvider={mainnetProvider}
              price={price}
            />
          </Route>
          <Route path="/create">
            <Create
              address={address}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              localProvider={localProvider}
              yourLocalBalance={yourLocalBalance}
              price={price}
              tx={tx}
              writeContracts={writeContracts}
              readContracts={readContracts}
              // setCreate= {setCreate}
              willIndex={willIndex}
            />
          </Route>
          <Route path="/manage">
            {redirect ? <Redirect to="/create" /> : ""}
            <Manage
              subgraphUri={props.subgraphUri}
              tx={tx}
              writeContracts={writeContracts}
              mainnetProvider={mainnetProvider}
              // setCreate={setCreate}
              address={address}
              readContracts={readContracts}
              willSelector={handleWillSelected}
              willIndex={willIndex}
            />
          </Route>
          {/*          <Route path="/dethlockui">
            <DethlockUI
              address={address}
              userProvider={userProvider}
              mainnetProvider={mainnetProvider}
              localProvider={localProvider}
              yourLocalBalance={yourLocalBalance}
              price={price}
              tx={tx}
              writeContracts={writeContracts}
              readContracts={readContracts}
              purpose={purpose}
              setPurposeEvents={setPurposeEvents}
            />
          </Route> */}
        </Switch>
      </BrowserRouter>

      <div style={{ position: "fixed", textAlign: "center", right: "50%", top: 0, padding: 10 }}>
        <Checkbox
          onChange={e => {
            setModo(e.target.checked);
          }}
        >
          App
        </Checkbox>
      </div>

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
      </div>
      {modo ? null : (
        <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
          <Row align="middle" gutter={[4, 4]}>
            <Col span={8}>
              <Ramp price={price} address={address} />
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
                localProvider &&
                localProvider.connection &&
                localProvider.connection.url &&
                localProvider.connection.url.indexOf(window.location.hostname) >= 0 &&
                !process.env.REACT_APP_PROVIDER &&
                price > 1 ? (
                  <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
                ) : (
                  ""
                )
              }
            </Col>
          </Row>
        </div>
      )}
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

export default App;
