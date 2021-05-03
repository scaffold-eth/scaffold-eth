import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import {  JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { Row, Col, Button, Menu, Alert, Switch as SwitchD } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useExchangePrice, useGasPrice, useUserProvider, useContractLoader, useContractReader, useEventListener, useBalance, useExternalContractLoader } from "./hooks";
import { Header, Account, Faucet, Ramp, Contract, GasGauge, ThemeSwitch } from "./components";
import { Transactor } from "./helpers";
import { formatEther, parseEther } from "@ethersproject/units";
//import Hints from "./Hints";
import { Hints, ExampleUI, Subgraph } from "./views"
import { useThemeSwitcher } from "react-css-theme-switcher";
import { INFURA_ID, DAI_ADDRESS, DAI_ABI, NETWORK, NETWORKS } from "./constants";
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
const DEBUG = true


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
  //const tx = Transactor(userProvider, gasPrice)

  // Faucet Tx can be used to send funds from the faucet
  //const faucetTx = Transactor(localProvider, gasPrice)

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  //const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  //const yourMainnetBalance = useBalance(mainnetProvider, address);

  // Load in your local 📝 contract and read a value from it:
  //const readContracts = useContractLoader(localProvider)

  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  //const writeContracts = useContractLoader(userProvider)

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  //const mainnetDAIContract = useExternalContractLoader(mainnetProvider, DAI_ADDRESS, DAI_ABI)

  // Then read your DAI balance like:
  //const myMainnetDAIBalance = useContractReader({DAI: mainnetDAIContract},"DAI", "balanceOf",["0x34aA3F359A9D614239015126635CE7732c18fDF3"])

  // keep track of a variable from the contract in the local React state:
  //const purpose = useContractReader(readContracts,"YourContract", "purpose")

  //📟 Listen for broadcast events
  //const setPurposeEvents = useEventListener(readContracts, "YourContract", "SetPurpose", localProvider, 1);

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // ☝️ These effects will log your major set up and upcoming transferEvents- and balance changes
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


  const [oldMainnetBalance, setOldMainnetDAIBalance] = useState(0)

  // For Master Branch Example
  const [oldPurposeEvents, setOldPurposeEvents] = useState([])

  // For Buyer-Lazy-Mint Branch Example
  // const [oldTransferEvents, setOldTransferEvents] = useState([])
  // const [oldBalance, setOldBalance] = useState(0)

  // Use this effect for often changing things like your balance and transfer events or contract-specific effects
  /*useEffect(()=>{
    if(DEBUG){
      if(myMainnetDAIBalance && !myMainnetDAIBalance.eq(oldMainnetBalance)){
        console.log("🥇 myMainnetDAIBalance:",myMainnetDAIBalance)
        setOldMainnetDAIBalance(myMainnetDAIBalance)
      }

      // For Buyer-Lazy-Mint Branch Example
      //if(transferEvents && oldTransferEvents !== transferEvents){
      //  console.log("📟 Transfer events:", transferEvents)
      //  setOldTransferEvents(transferEvents)
      //}
      //if(balance && !balance.eq(oldBalance)){
      //  console.log("🤗 balance:", balance)
      //  setOldBalance(balance)
      //}

      // For Master Branch Example
      if(setPurposeEvents && setPurposeEvents !== oldPurposeEvents){
        console.log("📟 SetPurpose events:",setPurposeEvents)
        setOldPurposeEvents(setPurposeEvents)
      }
    }
  }, [myMainnetDAIBalance]) // For Buyer-Lazy-Mint Branch: balance, transferEvents*/


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


  const builds = [
    {
      name: "🎟 Simple NFT Example",
      desc: "Mint and display NFTs on Ethereum with a full example app...",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/simple-nft-example",
      readMore: "",
      image: "simplenft.png"
    },
    {
      name: "🧑‍🎤 PunkWallet.io",
      desc: "A quick web wallet for demonstrating identity of keypairs and sending around ETH.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/punk-wallet",
      readMore: "https://punkwallet.io",
      image: "punkwallet.png"
    },
    {
      name: "🔴 Optimism Starter Pack",
      desc: "A 🏗 scaffold-eth dev stack for 🔴 Optimism",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/local-optimism",
      readMore: "https://azfuller20.medium.com/optimism-scaffold-eth-draft-b76d3e6849e8",
      image: "op.png"
    },
    {
      name: "⚖️ Uniswapper",
      desc: "A component for swapping erc20s on Uniswap (plus tokenlists + local forks of mainnet!)",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/uniswapper",
      readMore: "https://azfuller20.medium.com/swap-with-uniswap-wip-f15923349b3d",
      image: "uniswapper.png"
    },
    {
      name: "👻 Lender",
      desc: "A component for depositing & borrowing assets on Aave",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/lender",
      readMore: "https://azfuller20.medium.com/lend-with-aave-v2-20bacceedade",
      image: "lender.png"
    },
    {
      name: "🐸Chainlink 🎲 VRF 🎫 NFT",
      desc: "Use VRF to get a 🎲 random \"⚔️ strength\" for each NFT as it is minted...",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/chainlink-vrf-nft",
      readMore: "https://youtu.be/63sXEPIEh-k?t=1773",
      image: "randomimage.png"
    },
    {
      name: "👨‍👦 Minimal Proxy",
      desc: "A clever workaround where you can deploy the same contract thousands of times with minimal deployment costs",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/minimal_proxy",
      readMore: "",
      image: "proxy.png"
    },
    {
      name: "🍯 Honeypot",
      desc: "How you can catch hackers by putting bait into your \"vulnerable\" smart contract 🤭",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/honeypot-example",
      readMore: "",
      image: "honeypot.png"
    },
    {
      name: "😈 Denial of Service",
      desc: "Make contract unusable by exploiting push external calls 😈 (DOS)",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/denial-of-service-example",
      readMore: "",
      image: "dos.png"
    },
    {
      name: "⚡️ Aave Flash Loans Intro",
      desc: "Learn how to borrow any available amount of assets without putting up any collateral and build a simple arbitrage bot that would trade between Uniswap and Sushiswap pools.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/flash-loans-intro",
      readMore: "",
      image: "flash.png"
    },
    {
      name: "🧾 rTokens",
      desc: "tokens that represent redirected yield from lending",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/defi-rtokens",
      readMore: "",
      image: "rtokens"
    },
    {
      name: "🌱 radwallet.io",
      desc: "A simple web wallet to send around Rad tokens (ERC20 on mainnet).",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/radwallet",
      readMore: "https://radwallet.io",
      image: ""
    },
    {
      name: "🎨 Nifty.ink",
      desc: "NFT artwork platform powered by meta transactions, burner wallets, sidechains, and bridged to Ethereum.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/nifty-ink-dev",
      readMore: "https://nifty.ink",
      image: "niftyink.png"
    },
    {
      name: "🌐 GTGS Voice Gems",
      desc: "NFT \"shards\" collected from original \"Voice Gems\" for the Global Technology and Governance Summit.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/gtgs-voice-gems",
      readMore: "https://gtgs.io",
      image: "gtgs.png"
    },
    {
      name: "🐊 Token Allocator",
      desc: "Allocator.sol distributes tokens to addresses on a ratio defined by Governor.sol",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/new-allocator",
      readMore: "",
      image: "allocator.png"
    },
    {
      name: "💎 Diamond Standard exploration",
      desc: "Diamond standard in 🏗 scaffold-eth?",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/diamond-standard",
      readMore: "",
      image: "diamond.png"
    },
    {
      name: "⏳ Streaming Meta Multi Sig",
      desc: "An off-chain signature based multi sig with streaming.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/streaming-meta-multi-sig",
      readMore: "https://bank.buidlguidl.com/streams",
      image: "smms.png"
    },
    {
      name: "🔮 Chainlink Example",
      desc: "oracles and vrf",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/chainlink-tutorial-1",
      readMore: "",
      image: "vrf.png"
    },
    {
      name: "👻 Aave 🦍 Ape",
      desc: "A helper contract that lets you go long on the Aave asset of your choice.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/aave-ape",
      readMore: "https://www.youtube.com/watch?v=4uAzju3efqY",
      image: "ape.png"
    },
    {
      name: "🔴 Optimism 🎟 NFTs ",
      desc: "A \"buyer mints\" NFT gallery running on Optimism",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/optimistic-nft-dev-session",
      readMore: "",
      image: "opnfts.png"
    },
    {
      name: "🎫 Nifty Viewer",
      desc: "A forkable nft gallery with transfer functionality and burner wallets.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/nifty-viewer",
      readMore: "",
      image: "niftyview.png"
    },
    {
      name: "🏷 NFT Auction",
      desc: "Discover how you can build your own NFT auction where the highest bid gets an NFT!",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/nifty-viewer",
      readMore: "",
      image: "highestbid.png"
    },
    {
      name: "🌲 Merkle Mint NFTs",
      desc: "Use a Merkle tree of possible artworks and then submit a proof it is valid to mint.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/merkle-root-buyer-mints",
      readMore: "",
      image: ""
    }
    /*{
      name: "⏳ Simple Stream",
      desc: "A simple ETH stream where the beneficiary reports work via links when they withdraw.",
      branch: "https://github.com/austintgriffith/scaffold-eth/tree/simple-stream",
      readMore: "",
      image: ""
    },
    {
      name: "",
      desc: "",
      branch: "",
      readMore: "",
      image: ""
    }*/
  ]


  return (
    <div className="App">

      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}
      <BrowserRouter>

        <Menu style={{ textAlign:"center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link onClick={()=>{setRoute("/")}} to="/builds">🛠 Builds</Link>
          </Menu.Item>
          <Menu.Item key="/builders">
            <Link onClick={()=>{setRoute("/builders")}} to="/builders">👩‍🏭 Builders</Link>
          </Menu.Item>
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

            quick intro and goal / north star


            filterable list of builds?



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
            builders
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
