import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import {  StaticJsonRpcProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { ExportOutlined, ForkOutlined, ExperimentOutlined } from "@ant-design/icons";
import { message, Input, Image, List, Row, Col, Button, Menu, Alert, Switch as SwitchD, Progress } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader, useOnBlock } from "./hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge, ThemeSwitch, QRPunkBlockie, EtherInput, AddressInput, Balance } from "./components";
import { Transactor } from "./helpers";
import { formatEther, parseEther } from "@ethersproject/units";
//import Hints from "./Hints";
import { Hints, ExampleUI, Subgraph } from "./views"
import { useThemeSwitcher } from "react-css-theme-switcher";
import { INFURA_ID, DAI_ADDRESS, DAI_ABI, NETWORK, NETWORKS, SIMPLE_STREAM_ABI, BUILDERS, BUILDS } from "./constants";
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


/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS['mainnet']; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true


// 🛰 providers
if(DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = new StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544")
const mainnetInfura = new StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if(DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new StaticJsonRpcProvider(localProviderUrlFromEnv);


// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;


function App(props) {

  const mainnetProvider = (scaffoldEthProvider && scaffoldEthProvider._network) ? scaffoldEthProvider : mainnetInfura

  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork,mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork,"fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);

  // You can warn the user if you would like them to be on a specific network
  let localChainId = localProvider && localProvider._network && localProvider._network.chainId
  let selectedChainId = userProvider && userProvider._network && userProvider._network.chainId

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  // Faucet Tx can be used to send funds from the faucet
  //const faucetTx = Transactor(localProvider, gasPrice)

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  //const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  //const yourMainnetBalance = useBalance(mainnetProvider, address);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  //const writeContracts = useContractLoader(userProvider)

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  //const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI)

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`)
  })

  // Then read your DAI balance like:
  //const myMainnetDAIBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])

  let streams = []
  for(let b in BUILDERS){
    if(BUILDERS[b].streamAddress) streams.push(BUILDERS[b].streamAddress)
  }
  console.log("streams",streams)
  // keep track of a variable from the contract in the local React state:
  const streamReadResult = useContractReader(readContracts,"StreamReader", "readStreams", [streams])
  console.log("streamReadResult",streamReadResult)

  const [ builderStreams, setBuilderStreams ] = useState()
  useEffect(
    ()=>{
      if(streamReadResult){
        let finalBuilderList = {}
        for(let b in BUILDERS){

          let badges = []
          for(let c in BUILDERS[b].builds){
            let buildString = BUILDERS[b].builds[c]
            console.log("searching for build string ",buildString)
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
  console.log("builderStreams",builderStreams)

  //📟 Listen for broadcast events
  //const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);

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
      <div style={{zIndex:-1, position:'absolute', right:154,top:28,padding:16,color:targetNetwork.color}}>
        {targetNetwork.name}
      </div>
    )
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
    setRoute(window.location.pathname)
  }, [setRoute]);

  let faucetHint = ""
  const faucetAvailable = false && localProvider && localProvider.connection && targetNetwork.name == "localhost"
/*
  const [ faucetClicked, setFaucetClicked ] = useState( false );
  if(!faucetClicked&&localProvider&&localProvider._network&&localProvider._network.chainId==31337&&yourLocalBalance&&formatEther(yourLocalBalance)<=0){
    faucetHint = (
      <div style={{padding:16}}>
        <Button type={"primary"} onClick={()=>{
          faucetTx({
            to: address,
            value: parseEther("0.01"),
          });
          setFaucetClicked(true)
        }}>
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    )
  }*/






  const [amount, setAmount] = useState();
  const [reason, setReason] = useState();
  const [toAddress, setToAddress] = useState("0x97843608a00e2bbc75ab0C1911387E002565DEDE");

  let extra = ""
  if(toAddress=="0x97843608a00e2bbc75ab0C1911387E002565DEDE"){
    extra = "(buidlguidl.eth)"
  }

  return (
    <div className="App">

      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}
      <BrowserRouter>

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
          {address=="0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1"?<Menu.Item key="/debug">
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

                <div style={{opacity:0.77,fontSize:14,marginBottom:32,marginTop:32}}>
                This is what we've built so far...
                </div>
              </div>
            </div>

            <div style={{width:"calc(max(min(80vw,720px),320px))", margin:"auto"}}>
{/*
              <Input placeholder="search builds" bordered={false} style={{textAlign:"center",borderBottom:"1px solid #efefef"}} />
*/}
              <List
                /*bordered*/
                itemLayout="vertical"
                size="large"
                dataSource={BUILDS}

                renderItem={(item) => {
                  /*{
                    name: "",
                    desc: "",
                    branch: "",
                    readMore: "",
                    image: ""
                  }*/

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
                              message.success("Coming Soon!")
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
                }}
              />
            </div>


            { /* uncomment for a second contract:
            <Contract
              name="SecondContract"
              signer={userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
            */ }

            { /* Uncomment to display and interact with an external contract (DAI on mainnet):
            <Contract
              name="DAI"
              customContract={mainnetDAIContract}
              signer={userProvider.getSigner()}
              provider={mainnetProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
            */ }
          </Route>
          <Route path="/builders">

            <div style={{width:"calc(max(min(80vw,720px),320px))", margin:"auto"}}>
              <div style={{fontSize:20,opacity:0.777,fontWeight:"normal"}}>
                <div style={{marginTop:64, borderBottom:"1px solid #eeeeee",paddingBottom:64,marginBottom:64}}>
                  <div>Join the <b>🏰 BuidlGuidl:</b> create something rad with <a style={{color:"#222222",fontWeight:"bolder"}} href="https://github.com/austintgriffith/scaffold-eth" target="_blank">🏗 scaffold-eth</a>!</div>
                  <div style={{marginTop:8}}>
                    Use the <a target="_blank" href="https://github.com/austintgriffith/scaffold-eth#-examples-and-tutorials">🚩 challenges</a>,
                     <a target="_blank" href="https://github.com/austintgriffith/scaffold-eth#-examples-and-tutorials">👨‍🏫 tutorials</a>,
                      and
                       <a target="_blank" href="https://github.com/austintgriffith/scaffold-eth/branches/active">🌳 branches</a> for inspiration.
                  </div>
                  <div style={{marginTop:8}}>
                    Submit creations to the <a href="https://t.me/joinchat/PXu_P6pps5I5ZmUx" target="_blank">🏰 BuidlGuidl telegram</a>!
                  </div>
                  <div style={{marginTop:8}}>
                    Get help in the <a href="https://t.me/joinchat/U2UA3vBM5I7PoCOk" target="_blank">💬 Support telegram</a>.
                  </div>
                </div>

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

                      //console.log("STREAM DISPLAY",stream)

                      let streamNetPercentSeconds = stream.totalBalance && stream.cap && stream.totalBalance.mul(100).div(stream.cap)
                      //console.log("streamNetPercentSeconds",streamNetPercentSeconds,streamNetPercentSeconds.toNumber())

                      const numberOfTimesFull = streamNetPercentSeconds && Math.floor(streamNetPercentSeconds.div(100))
                      //console.log("numberOfTimesFull",numberOfTimesFull)

                      const streamNetPercent = streamNetPercentSeconds && streamNetPercentSeconds.mod(100)
                      //console.log("streamNetPercent",streamNetPercent, streamNetPercent && streamNetPercent.toNumber())

                      let totalProgress = []

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
                            <div style={{marginTop:48}}>
                              <Button size="large" onClick={()=>{
                                  //window.open(item.branch)
                                  message.success("Coming soon!")
                                }}>
                                  <ExperimentOutlined /> Fund
                              </Button>
                            </div>
                          }
                        >
                          <div style={{textAlign:"left",position:"relative"}}>

                            {item.streamAddress?<div style={{position:"absolute",left:216,top:-6}}>
                              <div style={{padding:8}}>
                                <div style={{padding:4, fontSize:14}}>
                                  <Balance value={stream.totalBalance} provider={localProvider} price={price} size={14}/>
                                  <span style={{opacity:0.5}}> @ <Balance value={stream.cap} price={price} size={14}/> / {stream.frequency&&pretty(stream.frequency.toNumber()*1000000000)}</span>
                                </div>
                                <div>
                                  {totalProgress} ({streamNetPercentSeconds&&pretty(streamNetPercentSeconds.toNumber()*1000000000)})
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
              <div style={{marginTop:8,marginBottom:64}}>
                Each <i>branch</i> of <b>🏗 scaffold-eth</b> is an educational tutorial.
              </div>


              <hr style={{opacity:0.1,marginBottom:64}}/>

              <div style={{width:400, margin:"auto"}}>
                <div style={{marginTop:8}}>
                  <AddressInput
                    hideScanner={true}
                    ensProvider={mainnetProvider}
                    placeholder="to address"
                    value={toAddress}
                    onChange={setToAddress}
                  />
                </div>
                {extra?<div style={{marginTop:2,textAlign:"left",paddingLeft:16,fontSize:14}}>
                  <b>BuidlGuidl.eth</b>
                </div>:""}
                <div style={{marginTop:16}}>
                  <EtherInput
                    autoFocus={true}
                    price={props.price}
                    value={amount}
                    onChange={value => {
                      setAmount(value);
                    }}
                  />
                </div>
                <div style={{marginTop:16}}>
                  <Input
                    placeholder={"reason / guidance"}
                    value={reason}
                    onChange={e => {
                      setReason(e.target.value);
                    }}
                  />
                </div>
                <div style={{marginTop:16}}>
                <Button
                  onClick={() => {
                    console.log("toAddress",toAddress)
                    console.log("AMOUNT",amount)
                    tx({
                      to: toAddress,
                      value: parseEther(""+amount),
                      data: reason?ethers.utils.hexlify(ethers.utils.toUtf8Bytes(reason)):"0x"
                    })
                  }}
                  size="large"
                  type="primary"
                >
                  Fund
                </Button>
                </div>
              </div>


              <hr style={{opacity:0.1,marginTop:64}}/>


              <div style={{marginTop:64}}>
                <div style={{padding:8}}>
                  🙏 All funding will go to developers mentored by <a  href="https://twitter.com/austingriffith" target="_blank">@austingriffith</a>.
                </div>
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
          </Route>
        </Switch>
      </BrowserRouter>

      <ThemeSwitch />


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
             <Ramp price={price} address={address} networks={NETWORKS}/>
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
                 <Faucet localProvider={localProvider} price={price} ensProvider={mainnetProvider}/>
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

 window.ethereum && window.ethereum.on('chainChanged', chainId => {
  web3Modal.cachedProvider &&
  setTimeout(() => {
    window.location.reload();
  }, 1);
})

 window.ethereum && window.ethereum.on('accountsChanged', accounts => {
  web3Modal.cachedProvider &&
  setTimeout(() => {
    window.location.reload();
  }, 1);
})

export default App;
