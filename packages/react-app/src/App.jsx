import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import {  LinkOutlined } from "@ant-design/icons"
import "./App.css";
import { Row, Col, Button, Menu, Alert, Input, List, Card, Switch as SwitchD } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader } from "./hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge, Address, AddressInput, ThemeSwitch } from "./components";
import { Transactor } from "./helpers";
import { formatEther, parseEther } from "@ethersproject/units";
import { utils, ethers } from "ethers";
//import Hints from "./Hints";
import { Hints, ExampleUI, Subgraph } from "./views"
import { useThemeSwitcher } from "react-css-theme-switcher";
import { INFURA_ID, DAI_ADDRESS, DAI_ABI, NETWORK, NETWORKS } from "./constants";
import StackGrid from "react-stack-grid";
import ReactJson from 'react-json-view'
import assets from './assets.js'

const { BufferList } = require('bl')
// https://www.npmjs.com/package/ipfs-http-client
const ipfsAPI = require('ipfs-http-client');
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

console.log("📦 Assets: ",assets)

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

//EXAMPLE STARTING JSON:
const STARTING_JSON = {
  "description": "It's actually a bison?",
  "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
  "image": "https://austingriffith.com/images/paintings/buffalo.jpg",
  "name": "Buffalo",
  "attributes": [
     {
       "trait_type": "BackgroundColor",
       "value": "green"
     },
     {
       "trait_type": "Eyes",
       "value": "googly"
     }
  ]
}

//helper function to "Get" from IPFS
// you usually go content.toString() after this...
const getFromIPFS = async hashToGet => {
  for await (const file of ipfs.get(hashToGet)) {
    console.log(file.path)
    if (!file.content) continue;
    const content = new BufferList()
    for await (const chunk of file.content) {
      content.append(chunk)
    }
    console.log(content)
    return content
  }
}

