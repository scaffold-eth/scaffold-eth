import { CaretUpOutlined, ScanOutlined, SendOutlined, ReloadOutlined } from "@ant-design/icons";
import { JsonRpcProvider, StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { formatEther, parseEther } from "@ethersproject/units";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Alert, Button, Col, Row, Select, Input, Modal, notification } from "antd";
import "antd/dist/antd.css";
import { useUserAddress } from "eth-hooks";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import Web3Modal from "web3modal";
import "./App.css";
import {
  Account,
  Address,
  AddressInput,
  Balance,
  EtherInput,
  Faucet,
  GasGauge,
  Header,
  QRPunkBlockie,
  Ramp,
  SpeedUpTransactions,
  Wallet,
} from "./components";
import { INFURA_ID, NETWORK, NETWORKS } from "./constants";
import { Transactor } from "./helpers";
import { useBalance, useExchangePrice, useGasPrice, useLocalStorage, usePoller, useUserProvider } from "./hooks";

import WalletConnect from "@walletconnect/client";

import { TransactionManager } from "./helpers/TransactionManager";

const { confirm } = Modal;

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
const cachedNetwork = window.localStorage.getItem("network");
let targetNetwork = NETWORKS[cachedNetwork || "ethereum"]; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)
if (!targetNetwork) {
  targetNetwork = NETWORKS.xdai;
}
// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = new StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544");
//const mainnetInfura = new StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
let localProvider = new StaticJsonRpcProvider(localProviderUrlFromEnv);


// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

let scanner;

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
        rpc: {
          10: "https://mainnet.optimism.io", // xDai
          100: "https://rpc.gnosischain.com", // xDai
          137: "https://polygon-rpc.com",
          31337: "http://localhost:8545",
          42161: "https://arb1.arbitrum.io/rpc",
          80001: "https://rpc-mumbai.maticvigil.com"
        },
      },
    },
  },
});


