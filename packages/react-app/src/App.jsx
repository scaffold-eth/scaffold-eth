import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { Row, Col, Card, Button, Menu, Alert, List, Input, Divider } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader } from "./hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge, Balance, Address, EtherInput, AddressInput } from "./components";
import { Transactor } from "./helpers";
import { formatEther, parseEther } from "@ethersproject/units";
import { Hints, ExampleUI, Subgraph } from "./views"
import { INFURA_ID, DAI_ADDRESS, DAI_ABI, NETWORK, NETWORKS } from "./constants";
const humanizeDuration = require("humanize-duration");
/*
    Welcome to 🏗 scaffold-eth !

    Code:
    https://github.com/austintgriffith/scaffold-eth

    Support:
    https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA
    or DM @austingriffith on twitter or telegram

    You should get your own Infura.io ID and put it in `constants.js`
    (this is your connection to the main Ethereum network for ENS etc.)


    📡 EXTERNAL CONTRACTS:
    You can also bring in contract artifacts in `constants.js`
    (and then use the `useExternalContractLoader()` hook!)
*/

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS['localhost']; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true

// 🛰 providers
if(DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if(DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;


function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork,mainnetProvider);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork,"fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProvider = useUserProvider(injectedProvider, localProvider);
  const address = useUserAddress(userProvider);
  if(DEBUG) console.log("👩‍💼 selected address:",address)

  // You can warn the user if you would like them to be on a specific network
  let localChainId = localProvider && localProvider._network && localProvider._network.chainId
  if(DEBUG) console.log("🏠 localChainId",localChainId)

  let selectedChainId = userProvider && userProvider._network && userProvider._network.chainId
  if(DEBUG) console.log("🕵🏻‍♂️ selectedChainId:",selectedChainId)

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userProvider, gasPrice)

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice)

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);
  if(DEBUG) console.log("💵 yourLocalBalance",yourLocalBalance?formatEther(yourLocalBalance):"...")

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);
  if(DEBUG) console.log("💵 yourMainnetBalance",yourMainnetBalance?formatEther(yourMainnetBalance):"...")

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  if(DEBUG) console.log("📝 readContracts",readContracts)

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)
  if(DEBUG) console.log("🔐 writeContracts",writeContracts)

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  //const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI)
  //console.log("🥇DAI contract on mainnet:",mainnetDAIContract)
  //
  // Then read your DAI balance like:
  //const myMainnetBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])
  //


  const vendorAddress = readContracts && readContracts.Vendor && readContracts.Vendor.address

  const vendorETHBalance = useBalance(localProvider, vendorAddress);
  if(DEBUG) console.log("💵 vendorETHBalance", vendorETHBalance ? formatEther(vendorETHBalance) : '...')

  const vendorTokenBalance = useContractReader(readContracts, "YourToken", "balanceOf", [ vendorAddress ])
  console.log("🏵 vendorTokenBalance:", vendorTokenBalance ? formatEther(vendorTokenBalance) : '...')

  const yourTokenBalance = useContractReader(readContracts, "YourToken", "balanceOf", [ address ])
  console.log("🏵 yourTokenBalance:", yourTokenBalance ? formatEther(yourTokenBalance) : '...')

  const tokensPerEth = useContractReader(readContracts, "Vendor", "tokensPerEth")
  console.log("🏦 tokensPerEth:", tokensPerEth ? tokensPerEth.toString() : '...')


  // const complete = useContractReader(readContracts,"ExampleExternalContract", "completed")
  // console.log("✅ complete:",complete)
  //
  // const exampleExternalContractBalance = useBalance(localProvider, readContracts && readContracts.ExampleExternalContract.address);
  // if(DEBUG) console.log("💵 exampleExternalContractBalance", exampleExternalContractBalance )

  // let completeDisplay = ""
  // if(false){
  //   completeDisplay = (
  //     <div style={{padding:64, backgroundColor:"#eeffef", fontWeight:"bolder"}}>
  //       🚀 🎖 👩‍🚀  -  Staking App triggered `ExampleExternalContract` -- 🎉  🍾   🎊
  //       <Balance
  //         balance={0}
  //         fontSize={64}
  //       /> ETH staked!
  //     </div>
  //   )
  // }

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */
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
  const [ faucetClicked, setFaucetClicked ] = useState( false );
    if(!faucetClicked&&localProvider&&localProvider._network&&localProvider._network.chainId==31337&&yourLocalBalance&&formatEther(yourLocalBalance)<=0){
    faucetHint = (
      <div style={{padding:16}}>
        <Button type={"primary"} onClick={()=>{
          faucetTx({
            to: address,
            value: parseEther("1"),
          });
          setFaucetClicked(true)
        }}>
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    )
  }

  const buyTokensEvents = useEventListener(readContracts, "Vendor", "BuyTokens", localProvider, 1);
  console.log("📟 buyTokensEvents:",buyTokensEvents)

  const [ tokenBuyAmount, setTokenBuyAmount ] = useState()

  const ethCostToPurchaseTokens = tokenBuyAmount && tokensPerEth &&  parseEther(""+(tokenBuyAmount / parseFloat(tokensPerEth)))
  console.log("ethCostToPurchaseTokens:",ethCostToPurchaseTokens)

  const [ tokenSendToAddress, setTokenSendToAddress ] = useState()
  const [ tokenSendAmount, setTokenSendAmount ] = useState()

  const [ buying, setBuying ] = useState()

  let transferDisplay = ""
  if(yourTokenBalance){
    transferDisplay = (
      <div style={{padding:8, marginTop: 32, width: 420, margin:"auto" }}>
        <Card title="Transfer tokens" >
          <div>
            <div style={{padding:8}}>
              <AddressInput
                ensProvider={mainnetProvider}
                placeholder="to address"
                value={tokenSendToAddress}
                onChange={setTokenSendToAddress}
              />
            </div>
            <div style={{padding:8}}>
              <Input
                style={{textAlign:"center"}}
                placeholder={"amount of tokens to send"}
                value={tokenSendAmount}
                onChange={(e)=>{setTokenSendAmount(e.target.value)}}
              />
            </div>
          </div>
          <div style={{padding:8}}>
            <Button type={"primary"} onClick={()=>{
              tx( writeContracts.YourToken.transfer(tokenSendToAddress,parseEther(""+tokenSendAmount)) )
            }}>Send Tokens</Button>
          </div>

        </Card>
      </div>
    )
  }

  return (
    <div className="App">

      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}
      <BrowserRouter>

        <Menu style={{ textAlign:"center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link onClick={()=>{setRoute("/")}} to="/">YourToken</Link>
          </Menu.Item>
          <Menu.Item key="/contracts">
            <Link onClick={()=>{setRoute("/contracts")}} to="/contracts">Debug Contracts</Link>
          </Menu.Item>
        </Menu>

        <Switch>
          <Route exact path="/">
          <div style={{padding:8, marginTop: 32 ,width: 300, margin:"auto" }}>
            <Card title="Your Tokens" extra={<a href="#">code</a>} >
              <div style={{padding:8}}>
                <Balance
                  balance={yourTokenBalance}
                  fontSize={64}
                />
              </div>
            </Card>
          </div>
          {transferDisplay}
              <Divider/>
          <div style={{padding:8, marginTop: 32 ,width: 300, margin:"auto" }}>
            <Card title="Buy Tokens" extra={<a href="#">code</a>} >

              <div style={{padding:8}}>
                {tokensPerEth && tokensPerEth.toNumber()} tokens per ETH
              </div>

              <div style={{padding:8}}>
                <Input
                  style={{textAlign:"center"}}
                  placeholder={"amount of tokens to buy"}
                  value={tokenBuyAmount}
                  onChange={(e)=>{setTokenBuyAmount(e.target.value)}}
                />
                <Balance
                  balance={ethCostToPurchaseTokens}
                  dollarMultiplier={price}
                />
              </div>

              <div style={{padding:8}}>
                <Button type={"primary"} loading={buying} onClick={async ()=>{
                  setBuying(true)
                  await tx( writeContracts.Vendor.buyTokens({value: ethCostToPurchaseTokens}) )
                  setBuying(false)
                }}>Buy Tokens</Button>
              </div>

            </Card>
          </div>










          <div style={{padding:8, marginTop: 32}}>
            <div>Vendor Token Balance:</div>
            <Balance
              balance={vendorTokenBalance}
              fontSize={64}
            />
          </div>


          <div style={{padding:8}}>
            <div>Vendor ETH Balance:</div>
            <Balance
              balance={vendorETHBalance}
              fontSize={64}
            /> ETH
          </div>

          <div style={{width:500, margin:"auto",marginTop:64}}>
            <div>Buy Token Events:</div>
            <List
              dataSource={buyTokensEvents}
              renderItem={(item) => {
                return (
                  <List.Item key={item[0]+item[1]+item.blockNumber}>
                    <Address
                        value={item[0]}
                        ensProvider={mainnetProvider}
                        fontSize={16}
                      /> paid
                      <Balance
                        balance={item[1]}

                      />ETH to get

                      <Balance
                        balance={item[2]}

                      />Tokens
                  </List.Item>
                )
              }}
            />
          </div>


            {/*



                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally



*/}



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
          <Route path="/contracts">
            <Contract
              name="Vendor"
              signer={userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
            <Contract
              name="YourToken"
              signer={userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
          </Route>
        </Switch>
      </BrowserRouter>


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

      <div style={{marginTop:32,opacity:0.5}}>Created by <Address
        value={"Your...address"}
        ensProvider={mainnetProvider}
        fontSize={16}
      /></div>

      <div style={{marginTop:32,paddingBottom:128,opacity:0.5}}><a target="_blank" style={{padding:32,color:"#000"}} href="https://github.com/austintgriffith/scaffold-eth">🍴 Fork me!</a></div>

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
               localProvider && localProvider.connection && localProvider.connection.url && localProvider.connection.url.indexOf(window.location.hostname)>=0 && !process.env.REACT_APP_PROVIDER && price > 1 ? (
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
  setTimeout(() => {
    window.location.reload();
  }, 1);
})

export default App;
