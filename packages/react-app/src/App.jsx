import Portis from "@portis/web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Alert, Button, Col, List, Menu, Row, Input, Table, Image, InputNumber, Modal } from "antd";
import "antd/dist/antd.css";
import Authereum from "authereum";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import { useEventListener } from "eth-hooks/events/useEventListener";
import Fortmatic from "fortmatic";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
//import Torus from "@toruslabs/torus-embed"
import WalletLink from "walletlink";
import Web3Modal from "web3modal";
import "./App.css";
import { Address, Account, Balance, Contract, Faucet, GasGauge, Header, Ramp, ThemeSwitch } from "./components";
import { INFURA_ID, NETWORK, NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor } from "./helpers";
// import Hints from "./Hints";
import { ExampleUI, Hints, Subgraph } from "./views";

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const diceImages = importAll(require.context("./images/", false, /\.(png)$/));

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
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544")
  : null;
const poktMainnetProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider(
      "https://eth-mainnet.gateway.pokt.network/v1/lb/61853c567335c80036054a2b",
    )
  : null;
const mainnetInfura = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`)
  : null;
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID
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
const walletLinkProvider = walletLink.makeWeb3Provider(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`, 1);

// Portis ID: 6255fb2b-58c8-433b-a2c9-62098c05ddc9
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
          1: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
          42: `https://kovan.infura.io/v3/${INFURA_ID}`,
          100: "https://dai.poa.network", // xDai
        },
      },
    },
    portis: {
      display: {
        logo: "https://user-images.githubusercontent.com/9419140/128913641-d025bc0c-e059-42de-a57b-422f196867ce.png",
        name: "Portis",
        description: "Connect to Portis App",
      },
      package: Portis,
      options: {
        id: "6255fb2b-58c8-433b-a2c9-62098c05ddc9",
      },
    },
    fortmatic: {
      package: Fortmatic, // required
      options: {
        key: "pk_live_5A7C91B2FC585A17", // required
      },
    },
    // torus: {
    //   package: Torus,
    //   options: {
    //     networkParams: {
    //       host: "https://localhost:8545", // optional
    //       chainId: 1337, // optional
    //       networkId: 1337 // optional
    //     },
    //     config: {
    //       buildEnv: "development" // optional
    //     },
    //   },
    // },
    "custom-walletlink": {
      display: {
        logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
        name: "Coinbase",
        description: "Connect to Coinbase Wallet (not Coinbase App)",
      },
      package: walletLinkProvider,
      connector: async (provider, _options) => {
        await provider.enable();
        return provider;
      },
    },
    authereum: {
      package: Authereum, // required
    },
  },
});

