import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import {  LinkOutlined } from "@ant-design/icons"
import "./App.css";
import {
  Row,
  Col,
  Button,
  Menu,
  Alert,
  Input,
  List,
  Card,
  Switch as SwitchD,
  Modal,
  InputNumber,
  Tooltip,
  notification
} from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { format } from "date-fns";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader } from "./hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge, Address, AddressInput, ThemeSwitch } from "./components";
import { Transactor } from "./helpers";
import { formatEther, parseEther } from "@ethersproject/units";
import { utils, BigNumber, constants } from "ethers";
import { getSignature } from './helpers';
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
const targetNetwork = NETWORKS['localhost']; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = false

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
  if (DEBUG) console.log("🌍 DAI contract on mainnet:",mainnetDAIContract)
  //
  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])
  if (DEBUG)console.log("🥇 myMainnetDAIBalance:",myMainnetDAIBalance)


  // keep track of a variable from the contract in the local React state:
  const balance = useContractReader(readContracts,"YourCollectible", "balanceOf", [ address ])
  if (DEBUG) console.log("🤗 balance:",balance)

  const stakedEth = useContractReader(readContracts, "Auction", "getStakeInfo", [address])

  //📟 Listen for broadcast events
  const transferEvents = useEventListener(readContracts, "YourCollectible", "Transfer", localProvider, 1);
  if (DEBUG) console.log("📟 Transfer events:",transferEvents)


  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [auctionDetails, setAuctionDetails] = useState({price: "", duration: ""});
  const [auctionToken, setAuctionToken] = useState("");
  const [viewAuctionToken, setViewAuctionToken] = useState("");

  //
  // 🧠 This effect will update yourCollectibles by polling when your balance changes
  //
  const yourBalance = balance && balance.toNumber && balance.toNumber()
  const [ yourCollectibles, setYourCollectibles ] = useState()

  // useEffect(()=>{
  //   const updateYourCollectibles = async () => {
  //     let collectibleUpdate = []
  //     for(let tokenIndex=0;tokenIndex<balance;tokenIndex++){
  //       try{
  //         console.log("GEtting token index",tokenIndex)
  //         const tokenId = await readContracts.YourCollectible.tokenOfOwnerByIndex(address, tokenIndex)
  //         console.log("tokenId",tokenId)
  //         const tokenURI = await readContracts.YourCollectible.tokenURI(tokenId)
  //         console.log("tokenURI",tokenURI)
  //
  //         const ipfsHash =  tokenURI.replace("https://ipfs.io/ipfs/","")
  //         console.log("ipfsHash",ipfsHash)
  //
  //         const jsonManifestBuffer = await getFromIPFS(ipfsHash)
  //
  //         try{
  //           const jsonManifest = JSON.parse(jsonManifestBuffer.toString())
  //           // console.log("jsonManifest",jsonManifest)
  //           collectibleUpdate.push({ id:tokenId, uri:tokenURI, owner: address, ...jsonManifest })
  //         }catch(e){console.log(e)}
  //
  //       }catch(e){console.log(e)}
  //     }
  //     setYourCollectibles(collectibleUpdate)
  //   }
  //   updateYourCollectibles()
  // },[ address, yourBalance ])

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

  const [stakeAmount, setStakeAmount] = useState(0);

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
  const [yourBid, setYourBid] = useState({});
  const [stakedAmount, setStakedAmount] = useState({});

  const [ transferToAddresses, setTransferToAddresses ] = useState({})

  const [ loadedAssets, setLoadedAssets ] = useState()
  const updateYourCollectibles = async () => {
    let assetUpdate = []
    for(let a in assets){
      try{
        const forSale = await readContracts.YourCollectible.forSale(utils.id(a))
        let owner
        let auctionInfo
        let bidsInfo = {}
        let stake = 0.0;
        if(!forSale){
          const tokenId = await readContracts.YourCollectible.uriToTokenId(utils.id(a))
          owner = await readContracts.YourCollectible.ownerOf(tokenId)
          const nftAddress = readContracts.YourCollectible.address;
          auctionInfo = await readContracts.Auction.getTokenAuctionDetails(nftAddress, tokenId);
          stake = await readContracts.Auction.getStakeInfo(nftAddress, tokenId, address);
          try {
            bidsInfo = await fetch(`http://localhost:8001/${a}`).then(data => data.json());
          } catch {
            bidsInfo = {}
          }
        }

        assetUpdate.push({id:a,...assets[a],forSale:forSale,owner:owner, auctionInfo, bidsInfo, stake})
      }catch(e){console.log(e)}
    }
    setLoadedAssets(assetUpdate)
  }
  useEffect(()=>{
    if(readContracts && readContracts.YourCollectible) updateYourCollectibles()
  }, [ assets, readContracts, transferEvents ]);

  const startAuction = (tokenUri) => {
    return async () => {
      setAuctionToken(tokenUri);
      setModalVisible(true);
    }
  }

  const clearTokenUri = async (tokenUri) => {
    await fetch('http://localhost:8001/clearAddress', {
      method: 'POST',
      mode: "cors",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: tokenUri,
      })
    });
    updateYourCollectibles();
  }

  const placeBid = async (loadedAsset, ethAmount) => {
    const tokenUri = loadedAsset.id;
    const tokenId = await readContracts.YourCollectible.uriToTokenId(utils.id(tokenUri));
    const nftAddress = readContracts.YourCollectible.address;
    const parsedAmount = parseEther(ethAmount.toString());
    const minPrice = loadedAsset.auctionInfo.price

    if (parsedAmount.gt(loadedAsset.stake) || parsedAmount.lt(minPrice)) {
      return notification.error({
        message: "Invalid amount for bid",
        description: "This bid is not allowed. It is either less than minimum price or you do not have enough staked ETH.",
      });
    }
    const signature = await getSignature(userProvider, address, ['uint256', 'address', 'address', 'uint256'], [tokenId, nftAddress, address, parsedAmount]);
    await fetch('http://localhost:8001/', {
      method: 'POST',
      mode: "cors",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: tokenUri,
        hash: signature,
        id: tokenId.toString(),
        nft: nftAddress,
        bidder: address,
        amount: parsedAmount.toString()
      })
    });
    updateYourCollectibles();
  }

  const completeAuction = async (loadedAsset, bidInfo) => {
    console.log('WINNER:', loadedAsset, bidInfo);
    const nftAddress = readContracts.YourCollectible.address;
    const tokenId = await readContracts.YourCollectible.uriToTokenId(utils.id(loadedAsset.id));

    const signedBid = {
      id: tokenId,
      nft: nftAddress,
      bidder: bidInfo.bidder,
      amount: BigNumber.from(bidInfo.amount)
    }

    console.log('signedBid', { signedBid });
    console.log('signature', bidInfo.hash);

    await tx(writeContracts.Auction.executeSale(nftAddress, tokenId, bidInfo.bidder, BigNumber.from(bidInfo.amount), bidInfo.hash));
    updateYourCollectibles();
    clearTokenUri(loadedAsset.id);

    // return async () => {
    //   const tokenId = await readContracts.YourCollectible.uriToTokenId(utils.id(tokenUri));
    //   const nftAddress = readContracts.YourCollectible.address;
    //   await tx(writeContracts.Auction.executeSale(nftAddress, tokenId));
    //   updateYourCollectibles();
    // }
  }

  const cancelAuction = (loadedAsset) => {
    const tokenUri = loadedAsset.id;
    const { bidsInfo } = loadedAsset;

    const bidders = Object.entries(bidsInfo).map(([_, bidInfo]) => bidInfo.bidder);

    return async () => {
      const tokenId = await readContracts.YourCollectible.uriToTokenId(utils.id(tokenUri));
      const nftAddress = readContracts.YourCollectible.address;
      await tx(writeContracts.Auction.cancelAuction(nftAddress, tokenId, bidders));
      updateYourCollectibles();
      clearTokenUri(tokenUri);
    }
  }

  const stakeEth = async (loadedAsset) => {
    const nftAddress = readContracts.YourCollectible.address;
    const tokenId = await readContracts.YourCollectible.uriToTokenId(utils.id(loadedAsset.id));

     await tx(writeContracts.Auction.stake(nftAddress, tokenId, { value: parseEther(stakedAmount[loadedAsset.id].toString())}));
     await updateYourCollectibles();
  }

  const withdrawStake = async (loadedAsset) => {
    const nftAddress = readContracts.YourCollectible.address;
    const tokenId = await readContracts.YourCollectible.uriToTokenId(utils.id(loadedAsset.id));

    await tx(writeContracts.Auction.withdrawStake(nftAddress, tokenId));
    await updateYourCollectibles();
  }


  const isBidderIncluded = (bidsInfo) => {
    const bidders = Object.entries(bidsInfo).map(([_, bidInfo]) => bidInfo.bidder);
    console.log('all bidders', bidders);
    return bidders.includes(address);
  }

  let galleryList = []
  for(let a in (loadedAssets ? loadedAssets.slice(0, 6) : [])){
    // console.log("loadedAssets",a,loadedAssets[a])

    let cardActions = []
    let auctionDetails = [];
    if(loadedAssets[a].forSale){
      cardActions.push(
        <div>
          <Button onClick={()=>{
            // console.log("gasPrice,",gasPrice)
            tx( writeContracts.YourCollectible.mintItem(loadedAssets[a].id,{gasPrice:gasPrice}) )
          }}>
            Mint
          </Button>
        </div>
      )
      auctionDetails.push(null)
    }else{
      const { auctionInfo, stake } = loadedAssets[a];
      const deadline = new Date(auctionInfo.duration * 1000);
      const isEnded = deadline <= new Date();
      const { bidsInfo } = loadedAssets[a];

      cardActions.push(
        <div className="cardAction">
          <div>
          owned by: <Address
            address={loadedAssets[a].owner}
            ensProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            minimized={true}
          />
          </div>
          {!loadedAssets[a].auctionInfo.isActive && address === loadedAssets[a].owner && <><Button style={{ marginBottom: "10px" }} onClick={startAuction(loadedAssets[a].id)} disabled={address !== loadedAssets[a].owner}>Start auction</Button><br/></>}
          {/*{loadedAssets[a].auctionInfo.isActive && address === loadedAssets[a].auctionInfo.seller && <><Button style={{ marginBottom: "10px" }} onClick={completeAuction(loadedAssets[a].id)}>Complete auction</Button><br/></>}*/}
          {loadedAssets[a].auctionInfo.isActive && address === loadedAssets[a].auctionInfo.seller && <><Button style={{ marginBottom: "10px" }} onClick={cancelAuction(loadedAssets[a])}>Cancel auction</Button><br/></>}
          {
            auctionInfo.isActive && address !== auctionInfo.seller && (
              <>
                <p style={{ margin:0, marginTop: "15px", marginBottom: "2px" }}>Your staked ETH: {stake ? formatEther(stake) : 0.0}</p>

                {!isEnded && (<><p style={{margin:0, marginRight: "15px"}}>How much ETH you want to stake: </p>
                <InputNumber placeholder="0.1" value={stakedAmount[loadedAssets[a].id]} onChange={newStake => setStakedAmount({...stakedAmount, [loadedAssets[a].id]: newStake})} style={{ flexGrow: 1, marginTop: "7px", marginBottom: "20px", marginRight: "15px" }}/>
                <Button disabled={!stakedAmount[loadedAssets[a].id]} onClick={() => stakeEth(loadedAssets[a])} style={{marginBottom: "10px"}}>Stake ETH</Button>
                <br/>
                <br /></>)}

                {isEnded && (
                  <Button disabled={!loadedAssets[a].stake} onClick={() => withdrawStake(loadedAssets[a])} style={{marginBottom: "15px"}}>Withdraw your stake</Button>
                )}
              </>
            )
          }
        </div>
      )

      auctionDetails.push(auctionInfo.isActive ? (
          <div style={{ marginTop: "20px" }}>
            <p style={{ margin: 0, marginBottom: "2px"}}>Minimal price is {utils.formatEther(auctionInfo.price)} ETH</p>
            <p style={{ marginTop: 0 }}>{!isEnded ? `Auction ends at ${format(deadline, "MMMM dd, hh:mm:ss")}` : 'Auction has already ended'}</p>
            <div>
              {/*{auctionInfo.maxBidUser === constants.AddressZero ? "Highest bid was not made yet" : <div>Highest bid by: <Address*/}
              {/*    address={auctionInfo.maxBidUser}*/}
              {/*    ensProvider={mainnetProvider}*/}
              {/*    blockExplorer={blockExplorer}*/}
              {/*    minimized={true}*/}
              {/*/><p>{utils.formatEther(auctionInfo.maxBid)} ETH</p></div>}*/}
            </div>

            {auctionInfo.seller !== address ? (<div>
            <div style={{display: "flex", alignItems: "center", marginTop: "20px"}}>
              <p style={{margin:0, marginRight: "15px"}}>Your bid in ETH: </p>
              <InputNumber placeholder="0.1" value={yourBid[loadedAssets[a].id]} onChange={newBid => setYourBid({...yourBid, [loadedAssets[a].id]: newBid})} style={{ flexGrow: 1 }}/>
            </div>
              <Button style={{marginTop: "7px", marginBottom: "20px"}} onClick={() => placeBid(loadedAssets[a], yourBid[loadedAssets[a].id])} disabled={!yourBid[loadedAssets[a].id] || isEnded || isBidderIncluded(bidsInfo)}>{isBidderIncluded(bidsInfo) ? "You already made a bid" : "Place a bid"}</Button>
            </div>) : <b>You are selling this item</b>}

            {loadedAssets[a].auctionInfo.isActive && (
                <div>
                  {Object.entries(bidsInfo).map(([_, bidInfo]) => (
                      <div style={{ marginBottom: "20px"}}>
                      Bid by: <Address
                    address={bidInfo.bidder}
                    ensProvider={mainnetProvider}
                    blockExplorer={blockExplorer}
                    minimized={true}
                    />
                      <p style={{ margin: 0 }}>{formatEther(bidInfo.amount)} ETH</p>
                        {address === loadedAssets[a].auctionInfo.seller && <Button disabled={!isEnded} onClick={() => completeAuction(loadedAssets[a], bidInfo)}>Pick as a winner</Button>}
                      </div>
                  ))}
                </div>
            )}


          </div>
      ) : null);
    }

    galleryList.push(
        <>
      <Card style={{width:300}} key={loadedAssets[a].name}
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
        {auctionDetails}
      </Card>
          </>
    )
  }


  const handleOk = async () => {
    setModalVisible(false);
    const { price, duration } = auctionDetails;
    const tokenId = await readContracts.YourCollectible.uriToTokenId(utils.id(auctionToken));

    const auctionAddress = readContracts.Auction.address;
    const nftAddress = readContracts.YourCollectible.address;
    await writeContracts.YourCollectible.approve(auctionAddress, tokenId);

    const ethPrice = utils.parseEther(price.toString());
    const blockDuration = Math.floor(new Date().getTime() / 1000) + duration;

    await tx(writeContracts.Auction.createTokenAuction(nftAddress, tokenId, ethPrice, blockDuration, { gasPrice }));

    const auctionInfo = await readContracts.Auction.getTokenAuctionDetails(nftAddress, tokenId);
    console.log('auctionInfo', { auctionInfo });
  }

  const handleCancel = () => {
    setModalVisible(false);
  }

  const checkSigning = async () => {
    const signature = await getSignature(userProvider, address, ['bytes'], ['0x21']);
    console.log('MY SIGNATURE: ', { signature });
  }

  return (
    <div className="App">

      <Modal title="Start auction" visible={modalVisible} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ disabled: !auctionDetails.price || !auctionDetails.duration }} okText="Start">
        <div style={{display: "flex", alignItems: "center"}}>
          <p style={{margin:0, marginRight: "15px"}}>ETH price (minimal bid): </p>
          <InputNumber placeholder="0.1" value={auctionDetails.price} onChange={newPrice => setAuctionDetails({...auctionDetails, price: newPrice})} style={{ flexGrow: 1 }}/>
        </div>
        <br/>
        <div style={{display: "flex", alignItems: "center"}}>
          <p style={{margin:0, marginRight: "15px"}}>Duration in seconds: </p>
          <InputNumber placeholder="3600" value={auctionDetails.duration} onChange={newDuration => setAuctionDetails({...auctionDetails, duration: newDuration})} style={{ flexGrow: 1 }}/>
        </div>
      </Modal>

      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}

      <BrowserRouter>

        <Menu style={{ textAlign:"center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link onClick={()=>{setRoute("/")}} to="/">Gallery</Link>
          </Menu.Item>
          <Menu.Item key="/yourcollectibles">
            <Link onClick={()=>{setRoute("/yourcollectibles")}} to="/yourcollectibles">YourCollectibles</Link>
          </Menu.Item>
          <Menu.Item key="/transfers">
            <Link onClick={()=>{setRoute("/transfers")}} to="/transfers">Transfers</Link>
          </Menu.Item>
          <Menu.Item key="/ipfsup">
            <Link onClick={()=>{setRoute("/ipfsup")}} to="/ipfsup">IPFS Upload</Link>
          </Menu.Item>
          <Menu.Item key="/ipfsdown">
            <Link onClick={()=>{setRoute("/ipfsdown")}} to="/ipfsdown">IPFS Download</Link>
          </Menu.Item>
          <Menu.Item key="/debugcontracts">
            <Link onClick={()=>{setRoute("/debugcontracts")}} to="/debugcontracts">Debug Contracts</Link>
          </Menu.Item>
        </Menu>

        <Switch>
          <Route exact path="/">
            {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}

            <div style={{ maxWidth:1024, margin: "auto", marginTop:32, paddingBottom:56 }}>
              <Button disabled={galleryList.length === 0} onClick={updateYourCollectibles} style={{marginBottom: "25px"}}>Update collectibles</Button>


              <StackGrid
                columnWidth={300}
                gutterWidth={16}
                gutterHeight={16}
              >
                {galleryList}
              </StackGrid>
            </div>

          </Route>

          <Route path="/yourcollectibles">
            <div style={{ width:640, margin: "auto", marginTop:32, paddingBottom:32 }}>
              <List
                bordered
                dataSource={yourCollectibles}
                renderItem={(item) => {
                  const id = item.id.toNumber()
                  return (
                    <List.Item key={id+"_"+item.uri+"_"+item.owner}>
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
                          tx( writeContracts.YourCollectible.transferFrom(address, transferToAddresses[id], id) )
                        }}>
                          Transfer
                        </Button>
                      </div>
                    </List.Item>
                  )
                }}
              />
            </div>
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
                name="YourCollectible"
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
  setTimeout(() => {
    window.location.reload();
  }, 1);
})

export default App;