// 🛰 providers
if(DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
const scaffoldEthProvider = new JsonRpcProvider("https://rpc.scaffoldeth.io:48544")
const mainnetInfura = new JsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if(DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new JsonRpcProvider(localProviderUrlFromEnv);


// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;


function App(props) {

  const mainnetProvider = (scaffoldEthProvider && scaffoldEthProvider._network) ? scaffoldEthProvider : mainnetInfura
  if(DEBUG) console.log("🌎 mainnetProvider",mainnetProvider)

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
  const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI)
  console.log("🌍 DAI contract on mainnet:",mainnetDAIContract)
  //
  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])
  console.log("🥇 myMainnetDAIBalance:",myMainnetDAIBalance)


  // keep track of a variable from the contract in the local React state:
  const balance = useContractReader(readContracts,"MoonshotBot", "balanceOf", [ address ])
  console.log("🤗 balance:",balance)

  const priceToMint = useContractReader(readContracts,"MoonshotBot", "price")
  console.log("🤗 priceToMint:",priceToMint)


  //📟 Listen for broadcast events
  const transferEvents = useEventListener(readContracts, "MoonshotBot", "Transfer", localProvider, 1);
  console.log("📟 Transfer events:",transferEvents)



  //
  // 🧠 This effect will update yourCollectibles by polling when your balance changes
  //
  const yourBalance = balance && balance.toNumber && balance.toNumber()
  const [ yourCollectibles, setYourCollectibles ] = useState()

  useEffect(()=>{
    const updateYourCollectibles = async () => {
      let collectibleUpdate = []
      for(let tokenIndex=0;tokenIndex<balance;tokenIndex++){
        try{
          console.log("GEtting token index",tokenIndex)
          const tokenId = await readContracts.MoonshotBot.tokenOfOwnerByIndex(address, tokenIndex)
          console.log("tokenId",tokenId)
          const tokenURI = await readContracts.MoonshotBot.tokenURI(tokenId)
          console.log("tokenURI",tokenURI)

          const ipfsHash =  tokenURI.replace("https://gateway.pinata.cloud/ipfs/","")
          console.log("ipfsHash",ipfsHash)

          const jsonManifestBuffer = await getFromIPFS(ipfsHash)

          try{
            const jsonManifest = JSON.parse(jsonManifestBuffer.toString())
            console.log("jsonManifest",jsonManifest)
            collectibleUpdate.push({ id:tokenId, uri:tokenURI, owner: address, ...jsonManifest })
          }catch(e){console.log(e)}

        }catch(e){console.log(e)}
      }
      setYourCollectibles(collectibleUpdate)
    }
    updateYourCollectibles()
  },[ address, yourBalance ])

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
  const faucetAvailable = localProvider && localProvider.connection && localProvider.connection.url && localProvider.connection.url.indexOf(window.location.hostname)>=0 && !process.env.REACT_APP_PROVIDER && price > 1;

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
  }


  const [ yourJSON, setYourJSON ] = useState( STARTING_JSON );
  const [ sending, setSending ] = useState()
  const [ ipfsHash, setIpfsHash ] = useState()
  const [ ipfsDownHash, setIpfsDownHash ] = useState()

  const [ downloading, setDownloading ] = useState()
  const [ ipfsContent, setIpfsContent ] = useState()

  const [ transferToAddresses, setTransferToAddresses ] = useState({})

  const [ loadedAssets, setLoadedAssets ] = useState()
  useEffect(()=>{
    const updateYourCollectibles = async () => {
      let assetUpdate = []
      for(let a in assets){
        try{
          const forSale = await readContracts.YourCollectible.forSale(utils.id(a))
          let owner
          if(!forSale){
            const tokenId = await readContracts.YourCollectible.uriToTokenId(utils.id(a))
            owner = await readContracts.YourCollectible.ownerOf(tokenId)
          }
          assetUpdate.push({id:a,...assets[a],forSale:forSale,owner:owner})
        }catch(e){console.log(e)}
      }
      setLoadedAssets(assetUpdate)
    }
    if(readContracts && readContracts.YourCollectible) updateYourCollectibles()
  }, [ assets, readContracts, transferEvents ]);

  let galleryList = []
  for(let a in loadedAssets){
    console.log("loadedAssets",a,loadedAssets[a])

    let cardActions = []
    if(loadedAssets[a].forSale){
      cardActions.push(
        <div>
          <Button onClick={()=>{
            console.log("gasPrice,",gasPrice)
            tx( writeContracts.YourCollectible.mintItem(loadedAssets[a].id,{
              value: parseEther("1"),
              gasPrice:gasPrice
            }) )
          }}>
             BUY (1 ETH)
          </Button>
        </div>
      )
    }else{
      cardActions.push(
        <div>
          owned by: <Address
            address={loadedAssets[a].owner}
            ensProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            minimized={true}
          />
        </div>
      )
    }

    galleryList.push(
      <Card style={{width:200}} key={loadedAssets[a].name}
        actions={cardActions}
        title={(
          <div>
            {loadedAssets[a].name} <a style={{cursor:"pointer",opacity:0.33}} href={loadedAssets[a].external_url} target="_blank"><LinkOutlined /></a>
          </div>
        )}
      >
        <img style={{maxWidth:130}} src={loadedAssets[a].image}/>
        <div style={{opacity:0.77}}>
          {loadedAssets[a].description}
        </div>
      </Card>
    )
  }

  return (
    <div className="App">

      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}

      <BrowserRouter>


        <Switch>
          <Route exact path="/">
            {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally

            <div style={{ maxWidth:820, margin: "auto", marginTop:32, paddingBottom:256 }}>
              <StackGrid
                columnWidth={200}
                gutterWidth={16}
                gutterHeight={16}
              >
                {galleryList}
              </StackGrid>
            </div>
            */}


            <img src="moon.svg"/>

            <h1><img src="logo.png" />Moonshot Bots</h1>
            <h2>An Ultra-Rare PFP (175 supply) by <a href="https://twitter.com/owocki">@owocki</a> & <a href="https://twitter.com/austingriffith">@austingriffith</a></h2>
            <h3>Seeded with &lt;3 for early BUIDLers in the <a href="https://moonshotcollective.space">Moonshot Collective</a></h3>


            <div style={{padding:32}}>
              <Button type={"primary"} onClick={async ()=>{
                let price = await readContracts.MoonshotBot.price()
                tx( writeContracts.MoonshotBot.requestMint(address,{value: price}) )
              }}>MINT for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}</Button>

              <div style={{paddingTop:8}}>
                ( All funds will go to fund public goods on Gitcoin. )
              </div>
            </div>




            {yourCollectibles && yourCollectibles.length>0 ?
              <div style={{ width:640, margin: "auto", marginTop:32, paddingBottom:32 }}>
                <h2>Your MoonshotBots</h2>
                <List
                  bordered
                  dataSource={yourCollectibles}
                  renderItem={(item) => {
                    const id = item.id.toNumber()
                    return (
                      <List.Item>
                        <Card title={(
                          <div>
                            <span style={{fontSize:16, marginRight:8}}>#{id}</span> {item.name}
                          </div>
                        )}>
                          <div><img src={item.image} style={{maxWidth:150}} /></div>
                          <div>{item.description}</div>
                        </Card>

                        <div>
                          owner: <Address
                              address={item.owner}
                              ensProvider={mainnetProvider}
                              blockExplorer={blockExplorer}
                              fontSize={16}
                          />
                          <AddressInput
                            ensProvider={mainnetProvider}
                            placeholder="transfer to address"
                            value={transferToAddresses[id]}
                            onChange={(newValue)=>{
                              let update = {}
                              update[id] = newValue
                              setTransferToAddresses({ ...transferToAddresses, ...update})
                            }}
                          />
                          <Button onClick={()=>{
                            console.log("writeContracts",writeContracts)
                            tx( writeContracts.MoonshotBot.transferFrom(address, transferToAddresses[id], id) )
                          }}>
                            Transfer
                          </Button>
                        </div>
                      </List.Item>
                    )
                  }}
                />
              </div>:

            <div id="preview">
            <img src='nfts/Adelyn.png'/>
            <img src='nfts/Cairo.png'/>
            <img src='nfts/Dominic.png'/>
            <img src='nfts/Harlow.png'/>
            <img src='nfts/Khaleesi.png'/>
            <img src='nfts/Meredith.png'/>
            <img src='nfts/Ryan.png'/>
            <img src='nfts/Adler.png'/>
            <img src='nfts/Cal.png'/>
            <img src='nfts/Donald.png'/>
            <img src='nfts/Harmony.png'/>
            <img src='nfts/Killian.png'/>
            <img src='nfts/Michael.png'/>
            <img src='nfts/Ryann.png'/>
            <img src='nfts/Ahmir.png'/>
            <img src='nfts/Callan.png'/>
            <img src='nfts/Dorian.png'/>
            <img src='nfts/Hope.png'/>
            <img src='nfts/Kolton.png'/>
            <img src='nfts/Milana.png'/>
            <img src='nfts/Saoirse.png'/>
            <img src='nfts/Alaya.png'/>
            <img src='nfts/Cameron.png'/>
            <img src='nfts/Dream.png'/>
            <img src='nfts/Ian.png'/>
            <img src='nfts/Kora.png'/>
            <img src='nfts/Mohammad.png'/>
            <img src='nfts/Sincere.png'/>
            <img src='nfts/Albert.png'/>
            <img src='nfts/Cannon.png'/>
            <img src='nfts/Edwin.png'/>
            <img src='nfts/Ibrahim.png'/>
            <img src='nfts/Lainey.png'/>
            <img src='nfts/Molly.png'/>
            <img src='nfts/Skye.png'/>
            <img src='nfts/Alden.png'/>
            <img src='nfts/Carlos.png'/>
            <img src='nfts/Elaine.png'/>
            <img src='nfts/Indie.png'/>
            <img src='nfts/Laurel.png'/>
            <img src='nfts/Myles.png'/>
            <img src='nfts/Solomon.png'/>
            <img src='nfts/Alessandro.png'/>
            <img src='nfts/Carly.png'/>
            <img src='nfts/Eliana.png'/>
            <img src='nfts/Israel.png'/>
            <img src='nfts/Layton.png'/>
            <img src='nfts/Nathanael.png'/>
            <img src='nfts/Steven.png'/>
            <img src='nfts/Alex.png'/>
            <img src='nfts/Case.png'/>
            <img src='nfts/Elianna.png'/>
            <img src='nfts/Izaiah.png'/>
            <img src='nfts/Leandro.png'/>
            <img src='nfts/Nellie.png'/>
            <img src='nfts/Talon.png'/>
            <img src='nfts/Alexis.png'/>
            <img src='nfts/Casen.png'/>
            <img src='nfts/Elizabeth.png'/>
            <img src='nfts/Jake.png'/>
            <img src='nfts/Leonard.png'/>
            <img src='nfts/Nicholas.png'/>
            <img src='nfts/Taylor.png'/>
            <img src='nfts/Alia.png'/>
            <img src='nfts/Cayson.png'/>
            <img src='nfts/Elliana.png'/>
            <img src='nfts/Jalen.png'/>
            <img src='nfts/Lexie.png'/>
            <img src='nfts/Niko.png'/>
            <img src='nfts/Tessa.png'/>
            <img src='nfts/Alyssa.png'/>
            <img src='nfts/Cesar.png'/>
            <img src='nfts/Ellianna.png'/>
            <img src='nfts/Jase.png'/>
            <img src='nfts/Liana.png'/>
            <img src='nfts/Oaklyn.png'/>
            <img src='nfts/Theo.png'/>
            <img src='nfts/Amora.png'/>
            <img src='nfts/Charlie.png'/>
            <img src='nfts/Elyse.png'/>
            <img src='nfts/Jaxtyn.png'/>
            <img src='nfts/Liliana.png'/>
            <img src='nfts/Oaklynn.png'/>
            <img src='nfts/Tomas.png'/>
            <img src='nfts/Anakin.png'/>
            <img src='nfts/Claire.png'/>
            <img src='nfts/Evan.png'/>
            <img src='nfts/Jay.png'/>
            <img src='nfts/Linda.png'/>
            <img src='nfts/Paisley.png'/>
            <img src='nfts/Ty.png'/>
            <img src='nfts/Angelina.png'/>
            <img src='nfts/Clark.png'/>
            <img src='nfts/Evangeline.png'/>
            <img src='nfts/Jeffrey.png'/>
            <img src='nfts/Liv.png'/>
            <img src='nfts/Parker.png'/>
            <img src='nfts/Tyler.png'/>
            <img src='nfts/Annabella.png'/>
            <img src='nfts/Clementine.png'/>
            <img src='nfts/Eve.png'/>
            <img src='nfts/Jianna.png'/>
            <img src='nfts/Lucca.png'/>
            <img src='nfts/Paul.png'/>
            <img src='nfts/Van.png'/>
            <img src='nfts/Ariel.png'/>
            <img src='nfts/Coen.png'/>
            <img src='nfts/Everett.png'/>
            <img src='nfts/Jude.png'/>
            <img src='nfts/Luciana.png'/>
            <img src='nfts/Penelope.png'/>
            <img src='nfts/Walter.png'/>
            <img src='nfts/Ariyah.png'/>
            <img src='nfts/Corey.png'/>
            <img src='nfts/Evie.png'/>
            <img src='nfts/Judith.png'/>
            <img src='nfts/Madisyn.png'/>
            <img src='nfts/Peter.png'/>
            <img src='nfts/Watson.png'/>
            <img src='nfts/Arthur.png'/>
            <img src='nfts/Dakari.png'/>
            <img src='nfts/Fallon.png'/>
            <img src='nfts/Julian.png'/>
            <img src='nfts/Makenna.png'/>
            <img src='nfts/Presley.png'/>
            <img src='nfts/Westin.png'/>
            <img src='nfts/Axl.png'/>
            <img src='nfts/Dallas.png'/>
            <img src='nfts/Finley.png'/>
            <img src='nfts/Julio.png'/>
            <img src='nfts/Malaya.png'/>
            <img src='nfts/Quinn.png'/>
            <img src='nfts/Ximena.png'/>
            <img src='nfts/Axton.png'/>
            <img src='nfts/Daniel.png'/>
            <img src='nfts/Gary.png'/>
            <img src='nfts/Kade.png'/>
            <img src='nfts/Marcos.png'/>
            <img src='nfts/Quinton.png'/>
            <img src='nfts/Yousef.png'/>
            <img src='nfts/Belen.png'/>
            <img src='nfts/Danielle.png'/>
            <img src='nfts/Georgia.png'/>
            <img src='nfts/Kairi.png'/>
            <img src='nfts/Marianna.png'/>
            <img src='nfts/Raven.png'/>
            <img src='nfts/Zainab.png'/>
            <img src='nfts/Braden.png'/>
            <img src='nfts/Danny.png'/>
            <img src='nfts/Grace.png'/>
            <img src='nfts/Kamari.png'/>
            <img src='nfts/Marleigh.png'/>
            <img src='nfts/Rhea.png'/>
            <img src='nfts/Zelda.png'/>
            <img src='nfts/Bradley.png'/>
            <img src='nfts/Darwin.png'/>
            <img src='nfts/Halo.png'/>
            <img src='nfts/Kareem.png'/>
            <img src='nfts/Mateo.png'/>
            <img src='nfts/Rhett.png'/>
            <img src='nfts/Zola.png'/>
            <img src='nfts/Brecken.png'/>
            <img src='nfts/Davis.png'/>
            <img src='nfts/Hana.png'/>
            <img src='nfts/Kash.png'/>
            <img src='nfts/Maxwell.png'/>
            <img src='nfts/Rhys.png'/>
            <img src='nfts/Brinley.png'/>
            <img src='nfts/Daxton.png'/>
            <img src='nfts/Hanna.png'/>
            <img src='nfts/Kashton.png'/>
            <img src='nfts/Mckinley.png'/>
            <img src='nfts/Rosemary.png'/>
            <img src='nfts/Brynlee.png'/>
            <img src='nfts/Della.png'/>
            <img src='nfts/Hannah.png'/>
            <img src='nfts/Kayson.png'/>
            <img src='nfts/Melissa.png'/>
            <img src='nfts/Royal.png'/>
            </div>}



            <footer style={{padding:64}}>
              <a style={{padding:8}} href="https://github.com/austintgriffith/scaffold-eth/tree/moonshot-bots-with-curve">Github</a>
               |
              <a style={{padding:8}} href="https://opensea.io/collection/moonshotbots">OpenSea</a>
              |
              <a style={{padding:8}} href="https://etherscan.io/address/0x87EB118B004579fd82ddEd7F8e9d261A03172Ef1#writeContract">EtherScan</a>
              |
              <a style={{padding:8}} href="https://moonshotcollective.space">Moonshot Collective</a>

              </footer>


          </Route>


          <Route path="/transfers">
            <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
              <List
                bordered
                dataSource={transferEvents}
                renderItem={(item) => {
                  return (
                    <List.Item key={item[0]+"_"+item[1]+"_"+item.blockNumber+"_"+item[2].toNumber()}>
                      <span style={{fontSize:16, marginRight:8}}>#{item[2].toNumber()}</span>
                      <Address
                          address={item[0]}
                          ensProvider={mainnetProvider}
                          fontSize={16}
                      /> =>
                      <Address
                          address={item[1]}
                          ensProvider={mainnetProvider}
                          fontSize={16}
                      />
                    </List.Item>
                  )
                }}
              />
            </div>
          </Route>

          <Route path="/ipfsup">
            <div style={{ paddingTop:32, width:740, margin:"auto", textAlign:"left" }}>
              <ReactJson
                style={{ padding:8 }}
                src={yourJSON}
                theme={"pop"}
                enableClipboard={false}
                onEdit={(edit,a)=>{
                  setYourJSON(edit.updated_src)
                }}
                onAdd={(add,a)=>{
                  setYourJSON(add.updated_src)
                }}
                onDelete={(del,a)=>{
                  setYourJSON(del.updated_src)
                }}
              />
            </div>

            <Button style={{margin:8}} loading={sending} size="large" shape="round" type="primary" onClick={async()=>{
                console.log("UPLOADING...",yourJSON)
                setSending(true)
                setIpfsHash()
                const result = await ipfs.add(JSON.stringify(yourJSON))//addToIPFS(JSON.stringify(yourJSON))
                if(result && result.path) {
                  setIpfsHash(result.path)
                }
                setSending(false)
                console.log("RESULT:",result)
            }}>Upload to IPFS</Button>

            <div  style={{padding:16,paddingBottom:150}}>
              {ipfsHash}
            </div>

          </Route>
          <Route path="/ipfsdown">
              <div style={{ paddingTop:32, width:740, margin:"auto" }}>
                <Input
                  value={ipfsDownHash}
                  placeHolder={"IPFS hash (like QmadqNw8zkdrrwdtPFK1pLi8PPxmkQ4pDJXY8ozHtz6tZq)"}
                  onChange={(e)=>{
                    setIpfsDownHash(e.target.value)
                  }}
                />
              </div>
              <Button style={{margin:8}} loading={sending} size="large" shape="round" type="primary" onClick={async()=>{
                  console.log("DOWNLOADING...",ipfsDownHash)
                  setDownloading(true)
                  setIpfsContent()
                  const result = await getFromIPFS(ipfsDownHash)//addToIPFS(JSON.stringify(yourJSON))
                  if(result && result.toString) {
                    setIpfsContent(result.toString())
                  }
                  setDownloading(false)
              }}>Download from IPFS</Button>

              <pre  style={{padding:16, width:500, margin:"auto",paddingBottom:150}}>
                {ipfsContent}
              </pre>
          </Route>
          <Route path="/debugcontracts">
              <Contract
                name="MoonshotBot"
                signer={userProvider.getSigner()}
                provider={localProvider}
                address={address}
                blockExplorer={blockExplorer}
              />
          </Route>
        </Switch>
      </BrowserRouter>

      {/*}<ThemeSwitch />*/}


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
  setTimeout(() => {
    window.location.reload();
  }, 1);
})

export default App;