function App(props) {
  const mainnetProvider =
    poktMainnetProvider && poktMainnetProvider._isProvider
      ? poktMainnetProvider
      : scaffoldEthProvider && scaffoldEthProvider._network
      ? scaffoldEthProvider
      : mainnetInfura;

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

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

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
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      //console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("📝 readContracts", readContracts);
      //console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
  ]);

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

                    let switchTx;
                    // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
                    try {
                      switchTx = await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: data[0].chainId }],
                      });
                    } catch (switchError) {
                      // not checking specific error code, because maybe we're not using MetaMask
                      try {
                        switchTx = await ethereum.request({
                          method: "wallet_addEthereumChain",
                          params: data,
                        });
                      } catch (addError) {
                        // handle "add" error
                      }
                    }

                    if (switchTx) {
                      console.log(switchTx);
                    }
                  }}
                >
                  <b>{networkLocal && networkLocal.name}</b>
                </Button>
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
      <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
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

  let faucetHint = "";
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const [faucetClicked, setFaucetClicked] = useState(false);
  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId === 31337 &&
    yourLocalBalance &&
    ethers.utils.formatEther(yourLocalBalance) <= 0
  ) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            faucetTx({
              to: address,
              value: ethers.utils.parseEther(".05"),
            });
            setFaucetClicked(true);
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    );
  }

  const winnerEvents = useEventListener(readContracts, "DiceGame", "Winner", localProvider, 12458549);
  const tipEvents = useEventListener(readContracts, "DiceGame", "Tip", localProvider, 12458549);
  const rollEvents = useEventListener(readContracts, "DiceGame", "Roll", localProvider, 12458549);
  const difficultyEvents = useEventListener(readContracts, "DiceGame", "Difficulty", localProvider, 12458549);
  const betEvents = useEventListener(readContracts, "DiceGame", "Bet", localProvider, 12458549);
  const prize = useContractReader(readContracts, "DiceGame", "prize");
  const canBet = useContractReader(readContracts, "DiceGame", "canBet");
  const canRoll = useContractReader(readContracts, "DiceGame", "canRoll");

  const [diceRolled, setDiceRolled] = useState(false);
  const [diceRollNumber, setDiceRollNumber] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [number, setNumber] = useState();
  const [gameNumber, setGameNumber] = useState(0);

  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);

  const showHelpModal = () => {
    setIsHelpModalVisible(true);
  };

  const handleHelpModalCancel = () => {
    setIsHelpModalVisible(false);
  };

  useOnBlock(localProvider, () => {
    if (DEBUG) console.log(`⛓ A new localProvider block is here: ${localProvider._lastBlockNumber}`);
    const currentBlockNumber = localProvider._lastBlockNumber;
    let game;
    if (Math.floor(currentBlockNumber / 10) % 2 === 0) {
      game = Math.floor(currentBlockNumber / 10) * 10;
    } else {
      game = Math.floor(currentBlockNumber / 10) * 10 - 10;
    }
    if (DEBUG) console.log("currentBlockNumber: ", currentBlockNumber, " - gameNumber: ", game);
    setGameNumber(game);
  });

  const bet = async () => {
    tx(writeContracts.DiceGame.bet(number, { value: ethers.utils.parseEther("0.002"), gasLimit: 500000 }));
  };

  const rollTheDice = async () => {
    setDiceRolled(true);
    setDiceRollNumber("...");

    tx(writeContracts.DiceGame.rollTheDice({ gasLimit: 500000 }), update => {
      if (update?.status === "failed" || !update.status) {
        setDiceRolled(false);
        setDiceRollNumber("");
      }
    });
  };

  const handleChangeNumber = value => {
    if (DEBUG) console.log("Bet: ", value);
    setNumber(value);
  };

  const filter = readContracts.DiceGame?.filters.Roll(address, null);

  readContracts.DiceGame?.on(filter, (_a, blockNumberRolled, numberRolled) => {
    if (DEBUG) console.log("blockNumberRolled: ", blockNumberRolled.toNumber());
    if (blockNumberRolled.toNumber() == gameNumber || blockNumberRolled.toNumber() == gameNumber - 20) {
      if (DEBUG) console.log("numberRolled: ", numberRolled);
      setDiceRollNumber(numberRolled);
      setDiceRolled(false);
    }
  });

  const date = new Date();

  const betColumns = [
    {
      title: "Game #",
      dataIndex: "game",
      render: (text, record, index) => {
        return record.args.blockNumber.toNumber();
      },
    },
    {
      title: "Player",
      dataIndex: "player",
      render: (text, record, index) => {
        return <Address noCopy={true} value={record.args.player} ensProvider={mainnetProvider} fontSize={16} />;
      },
    },
    {
      title: "Bet",
      dataIndex: "bet",
      render: (text, record, index) => {
        return record.args.number;
      },
    },
  ];

  const winnerColumns = [
    {
      title: "Game #",
      dataIndex: "game",
      render: (text, record, index) => {
        return record.args.blockNumber.toNumber();
      },
    },
    {
      title: "Winner",
      dataIndex: "winner",
      render: (text, record, index) => {
        return <Address noCopy={true} value={record.args[0]} ensProvider={mainnetProvider} fontSize={16} />;
      },
    },
    {
      title: "Prize",
      dataIndex: "prize",
      render: (text, record, index) => {
        return "Ξ" + Math.round(ethers.utils.formatEther(record.args.amount.toString()) * 1e4) / 1e4;
      },
    },
  ];

  const rollColumns = [
    {
      title: "Game #",
      dataIndex: "game",
      render: (text, record, index) => {
        return record.args.blockNumber.toNumber();
      },
    },
    {
      title: "Roller",
      dataIndex: "roller",
      render: (text, record, index) => {
        return <Address noCopy={true} value={record.args.player} ensProvider={mainnetProvider} fontSize={16} />;
      },
    },
    {
      title: "Dice",
      dataIndex: "dice",
      render: (text, record, index) => {
        return record.args.roll;
      },
    },
  ];

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <div id="content">
              <div id="bet-events">
                <h2>Bets</h2>
                <Table dataSource={betEvents} columns={betColumns} pagination={{ pageSize: 15 }} />
              </div>
              <div id="centerWrapper" style={{ width: 480 }}>
                <div id="prize">
                  <Balance balance={prize} dollarMultiplier={price} fontSize={32} />
                </div>
                <div id="bet-box">
                  <div id="bet-input">
                    <InputNumber
                      value={number}
                      min="0"
                      max="15"
                      step="1"
                      placeholder="Your bet"
                      onChange={handleChangeNumber}
                    />
                  </div>
                  <Button id="bet-button" disabled={!canBet || diceRolled} onClick={bet} title="Bet Ξ0.002">
                    Bet
                  </Button>
                  <Button id="help-button" onClick={showHelpModal}>
                    ?
                  </Button>
                </div>
                <div id="number-box">
                  <div id="roll-number">{diceRollNumber}</div>
                  <Button
                    className={"roll-button" + (diceRolled ? " active" : "")}
                    disabled={!canRoll || diceRolled}
                    onClick={rollTheDice}
                  >
                    Roll
                  </Button>
                </div>
                <div id="status-box">
                  {canBet && <Image src="/images/state_bidding.gif" alt="Bidding" />}
                  {canRoll && <Image src="/images/state_rolling.gif" alt="Rolling" />}
                  {!canBet && !canRoll && <Image src="/images/state_cooldown.gif" alt="Cooldown" />}
                </div>
              </div>
              <div id="winner-roll-events-box">
                <div id="winner-events">
                  <h2>Winners</h2>
                  <Table dataSource={winnerEvents} columns={winnerColumns} pagination={{ pageSize: 5 }} />
                </div>
                <div id="roll-events">
                  <h2>Rolls</h2>
                  <Table dataSource={rollEvents} columns={rollColumns} pagination={{ pageSize: 5 }} />
                </div>
              </div>
            </div>
          </Route>
          <Route exact path="/debug">
            <Contract
              name="DiceGame"
              price={price}
              signer={userSigner}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
              contractConfig={contractConfig}
            />
          </Route>
        </Switch>
      </BrowserRouter>

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div id="connect-box" style={{ position: "fixed", textAlign: "right", right: 0, top: 10, padding: 10 }}>
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
        {faucetHint}
      </div>

      {localProvider && localProvider._network && localProvider._network.chainId === 31337 && (
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
      )}

      <Modal title="GAME RULES" visible={isHelpModalVisible} onCancel={handleHelpModalCancel} footer={null}>
        <ul>
          <li>You can bet on any number between <strong>0 and 15</strong>.</li>
          <li>Each bet costs <strong>Ξ0.002</strong>.</li>
          <li>90% of the bet value goes to the <strong>Prize</strong>.</li>
          <li>You can bet <strong>many times</strong> in a round.</li>
          <li>You can only bet during the <strong>Betting</strong> stage.</li>
          <li>After the Betting stage there is a <strong>Cooldown</strong> stage: no bets here.</li>
          <li>Anyone can roll the dice and only on the <strong>Rolling</strong> stage.</li>
          <li>The user that rolls the dice gets a <strong>10% Prize reward</strong>.</li>
          <li>If you guest the number rolled you get the <strong>Prize!</strong></li>
          <li>If more than one winner, the Prize is <strong>splitted to all the winners</strong>.</li>
          <li>If no one wins, the Prize is <strong>kept to the next round</strong>.</li>
        </ul>
      </Modal>

    </div>
  );
}

export default App;