function App(props) {

  //const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
  //const [walletModalData, setWalletModalData] = useState();

  //
  // TRYING SOMETHING HERE...
  // the "noNetwork" error is really annoying because the network selection gets locked up
  //   if you select a bad network, let's have it revert back to ethereum
  //
  /*useEffect(()=>{
    const waitForNetwork = async ()=>{
      localProvider._networkPromise.catch((e)=>{
        if(e.event=="noNetwork"){
          window.localStorage.setItem("network", "ethereum");
          setTimeout(() => {
            window.location.reload();
          }, 1);
        }
      })
    }
    waitForNetwork()
  },[ localProvider ])*/

  const [checkingBalances, setCheckingBalances] = useState();
  // a function to check your balance on every network and switch networks if found...
  const checkBalances = async address => {
    if(!checkingBalances){
      setCheckingBalances(true)
      setTimeout(()=>{
        setCheckingBalances(false)
      },5000)
      //getting current balance
      const currentBalance = await localProvider.getBalance(address);
      if(currentBalance && ethers.utils.formatEther(currentBalance)=="0.0"){
        console.log("No balance found... searching...")
        for (const n in NETWORKS) {
          try{
            const tempProvider = new JsonRpcProvider(NETWORKS[n].rpcUrl);
            const tempBalance = await tempProvider.getBalance(address);
            const result = tempBalance && formatEther(tempBalance);
            if (result != 0) {
              console.log("Found a balance in ", n);
              window.localStorage.setItem("network", n);
              setTimeout(() => {
                window.location.reload(true);
              }, 500);
            }
          }catch(e){console.log(e)}
        }
      }else{
        window.location.reload(true);
      }
    }


  };

  const mainnetProvider = scaffoldEthProvider //scaffoldEthProvider && scaffoldEthProvider._network ?  : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if(injectedProvider && injectedProvider.provider && injectedProvider.provider.disconnect){
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };
/*
  // track an extra eth price to display USD for Optimism?
  const ethprice = useExchangePrice({
    name: "ethereum",
    color: "#ceb0fa",
    chainId: 1,
    price: "uniswap",
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
  }, mainnetProvider);
  console.log("ethprice",ethprice)*/

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork, mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId = userProvider && userProvider._network && userProvider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice, undefined, injectedProvider);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  const balance = yourLocalBalance && formatEther(yourLocalBalance);

  // if you don't have any money, scan the other networks for money
  // lol this poller is a bad idea why does it keep
  /*usePoller(() => {
    if (!cachedNetwork) {
      if (balance == 0) {
        checkBalances(address);
      }
    }
  }, 7777);*/

  const connectWallet = (sessionDetails)=>{
    console.log(" 📡 Connecting to Wallet Connect....",sessionDetails)

    let connector;
    try {
      connector = new WalletConnect(sessionDetails);
    }
    catch(error) {
      console.error("Coudn't connect to", sessionDetails, error);
      localStorage.removeItem("walletConnectUrl");
      return;
    }

    setWallectConnectConnector(connector)

    // Subscribe to session requests
    connector.on("session_request", (error, payload) => {
      if (error) {
        throw error;
      }

      console.log("SESSION REQUEST")
      // Handle Session Request

      connector.approveSession({
        accounts: [                 // required
          address
        ],
        chainId: targetNetwork.chainId               // required
      })

      setConnected(true)
      setWallectConnectConnectorSession(connector.session)

      /* payload:
      {
        id: 1,
        jsonrpc: '2.0'.
        method: 'session_request',
        params: [{
          peerId: '15d8b6a3-15bd-493e-9358-111e3a4e6ee4',
          peerMeta: {
            name: "WalletConnect Example",
            description: "Try out WalletConnect v1.0",
            icons: ["https://example.walletconnect.org/favicon.ico"],
            url: "https://example.walletconnect.org"
          }
        }]
      }
      */
    });

    // Subscribe to call requests
    connector.on("call_request", async (error, payload) => {
      if (error) {
        throw error;
      }

      console.log("REQUEST PERMISSION TO:",payload,payload.params[0])
      // Handle Call Request
      //console.log("SETTING TO",payload.params[0].to)

      //setWalletConnectTx(true)

      //setToAddress(payload.params[0].to)
      //setData(payload.params[0].data?payload.params[0].data:"0x0000")

      //let bigNumber = ethers.BigNumber.from(payload.params[0].value)
      //console.log("bigNumber",bigNumber)

      //let newAmount = ethers.utils.formatEther(bigNumber)
      //console.log("newAmount",newAmount)
      //if(props.price){
      //  newAmount = newAmount.div(props.price)
      //}
      //setAmount(newAmount)

      /* payload:
      {
        id: 1,
        jsonrpc: '2.0'.
        method: 'eth_sign',
        params: [
          "0xbc28ea04101f03ea7a94c1379bc3ab32e65e62d3",
          "My email is john@doe.com - 1537836206101"
        ]
      }
      */

      //setWalletModalData({payload:payload,connector: connector})

      confirm({
          width: "90%",
          size: "large",
          title: 'Send Transaction?',
          icon: <SendOutlined/>,
          content: <pre>{payload && JSON.stringify(payload.params, null, 2)}</pre>,
          onOk:async ()=>{
            let result;

            if (payload.method === 'eth_sendTransaction') {
              try {
                let signer = userProvider.getSigner();

                // I'm not sure if all the Dapps send an array or not
                let params = payload.params;
                if (Array.isArray(params)) {
                  params = params[0];
                }

                // Ethers uses gasLimit instead of gas
                let gasLimit = params.gas;
                params.gasLimit = gasLimit;
                delete params.gas;

                // Speed up transaction list is filtered by chainId
                params.chainId = targetNetwork.chainId    

                result = await signer.sendTransaction(params);

                const transactionManager = new TransactionManager(userProvider, signer, true);
                transactionManager.setTransactionResponse(result);
              }
              catch (error) {
                // Fallback to original code without the speed up option
                console.error("Coudn't create transaction which can be speed up", error);
                result = await userProvider.send(payload.method, payload.params)
              }
            }
            else {
              result = await userProvider.send(payload.method, payload.params)
            }

            //console.log("MSG:",ethers.utils.toUtf8Bytes(msg).toString())

            //console.log("payload.params[0]:",payload.params[1])
            //console.log("address:",address)

            //let userSigner = userProvider.getSigner()
            //let result = await userSigner.signMessage(msg)
            console.log("RESULT:",result)


            connector.approveRequest({
              id: payload.id,
              result: result.hash ? result.hash : result
            });

            notification.info({
              message: "Wallet Connect Transaction Sent",
              description: result.hash ? result.hash : result,
              placement: "bottomRight",
            });
          },
          onCancel: ()=>{
            console.log('Cancel');
          },
        });
      //setIsWalletModalVisible(true)
      //if(payload.method == "personal_sign"){
      //  console.log("SIGNING A MESSAGE!!!")
        //const msg = payload.params[0]
      //}
    });

    connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }
      console.log("disconnect")

      setTimeout(() => {
        window.location.reload();
      }, 1);

      // Delete connector
    });
  }

  const [ walletConnectUrl, setWalletConnectUrl ] = useLocalStorage("walletConnectUrl")
  const [ connected, setConnected ] = useState()

  const [ wallectConnectConnector, setWallectConnectConnector ] = useState()
  //store the connector session in local storage so sessions persist through page loads ( thanks Pedro <3 )
  const [ wallectConnectConnectorSession, setWallectConnectConnectorSession ] = useLocalStorage("wallectConnectConnectorSession")

  useEffect(()=>{
    if(!connected){
      let nextSession = localStorage.getItem("wallectConnectNextSession")
      if(nextSession){
        localStorage.removeItem("wallectConnectNextSession")
        console.log("FOUND A NEXT SESSION IN CACHE")
        setWalletConnectUrl(nextSession)
      }else if(wallectConnectConnectorSession){
        console.log("NOT CONNECTED AND wallectConnectConnectorSession",wallectConnectConnectorSession)
        connectWallet( wallectConnectConnectorSession )
        setConnected(true)
      }else if(walletConnectUrl/*&&!walletConnectUrlSaved*/){
        //CLEAR LOCAL STORAGE?!?
        console.log("clear local storage and connect...")
        localStorage.removeItem("walletconnect") // lololol
        connectWallet(      {
                // Required
                uri: walletConnectUrl,
                // Required
                clientMeta: {
                  description: "Forkable web wallet for small/quick transactions.",
                  url: "https://punkwallet.io",
                  icons: ["https://punkwallet.io/punk.png"],
                  name: "🧑‍🎤 PunkWallet.io",
                },
              }/*,
              {
                // Optional
                url: "<YOUR_PUSH_SERVER_URL>",
                type: "fcm",
                token: token,
                peerMeta: true,
                language: language,
              }*/)
      }
    }
  },[ walletConnectUrl ])

  useMemo(() => {
    if (window.location.pathname) {
      if (window.location.pathname.indexOf("/wc") >= 0) {
        console.log("WALLET CONNECT!!!!!",window.location.search)
        let uri = window.location.search.replace("?uri=","")
        console.log("WC URI:",uri)
        setWalletConnectUrl(uri)
      }
    }
  }, [injectedProvider, localProvider]);


  /*
  setTimeout(()=>{
    if(!cachedNetwork){
      if(balance==0){
        checkBalances(address)
      }
    }
  },1777)
  setTimeout(()=>{
    if(!cachedNetwork){
      if(balance==0){
        checkBalances(address)
      }
    }
  },3777)
*/

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  /*
  useEffect(()=>{
    if(DEBUG && mainnetProvider && address && selectedChainId && yourLocalBalance && yourMainnetBalance && readContracts && writeContracts && mainnetDAIContract){
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________")
      console.log("🌎 mainnetProvider",mainnetProvider)
      console.log("🏠 localChainId",localChainId)
      console.log("👩‍💼 selected address:",address)
      console.log("🕵🏻‍♂️ selectedChainId:",selectedChainId)
      console.log("💵 yourLocalBalance",yourLocalBalance?formatEther(yourLocalBalance):"...")
      console.log("💵 yourMainnetBalance",yourMainnetBalance?formatEther(yourMainnetBalance):"...")
      console.log("📝 readContracts",readContracts)
      console.log("🌍 DAI contract on mainnet:",mainnetDAIContract)
      console.log("🔐 writeContracts",writeContracts)
    }
  }, [mainnetProvider, address, selectedChainId, yourLocalBalance, yourMainnetBalance, readContracts, writeContracts, mainnetDAIContract])
  */

  let networkDisplay = "";
  if (localChainId && selectedChainId && localChainId !== selectedChainId) {
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
                <b>{networkLocal && networkLocal.name}</b>.
                <Button
                  style={{marginTop:4}}
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

                    try {
                      console.log("first trying to add...")
                      switchTx = await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: data,
                      });
                    } catch (addError) {
                      // handle "add" error
                      console.log("error adding, trying to switch")
                      try {
                        console.log("Trying a switch...")
                        switchTx = await ethereum.request({
                          method: "wallet_switchEthereumChain",
                          params: [{ chainId: data[0].chainId }],
                        });
                      } catch (switchError) {
                        // not checking specific error code, because maybe we're not using MetaMask

                      }
                    }
                    // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods


                    if (switchTx) {
                      console.log(switchTx);
                    }
                  }}
                >
                  <span style={{paddingRight:4}}>switch to</span>  <b>{NETWORK(localChainId).name}</b>
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

  const options = [];
  for (const id in NETWORKS) {
    options.push(
      <Select.Option key={id} value={NETWORKS[id].name}>
        <span style={{ color: NETWORKS[id].color, fontSize: 24 }}>{NETWORKS[id].name}</span>
      </Select.Option>,
    );
  }

  const networkSelect = (
    <Select
      size="large"
      defaultValue={targetNetwork.name}
      style={{ textAlign: "left", width: 170, fontSize: 30 }}
      onChange={value => {
        if (targetNetwork.chainId != NETWORKS[value].chainId) {
          window.localStorage.setItem("network", value);
          setTimeout(() => {
            window.location.reload();
          }, 1);
        }
      }}
    >
      {options}
    </Select>
  );

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    provider.on("disconnect",()=>{
      console.log("LOGOUT!")
      logoutOfWeb3Modal()
    })
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
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name == "localhost";

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

  let startingAddress = "";
  if (window.location.pathname) {
    const incoming = window.location.pathname.replace("/", "");
    if (incoming && ethers.utils.isAddress(incoming)) {
      startingAddress = incoming;
      window.history.pushState({}, "", "/");
    }

    /* let rawPK
    if(incomingPK.length===64||incomingPK.length===66){
      console.log("🔑 Incoming Private Key...");
      rawPK=incomingPK
      burnerConfig.privateKey = rawPK
      window.history.pushState({},"", "/");
      let currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
      if(currentPrivateKey && currentPrivateKey!==rawPK){
        window.localStorage.setItem("metaPrivateKey_backup"+Date.now(),currentPrivateKey);
      }
      window.localStorage.setItem("metaPrivateKey",rawPK);
    } */
  }
  // console.log("startingAddress",startingAddress)
  const [amount, setAmount] = useState();
  const [data, setData] = useState();
  const [toAddress, setToAddress] = useLocalStorage("punkWalletToAddress", startingAddress, 120000);

  const [walletConnectTx, setWalletConnectTx] = useState();

  const [loading, setLoading] = useState(false);

  const [depositing, setDepositing] = useState();
  const [depositAmount, setDepositAmount] = useState();

