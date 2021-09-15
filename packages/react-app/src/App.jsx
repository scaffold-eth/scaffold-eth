import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import {  StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { ExportOutlined, ForkOutlined, ExperimentOutlined, ReconciliationOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { message, Input, Image, List, Row, Col, Button, Menu, Alert, Switch as SwitchD, Progress, notification } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import "antd/dist/antd.css";
import { useUserAddress } from "eth-hooks";
import { useLocalStorage, useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader, useOnBlock } from "./hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge, ThemeSwitch, QRPunkBlockie, EtherInput, AddressInput, Balance, Address } from "./components";
import { Transactor } from "./helpers";
import { formatEther, parseEther } from "@ethersproject/units";
//import Hints from "./Hints";
import { Hints, ExampleUI, Subgraph, Checkout } from "./views"

import { useThemeSwitcher, ThemeSwitcherProvider } from "react-css-theme-switcher";
import { INFURA_ID, DAI_ADDRESS, DAI_ABI, NETWORK, NETWORKS, SIMPLE_STREAM_ABI, BUILDERS, BUILDS, mainStreamReader_ADDRESS, mainStreamReader_ABI } from "./constants";
import pretty from 'pretty-time';
import { ethers } from "ethers";


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


const translateAddressesForLocal = (addy) => {
  //if(addy=="0x90FC815Fe9338BB3323bAC84b82B9016ED021e70") return "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE"
  //if(addy=="0x21e18260357D33d2e18482584a8F39D532fb71cC") return "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c"
  return addy
}

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.mainnet; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
//const scaffoldEthProvider = new StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544");
const mainnetInfura = new StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem("theme");



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


function App(props) {
  const mainnetProvider = mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork, mainnetProvider);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if(injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function"){
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

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
  const tx = Transactor(userProvider, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  //const faucetTx = Transactor(localProvider, gasPrice)

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  //const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  //const yourMainnetBalance = useBalance(mainnetProvider, address);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider);

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetStreamReaderContract = useExternalContractLoader(mainnetProvider, mainStreamReader_ADDRESS, mainStreamReader_ABI)

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  // Then read your DAI balance like:
  //const myMainnetDAIBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])

  let streams = []
  for(let b in BUILDERS){
    if(BUILDERS[b].streamAddress) streams.push(BUILDERS[b].streamAddress)
  }
  //console.log("streams",streams)
  // keep track of a variable from the contract in the local React state:
  const streamReadResult = useContractReader({"StreamReader":mainnetStreamReaderContract},"StreamReader", "readStreams", [streams])
  //console.log("streamReadResult",streamReadResult)

  const [ builderStreams, setBuilderStreams ] = useState()
  useEffect(
    ()=>{
      if(streamReadResult){
        let finalBuilderList = {}
        for(let b in BUILDERS){
          let badges = []
          for(let c in BUILDERS[b].builds){
            let buildString = BUILDERS[b].builds[c]
            //console.log("searching for build string ",buildString)
            for(let d in BUILDS){
              if(BUILDS[d].image.replace(".png","").replace(".jpg","")==buildString){
                badges.push(
                  <a href={BUILDS[d].branch} target="_blank"><span style={{margin:4}}>{BUILDS[d].name.substr(0,BUILDS[d].name.indexOf(" "))}</span></a>
                )
              }
            }
          }
          finalBuilderList[BUILDERS[b].name] = {...BUILDERS[b],badges,cap:streamReadResult[b*4],frequency:streamReadResult[b*4+1],balance:streamReadResult[b*4+2],totalBalance:streamReadResult[b*4+3]}
        }
        setBuilderStreams(finalBuilderList)
      }
    }
  ,[streamReadResult])
  //console.log("builderStreams",builderStreams)

  //📟 Listen for broadcast events
  const fundingEvents = useEventListener(readContracts, "StreamFunder", "FundStreams", localProvider, 1);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  /*let addressToUse
  let streamLoaders
  for(let b in BUILDERS){
    console.log("BUILDER",b,BUILDERS[b])
    if(BUILDERS[b].streamAddress){
      addressToUse = BUILDERS[b].streamAddress
      streamLoaders[b] = useExternalContractLoader(mainnetProvider, addressToUse, SIMPLE_STREAM_ABI)
    }
  }*/

  //search filter for front page
  const [ filter, setFilter ]= useState(() => {
    const { search } = window.location;
    return new URLSearchParams(search).get('s');
  });
  const [ filterExplanation, setFilterExplanation ] = useState()

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(()=>{
    if(DEBUG && mainnetProvider && address && selectedChainId){
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________")
      console.log("🌎 mainnetProvider",mainnetProvider)
      console.log("🏠 localChainId",localChainId)
      console.log("👩‍💼 selected address:",address)
      console.log("🕵🏻‍♂️ selectedChainId:",selectedChainId)
      /*console.log("💵 yourLocalBalance",yourLocalBalance?formatEther(yourLocalBalance):"...")
      console.log("💵 yourMainnetBalance",yourMainnetBalance?formatEther(yourMainnetBalance):"...")
      console.log("📝 readContracts",readContracts)
      console.log("🌍 DAI contract on mainnet:",mainnetDAIContract)
      console.log("🔐 writeContracts",writeContracts)*/
    }
  }, [mainnetProvider, address, selectedChainId])


  let networkDisplay = ""
  if(localChainId && selectedChainId && localChainId != selectedChainId ){
    networkDisplay = (
      <div style={{zIndex:2, position:'absolute', right:0,top:60,padding:16}}>
        <Alert
          message={"⚠️ Wrong Network"}
          description={(
            <div>
              You have <b>{NETWORK(selectedChainId).name}</b> selected and you need to be on <b>{NETWORK(localChainId).name}</b>.
            </div>
          )}
          type="error"
          closable={false}
        />
      </div>
    )
  }else{
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

  let faucetHint = ""
  const faucetAvailable = false && localProvider && localProvider.connection && targetNetwork.name == "localhost"
/*
  const [ faucetClicked, setFaucetClicked ] = useState( false );
  if(!faucetClicked&&localProvider&&localProvider._network&&localProvider._network.chainId==31337&&yourLocalBalance&&formatEther(yourLocalBalance)<=0){
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
    )
  }*/

  const [ randomizedBuilds, setRandomizedBuilds ] = useState()
  useEffect(()=>{
    setRandomizedBuilds(shuffle(BUILDS))
  },[BUILDS])

  const [ cart, setCart ] = useLocalStorage("buidlguidlcart", [], 12000000) //12000000 ms timeout? idk
  //console.log("cart",cart)
  //console.log("route",route)

  let displayCart = []
  if(cart && cart.length>0){
    for(let c in cart){
      console.log("CART ITEM",c,cart[c])
      if(!cart[c].streamAddress){
        displayCart.push(
          <div key={c} style={{padding:22, border:"1px solid #dddddd",borderRadius:8}}>
            <div style={{marginLeft:32}}>
              <div style={{float:"right",zIndex:2}}>
                <Button borderless={true} onClick={()=>{
                  console.log("REMOVE ",c,cart[c])
                  let update = []
                  for(let x in cart){
                    if(cart[c].id != cart[x].id){
                      update.push(cart[x])
                    }
                  }
                  console.log("update",update)
                  setCart(update)
                }}>x</Button>
              </div>
              <div style={{fontSize:18,marginLeft:-54}}>
                {cart[c].name}
              </div>
            </div>
          </div>
        )
      }else{
        displayCart.push(
          <div key={c} style={{padding:16, border:"1px solid #dddddd",borderRadius:8}}>
            <div style={{marginLeft:32}}>
              <div style={{float:"right",zIndex:2}}>
                <Button onClick={()=>{
                  console.log("REMOVE ",c,cart[c])
                  let update = []
                  for(let x in cart){
                    if(cart[c].id != cart[x].id){
                      update.push(cart[x])
                    }
                  }
                  console.log("update",update)
                  setCart(update)
                }}>x</Button>
              </div>
              <Address hideCopy={true} punkBlockie={true} fontSize={18} address= {cart[c].address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />

            </div>
          </div>
        )
      }

    }

  }



  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}
      <BrowserRouter>
      {cart&&cart.length>0 && route!="/funding" ?
      <Link  onClick={()=>{setRoute("/funding")}}  style={{color:"#FFF"}} to="/funding">
        <div className="main fade-in" style={{ zIndex:1111, position: "fixed", right: 16, bottom: 0, backgroundColor:"#1890ff", borderRadius:"8px 8px 0px 0px",padding:16, fontSize:32}}>
          <ShoppingCartOutlined /> Checkout [{cart.length} item{cart.length==1?"":"s"}]
        </div>
      </Link>:""}

        <Menu style={{ textAlign:"center", fontSize: 22 }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link onClick={()=>{setRoute("/")}} to="/">🛠 Builds</Link>
          </Menu.Item>
          <Menu.Item key="/builders">
            <Link onClick={()=>{setRoute("/builders")}} to="/builders">👩‍🏭 Builders</Link>
          </Menu.Item>
          <Menu.Item key="/funding">
            <Link onClick={()=>{setRoute("/funding")}} to="/funding">🧪 Funding</Link>
          </Menu.Item>
          <Menu.Item key="/funders">
            <Link onClick={()=>{setRoute("/funders")}} to="/funders">🦹 Funders</Link>
          </Menu.Item>
          {address=="0x34aA3F359A9D614239015126635CE7732c18fDF3"?<Menu.Item key="/debug">
            <Link onClick={()=>{setRoute("/debug")}} to="/debug">👨🏻‍🔬 Debug</Link>
          </Menu.Item>:<></>}
        </Menu>

        <Switch>
          <Route exact path="/">
            {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally


            <Contract
              name="YourContract"
              signer={userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />*/}

            <div style={{width:"calc(max(min(80vw,720px),320px))", margin:"auto"}}>
              <div style={{fontSize:24,opacity:0.777,fontWeight:"normal"}}>
                <div style={{marginTop:64}}>
                  The <b>🏰 BuidlGuidl</b> is a curated group of <b>Ethereum</b> builders
                </div>
                <div>
                  creating <i>products</i>, <i>prototypes</i>, and <i>tutorials</i> with <b><a href="https://github.com/austintgriffith/scaffold-eth" target="_blank">🏗 scaffold-eth</a></b>
                </div>

                <div style={{opacity:0.77,fontSize:14,marginBottom:32,marginTop:64,borderBottom:"1px solid #dfdfdf"}}>
                <Input
                  bordered={false}
                  placeholder={"search everything we have built so far..."}
                  onChange={(e)=>{setFilter(e.target.value)}}
                  value={filter}
                  style={{textAlign:'center'}}
                />
                </div>
                <div>
                  {filterExplanation}
                </div>
              </div>
            </div>

            <div style={{width:"calc(max(min(80vw,720px),320px))", margin:"auto", paddingBottom: 256}}>
            {/*
              <Input placeholder="search builds" bordered={false} style={{textAlign:"center",borderBottom:"1px solid #efefef"}} />
            */}
              <List
                /*bordered*/
                itemLayout="vertical"
                size="large"
                dataSource={randomizedBuilds}

                renderItem={(item) => {
                  /*{
                    name: "",
                    desc: "",
                    branch: "",
                    readMore: "",
                    image: ""
                  }*/
                  if(!filter ||
                    item.name.toLowerCase().indexOf(filter.toLowerCase())>=0 ||
                    item.desc.toLowerCase().indexOf(filter.toLowerCase())>=0
                  ){
                    let extraLink = ""
                    if(item.readMore){
                      extraLink = (
                        <a
                          href={item.readMore}
                          target="_blank"
                          style={{marginLeft:8}}
                        >
                          <ExportOutlined />
                        </a>
                      )
                    }

                    return (
                      <List.Item
                        key={item.name}
                        style={{padding:32}}
                        extra={
                          <Image
                            style={{
                              border:"1px solid #eeefff",
                              padding:8,
                              margin:8,
                              backgroundColor:"#dfdfdf",
                            }}
                            width={220}
                            alt={item.name}
                            src={"./assets/"+item.image}
                          />
                        }
                      >
                        <div style={{textAlign:"left"}}>
                          <div style={{marginTop:32,fontSize:24,fontWeight:"bolder"}}>{item.name}{extraLink}</div>
                          <div style={{marginLeft:32, fontSize:16,opacity:0.777,fontWeight:"bold"}}>{item.desc}</div>
                          <div style={{marginLeft:32,paddingTop:32}}>
                            <Row>
                              <Col span={12}><Button size="large" onClick={()=>{
                                //window.open(item.branch)
                                let copy = {...item}
                                copy.id = Math.floor(Math.random()*100000000000)
                                console.log("copy",copy)
                                setCart([...cart,copy])
                                notification.success({
                                  style:{marginBottom:64},
                                  message: 'Added to cart!',
                                  placement: "bottomRight",
                                  description:(
                                    <div style={{fontSize:22}}>
                                      {item.name}
                                    </div>
                                  )
                                });
                              }}>
                                <ExperimentOutlined /> Fund
                              </Button></Col>
                              <Col span={12}><Button size="large" onClick={()=>{
                                window.open(item.branch)
                              }}>
                                <ForkOutlined /> Fork
                              </Button></Col>
                            </Row>
                          </div>
                        </div>
                      </List.Item>
                    )
                  }

                }}
              />
            </div>
          </Route>
          <Route path="/funders">
            <div style={{padding:32}}>
            </div>
            <List
              /*bordered*/
              itemLayout="vertical"
              size="large"
              dataSource={fundingEvents}

              renderItem={(item) => {
                //console.log("item",item)
                let inventory = []
                for(let s in item.streams){
                  const thisStream = item.streams[s]
                  if(thisStream=="0x97843608a00e2bbc75ab0C1911387E002565DEDE"){
                    inventory.push(
                      <span style={{margin:0,fontSize:28,marginLeft:-16,marginRight:22}}>
                        {item.reasons[s].substr(0,item.reasons[s].indexOf(" "))}
                      </span>
                    )
                  }else{
                    // console.log("looking for face...")
                    // translate stream address to person's address face
                    let foundFace
                    for(let b in BUILDERS){
                      // console.log("comparing...",BUILDERS[b].streamAddress,thisStream)
                      if(translateAddressesForLocal(BUILDERS[b].streamAddress)==thisStream){
                        foundFace = BUILDERS[b].address
                      }
                    }
                    // console.log("foundFace", foundFace)
                    if(foundFace){
                      inventory.push(
                        <span style={{margin:22}}>
                          <Address minimized={true} noLink={true} punkBlockie={true} address={foundFace} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
                        </span>
                      )
                    }
                  }
                }
                return (<div style={{margin:32, borderBottom:"1px solid #EEEEEE"}}>
                  <Address punkBlockie={true} address={item.sender} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
                  <Balance value={item.amount} price={price}/>
                  <div style={{marginBottom:32,marginTop:32}}>
                    {inventory}
                  </div>
                </div>)
              }}
            />

            <div style={{padding:64,paddingBottom:256,fontSize:24}}>
              <a href="https://support.buidlguidl.com/activity" target="_blank">View <b>🦹 funders</b> from round 1</a>
            </div>
          </Route>
          <Route path="/builders">

            <div style={{width:"calc(max(min(80vw,720px),320px))", margin:"auto"}}>
              <div style={{fontSize:20,opacity:0.777,fontWeight:"normal"}}>


                <div style={{marginTop:64, borderBottom:"1px solid #eeeeee",paddingBottom:64,marginBottom:64}}>

                  <div style={{marginTop:8}}>
                    Each builder receives a <b>⏳ stream</b> of ETH.
                  </div>
                  <div style={{marginTop:8}}>
                    When a builder <i>withdraws</i> from their stream, they provide a <b>🏷 link</b> to their work.
                  </div>
                  <div style={{marginTop:8}}>
                    <b>👨‍👩‍👧‍👦 You</b> can fund Ethereum development; send ETH to any stream:
                  </div>
                </div>
                <List
                  /*bordered*/
                  itemLayout="vertical"
                  size="large"
                  dataSource={BUILDERS}

                  renderItem={(item) => {

                    let extraLink = ""
                    if(item.github){
                      extraLink = (
                        <a
                          href={item.github}
                          target="_blank"
                          style={{marginLeft:8}}
                        >
                          <ExportOutlined />
                        </a>
                      )
                    }


                    const STREAMWIDTH = "calc(min(80vw,620px))"
                    const stream = builderStreams && builderStreams[item.name]
                    if(stream){

                      // console.log("STREAM DISPLAY",stream)

                      let streamNetPercentSeconds = stream.totalBalance && stream.cap && stream.totalBalance.mul(100).div(stream.cap)
                      // console.log("streamNetPercentSeconds",streamNetPercentSeconds,streamNetPercentSeconds.toNumber())

                      const numberOfTimesFull = streamNetPercentSeconds && Math.floor(streamNetPercentSeconds.div(100))
                      // console.log("numberOfTimesFull",numberOfTimesFull)

                      const streamNetPercent = streamNetPercentSeconds && streamNetPercentSeconds.mod(100)
                      // console.log("streamNetPercent",streamNetPercent, streamNetPercent && streamNetPercent.toNumber())

                      let totalProgress = []

                      const totalSeconds = streamNetPercentSeconds && stream.frequency && streamNetPercentSeconds.mul(stream.frequency)

                      const percent = stream.cap && stream.balance && (stream.balance.mul(100).div(stream.cap)).toNumber()


                      const widthOfStacks = numberOfTimesFull > 6 ? 32 : 64

                      for(let c=0;c<numberOfTimesFull;c++){
                        totalProgress.push(
                          <Progress percent={100} showInfo={false} style={{width:widthOfStacks,padding:4}}/>
                        )
                      }
                      if(streamNetPercent && streamNetPercent.toNumber()>0){
                        totalProgress.push(
                          <Progress percent={streamNetPercent&&streamNetPercent.toNumber()} showInfo={false} status="active" style={{width:widthOfStacks,padding:4}}/>
                        )
                      }


                      return (
                        <List.Item
                          key={item.name}
                          style={{padding:32}}
                          extra={
                            <div style={{marginRight:-128,marginTop:64}}>

                            </div>
                          }
                        >
                          <div style={{textAlign:"left",position:"relative"}}>
                            <div style={{float:"right",marginTop:16,width:100}}>
                              <Button size="large" style={{zIndex:1}} onClick={()=>{
                                  //window.open(item.branch)
                                  //message.success("Coming soon!")
                                  let copy = {...item}
                                  copy.id = Math.floor(Math.random()*100000000000)
                                  console.log("copy",copy)
                                  setCart([...cart,copy])
                                  notification.success({
                                    style:{marginBottom:64},
                                    message: 'Added to cart!',
                                    placement: "bottomRight",
                                    description:(<ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || "light"}>
                                        <Address hideCopy={true} punkBlockie={true} address={item.address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
                                      </ThemeSwitcherProvider>
                                    )
                                  });
                                }}>
                                  <ExperimentOutlined /> Fund
                              </Button>
                              <Button style={{marginTop:32,zIndex:1}} size="large" onClick={()=>{
                                  window.open(item.streamUrl)
                                  //message.success("Coming soon!")
                                }}>
                                  <ReconciliationOutlined /> Work
                              </Button>
                            </div>
                            {item.streamAddress?<div style={{position:"absolute",left:266,top:-6}}>
                              <div style={{padding:8}}>
                                <div style={{padding:4, fontSize:14}}>
                                  Ξ<Balance value={stream.totalBalance} provider={localProvider} price={false} size={14}/>
                                  <span style={{opacity:0.5}}> @ Ξ<Balance value={stream.cap} price={false} size={14}/> / {stream.frequency&&pretty(stream.frequency.toNumber()*1000000000)}</span>
                                </div>
                                <div>
                                  {totalProgress} ({totalSeconds&&pretty(totalSeconds.toNumber()*10000000)})
                                </div>
                                <div style={{position:'absolute',left:-45,top:24}}>
                                <Progress style={{marginTop:4}} strokeLinecap="square" type="dashboard" percent={percent} width={50}  format={()=>{
                                    return <Balance value={stream.balance} size={9}/>
                                }} />
                                </div>
                              </div>
                            </div>:""}

                            <div style={{position:"absolute",left:-216,top:-100}}>
                              <QRPunkBlockie withQr={false} address={item.address} scale={0.7} />
                            </div>

                            <div style={{marginLeft:32, marginTop:32,fontSize:24,fontWeight:"bolder"}}>{item.name}</div>
                            <div style={{marginLeft:32, fontSize:16,opacity:0.777,fontWeight:"bold"}}>{item.role}</div>
                            <div style={{marginLeft:-32,marginTop:32, fontSize:26,fontWeight:"bold"}}>{stream.badges}</div>


                          </div>
                        </List.Item>
                      )
                    }

                  }}
                />

                <div style={{marginTop:64, borderTop:"1px solid #eeeeee",paddingTop:64,marginBottom:64}}>
                  <div>Join the <b>🏰 BuidlGuidl:</b> create something rad with <a style={{fontWeight:"bolder"}} href="https://github.com/scaffold-eth/scaffold-eth" target="_blank">🏗 scaffold-eth</a>!</div>
                  <div style={{marginTop:16}}>Watch the latest <a target="_blank" href="https://youtu.be/mctO5EUx_wI?t=103">🎥 onboarding video</a></div>
                  <div style={{marginTop:8}}>
                    Use the <a target="_blank" href="https://github.com/scaffold-eth/scaffold-eth#-examples-and-tutorials">🚩 challenges</a>,
                     <a target="_blank" href="https://github.com/scaffold-eth/scaffold-eth#-examples-and-tutorials">👨‍🏫 tutorials</a>,
                      and
                       <a target="_blank" href="https://github.com/scaffold-eth/scaffold-eth/branches/active">🌳 branches</a> for inspiration.
                  </div>
                  <div style={{marginTop:8}}>
                    Submit creations to the <a href="https://t.me/joinchat/PXu_P6pps5I5ZmUx" target="_blank">🏰 BuidlGuidl telegram</a>!
                  </div>
                  <div style={{marginTop:8}}>
                    Get help in the <a href="https://t.me/joinchat/U2UA3vBM5I7PoCOk" target="_blank">💬 Support telegram</a>.
                  </div>
                </div>

                <div style={{paddingBottom:256}}></div>
              </div>
            </div>

          </Route>
          <Route path="/funding">

          <div style={{marginTop:64, borderBottom:"1px solid #eeeeee",paddingBottom:64,marginBottom:64}}>
            <div style={{fontSize:20,opacity:0.777,fontWeight:"normal"}}>

              <div style={{marginTop:8,marginBottom:16}}>
                The <b>🏰 BuidlGuidl</b> is an Ethereum <b>public good</b>.
              </div>
              <div style={{marginTop:8,marginBottom:16}}>
                We build <i>generic web3 components</i> to make creating web3 <b>products</b> easier.
              </div>

              <hr style={{opacity:0.1,marginBottom:64}}/>
              <div style={{marginTop:8,marginBottom:64}}>
                Support the <b>🏰 BuidlGuidl</b>:
              </div>


              <Checkout
                setRoute={setRoute}
                cart={cart}
                setCart={setCart}
                displayCart={displayCart}
                tx={tx}
                writeContracts={writeContracts}
                mainnetProvider={mainnetProvider}
              />


              <hr style={{opacity:0.1,marginTop:64}}/>


              <div style={{marginTop:64}}>
                {cart && cart.length>0 ? <div style={{padding:8}}>
                  All funding is sent to ETH streams that flow to builders as they turn in work.
                <hr style={{opacity:0.1,marginTop:64}}/></div>:<div style={{padding:8}}>
                  🙏 All funding will go to developers mentored by <a  href="https://twitter.com/austingriffith" target="_blank">@austingriffith</a>.
                </div>}
                <div style={{padding:8}}>
                  In <a href="https://medium.com/@austin_48503/buidl-guidl-round-1-unaudited-4e1d9456e43d" target="_blank">version one</a>, we used <a href="https://support.buidlguidl.com/activity" target="_blank">quadratic matching</a> to fund a guild bank.
                </div>
                <div style={{padding:8}}>
                  Then, we streamed the ETH to builders! Check out <a href="https://bank.buidlguidl.com/streams" target="_blank">all the work</a>  they turned in.
                </div>
                <div style={{padding:8}}>
                  <i>Think what we could do with <b>your</b> support!</i>
                </div>
              </div>
            </div>
          </div>


          </Route>
          <Route path="/debug">
            <Contract
              name="StreamReader"
              signer={userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
            <Contract
              name="StreamFunder"
              signer={userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
          </Route>
        </Switch>
      </BrowserRouter>



        {/* <ThemeSwitch />*/}

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

/* eslint-disable */
window.ethereum &&
  window.ethereum.on("chainChanged", chainId => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });

window.ethereum &&
  window.ethereum.on("accountsChanged", accounts => {
    web3Modal.cachedProvider &&
      setTimeout(() => {
        window.location.reload();
      }, 1);
  });
/* eslint-enable */


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default App;