/*
  const handleOk = async () => {
    setIsWalletModalVisible(false);

    let result = await userProvider.send(walletModalData.payload.method, walletModalData.payload.params)

    //console.log("MSG:",ethers.utils.toUtf8Bytes(msg).toString())

    //console.log("payload.params[0]:",payload.params[1])
    //console.log("address:",address)

    //let userSigner = userProvider.getSigner()
    //let result = await userSigner.signMessage(msg)
    console.log("RESULT:",result)


    walletModalData.connector.approveRequest({
      id: walletModalData.payload.id,
      result: result
    });

    notification.info({
      message: "Wallet Connect Transaction Sent",
      description: result.hash,
      placement: "bottomRight",
    });
  };

  const handleCancel = () => {
    setIsWalletModalVisible(false);
  };

*/

  const walletDisplay =
    web3Modal && web3Modal.cachedProvider ? (
      ""
    ) : (
      <Wallet address={address} provider={userProvider} ensProvider={mainnetProvider} price={price} />
    );

  return (
    <div className="App">
      <div className="site-page-header-ghost-wrapper">
        <Header
          extra={[
            <Address fontSize={32} address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />,
            /* <span style={{ verticalAlign: "middle", paddingLeft: 16, fontSize: 32 }}>
              <Tooltip title="History">
                <HistoryOutlined onClick={async () => {
                  window.open("https://zapper.fi/transactions?address="+address)
                }}/>
              </Tooltip>
            </span>, */
            walletDisplay,

            <span style={{color: "#1890ff",cursor:"pointer",fontSize:30,opacity:checkingBalances?0.2:1,paddingLeft:16,verticalAlign:"middle"}} onClick={()=>{checkBalances(address)}}><ReloadOutlined /></span>,
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
            />,
          ]}
        />
      </div>

      {/* ✏️ Edit the header and change the title to your project name */}

      <div style={{ padding: 16, backgroundColor: "#FFFFFF", width: 420, margin: "auto" }}>
        <SpeedUpTransactions
           provider={userProvider}
           signer={userProvider.getSigner()}
           injectedProvider={injectedProvider}
           address={address} 
           chainId={targetNetwork.chainId}
         />
      </div>

      <div style={{ clear: "both", opacity: yourLocalBalance ? 1 : 0.2, width: 500, margin: "auto",position:"relative" }}>
        <Balance value={yourLocalBalance} size={12+window.innerWidth/16} price={price} />
        <span style={{ verticalAlign: "middle" }}>
          {networkSelect}
          {faucetHint}
        </span>
      </div>

      <div style={{ padding: 16, cursor: "pointer", backgroundColor: "#FFFFFF", width: 420, margin: "auto" }}>
        <QRPunkBlockie withQr address={address} showAddress={true} />
      </div>

      <div style={{ position: "relative", width: 320, margin: "auto", textAlign: "center", marginTop: 32 }}>
        <div style={{ padding: 10 }}>
          <AddressInput
            ensProvider={mainnetProvider}
            placeholder="to address"
            disabled={walletConnectTx}
            value={toAddress}
            onChange={setToAddress}
            hoistScanner={toggle => {
              scanner = toggle;
            }}
            walletConnect={(wcLink)=>{
              //if(walletConnectUrl){
                /*try{
                  //setConnected(false);
                  //setWalletConnectUrl();
                  //if(wallectConnectConnector) wallectConnectConnector.killSession();
                  //if(wallectConnectConnectorSession) setWallectConnectConnectorSession("");
                  setConnected(false);
                  //if(wallectConnectConnector) wallectConnectConnector.killSession();
                  localStorage.removeItem("walletConnectUrl")
                  localStorage.removeItem("wallectConnectConnectorSession")
                }catch(e){console.log(e)}
              }

              setTimeout(()=>{
                window.location.replace('/wc?uri='+wcLink);
              },500)*/

              if(walletConnectUrl){
                //existing session... need to kill it and then connect new one....
                setConnected(false);
                if(wallectConnectConnector) wallectConnectConnector.killSession();
                localStorage.removeItem("walletConnectUrl")
                localStorage.removeItem("wallectConnectConnectorSession")
                localStorage.setItem("wallectConnectNextSession",wcLink)
              }else{
                setWalletConnectUrl(wcLink)
              }

            }}
          />
        </div>

        <div style={{ padding: 10 }}>
          {walletConnectTx ? <Input disabled={true} value={amount}/>:<EtherInput
            price={price || targetNetwork.price}
            value={amount}
            token={targetNetwork.token || "ETH"}
            onChange={value => {
              setAmount(value);
            }}
          />}

        </div>
        {/*
          <div style={{ padding: 10 }}>
          <Input
          placeholder="data (0x0000)"
          value={data}
          disabled={walletConnectTx}
          onChange={(e)=>{
            setData(e.target.value)
          }}
          />
          </div>
          */}
        <div style={{ position: "relative", top: 10, left:40 }}> {networkDisplay} </div>
        <div style={{ padding: 10 }}>
          <Button
            key="submit"
            type="primary"
            disabled={loading || !amount || !toAddress}
            loading={loading}
            onClick={async () => {
              setLoading(true);

              let value;
              try {

                console.log("PARSE ETHER",amount)
                value = parseEther("" + amount);
                console.log("PARSEDVALUE",value)
              } catch (e) {
                const floatVal = parseFloat(amount).toFixed(8);

                console.log("floatVal",floatVal)
                // failed to parseEther, try something else
                value = parseEther("" + floatVal);
                console.log("PARSEDfloatVALUE",value)
              }

              let txConfig = {
                to: toAddress,
                chainId: selectedChainId,
                value,
              }

              if(targetNetwork.name=="arbitrum"){
                //txConfig.gasLimit = 21000;
                //ask rpc for gas price
              }else if(targetNetwork.name=="optimism"){
                //ask rpc for gas price
              }else if(targetNetwork.name=="gnosis"){
                //ask rpc for gas price
              }else if(targetNetwork.name=="polygon"){
                  //ask rpc for gas price
              }else{
                txConfig.gasPrice = gasPrice
              }

              console.log("SEND AND NETWORK",targetNetwork)
              let result = tx(txConfig);
              // setToAddress("")
              setAmount("");
              setData("");
              result = await result;
              console.log(result);
              setLoading(false);
            }}
          >
            {loading || !amount || !toAddress ? <CaretUpOutlined /> : <SendOutlined style={{ color: "#FFFFFF" }} />}{" "}
            Send
          </Button>
        </div>
      </div>

      {/* <BrowserRouter>

        <Menu style={{ textAlign:"center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute("/");
              }}
              to="/"
            >
              YourContract
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
          <Menu.Item key="/exampleui">
            <Link
              onClick={() => {
                setRoute("/exampleui");
              }}
              to="/exampleui"
            >
              ExampleUI
            </Link>
          </Menu.Item>
          <Menu.Item key="/mainnetdai">
            <Link
              onClick={() => {
                setRoute("/mainnetdai");
              }}
              to="/mainnetdai"
            >
              Mainnet DAI
            </Link>
          </Menu.Item>
          <Menu.Item key="/subgraph">
            <Link
              onClick={() => {
                setRoute("/subgraph");
              }}
              to="/subgraph"
            >
              Subgraph
            </Link>
          </Menu.Item>
        </Menu>
        <Switch>
          <Route exact path="/">
            }
            <Contract
              name="YourContract"
              signer={userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />



          </Route>
          <Route path="/hints">
            <Hints
              address={address}
              yourLocalBalance={yourLocalBalance}
              mainnetProvider={mainnetProvider}
              price={price}
            />
          </Route>
          <Route path="/exampleui">
            <ExampleUI
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
          </Route>
          <Route path="/mainnetdai">
            <Contract
              name="DAI"
              customContract={mainnetDAIContract}
              signer={userProvider.getSigner()}
              provider={mainnetProvider}
              address={address}
              blockExplorer="https://etherscan.io/"
            />
          </Route>
          <Route path="/subgraph">
            <Subgraph
              subgraphUri={props.subgraphUri}
              tx={tx}
              writeContracts={writeContracts}
              mainnetProvider={mainnetProvider}
            />
          </Route>
        </Switch>
      </BrowserRouter>
*/}

      <div style={{ zIndex: -1, paddingTop: 128, opacity: 0.5, fontSize: 12 }}>
        <Button
          style={{ margin:8, marginTop: 16 }}
          onClick={() => {
            window.open("https://zapper.fi/account/"+address+"?tab=history");
          }}
        >
          <span style={{ marginRight: 8 }}>📜</span>History
        </Button>

        <Button
          style={{  margin:8, marginTop: 16, }}
          onClick={() => {
            window.open("https://zapper.fi/account/"+address);
          }}
        >
          <span style={{ marginRight: 8 }}>👛</span> Inventory
        </Button>



      </div>

      <div style={{ clear: "both", width: 500, margin: "auto" ,marginTop:32, position:"relative"}}>
        {connected?<span style={{cursor:"pointer",padding:8,fontSize:30,position:"absolute",top:-16,left:28}}>✅</span>:""}
        <Input
          style={{width:"70%"}}
          placeholder={"wallet connect url (or use the scanner-->)"}
          value={walletConnectUrl}
          disabled={connected}
          onChange={(e)=>{
            setWalletConnectUrl(e.target.value)
          }}
        />{connected?<span style={{cursor:"pointer",padding:10,fontSize:30,position:"absolute", top:-18}} onClick={()=>{
          setConnected(false);
          if(wallectConnectConnector) wallectConnectConnector.killSession();
          localStorage.removeItem("walletConnectUrl")
          localStorage.removeItem("wallectConnectConnectorSession")
        }}>🗑</span>:""}
      </div>


      { targetNetwork.name=="ethereum" ? <div style={{ zIndex: -1, padding: 64, opacity: 0.5, fontSize: 12 }}>
        {
          depositing ? <div style={{width:200,margin:"auto"}}>
            <EtherInput
              /*price={price || targetNetwork.price}*/
              value={depositAmount}
              token={targetNetwork.token || "ETH"}
              onChange={value => {
                setDepositAmount(value);
              }}
            />
            <Button
              style={{ margin:8, marginTop: 16 }}
              onClick={() => {
                console.log("DEPOSITING",depositAmount)
                tx({
                  to: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1",
                  value: ethers.utils.parseEther(depositAmount),
                  gasLimit: 175000,
                  gasPrice: gasPrice,
                  data: "0xb1a1a882000000000000000000000000000000000000000000000000000000000013d62000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000"
                })
                setDepositAmount()
                setDepositing()
              }}
            >
              <span style={{ marginRight: 8 }}>🔴</span>Deposit
            </Button>
          </div>:<div>
            <Button
              style={{ margin:8, marginTop: 16 }}
              onClick={() => {
                setDepositing(true)
                /*tx({
                  to: "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1",
                  value: ethers.utils.parseEther("0.01"),
                  gasLimit: 175000,
                  gasPrice: gasPrice,
                  data: "0xb1a1a882000000000000000000000000000000000000000000000000000000000013d62000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000"
                })*/
              }}
            >
              <span style={{ marginRight: 8 }}>🔴</span>Deposit to OE
            </Button>
          </div>
        }
      </div> : ""}


      <div style={{ zIndex: -1, padding: 64, opacity: 0.5, fontSize: 12 }}>
        created with <span style={{ marginRight: 4 }}>🏗</span>
        <a href="https://github.com/austintgriffith/scaffold-eth#-scaffold-eth" target="_blank">
          scaffold-eth
        </a>
      </div>
      <div style={{ padding: 32 }} />

      <div
        style={{
          transform: "scale(2.7)",
          transformOrigin: "70% 80%",
          position: "fixed",
          textAlign: "right",
          right: 0,
          bottom: 16,
          padding: 10,
        }}
      >
        <Button
          type="primary"
          shape="circle"
          style={{backgroundColor:targetNetwork.color,borderColor:targetNetwork.color}}
          size="large"
          onClick={() => {
            scanner(true);
          }}
        >
          <ScanOutlined style={{ color: "#FFFFFF" }} />
        </Button>
      </div>

{/*

      <Modal title={walletModalData && walletModalData.payload && walletModalData.payload.method} visible={isWalletModalVisible} onOk={handleOk} onCancel={handleCancel}>
       <pre>
        {walletModalData && walletModalData.payload && JSON.stringify(walletModalData.payload.params, null, 2)}
       </pre>
     </Modal>
  */}


      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[16, 16]}>
          <Col span={12}>
            <Ramp price={price} address={address} networks={NETWORKS} />
          </Col>

          {targetNetwork.name=="arbitrum"||targetNetwork.name=="gnosis"||targetNetwork.name=="optimism"||targetNetwork.name=="polygon"?"":<Col span={12} style={{ textAlign: "center", opacity: 0.8 }}>
            <GasGauge gasPrice={gasPrice} />
          </Col>}
        </Row>

        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {faucetAvailable ? (
              <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider} />
            ) : (
              ""
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}

/* eslint-disable */
window.ethereum &&
  window.ethereum.on("chainChanged", chainId => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 3000);
  });

window.ethereum &&
  window.ethereum.on("accountsChanged", accounts => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });
/* eslint-enable */

export default App;
