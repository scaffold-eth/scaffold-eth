import { Button, Col, Menu, Row } from "antd";
import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
  useBlockNumber
} from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
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
  Blockie,
  Address
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { Home, ExampleUI, Hints, Subgraph } from "./views";
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

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = false;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = true; // toggle burner wallet feature
const USE_NETWORK_SELECTOR = false;

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

function App(props) {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, "mainnet", "rinkeby"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);
  const location = useLocation();

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  // 🛰 providers
  if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

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
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
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

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

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

  // If you want to call a function on a new block
  useOnBlock(mainnetProvider, () => {
    console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  });

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);

  const blockNumber = useBlockNumber(localProvider);

  // keep track of a variable from the contract in the local React state:
  //const purpose = useContractReader(readContracts, "YourContract", "purpose");

  const width = useContractReader(readContracts, "Game", "width");
  const height = useContractReader(readContracts, "Game", "height");

  const registerEvents = useEventListener(readContracts, "Game", "Register", localProvider, 1);

  //event NewDrop(bool isHealth, uint256 amount, uint256 x, uint256 y);
  const dropEvents = useEventListener(readContracts, "Game", "NewDrop", localProvider, 1);

  const [drops, setDrops] = useState();

  useEffect(async ()=>{
    console.log("parsing dropEvents",dropEvents)
    let allDrops = []
    for(let e in dropEvents){
      const theX = dropEvents[e].args.x
      const theY = dropEvents[e].args.y
      const field = await readContracts.Game.worldMatrix(theX,theY)
      allDrops.push({
        health: field.healthAmountToCollect.toNumber(),
        gold: field.tokenAmountToCollect,
        x: theX,
        y: theY,
      })
    }
    //console.log("Saving drops:",allDrops)
    setDrops(allDrops)
  },[dropEvents, blockNumber])

  //console.log("registerEvents",registerEvents)

  const [players, setPlayers] = useState();
  const [activePlayer, setActivePlayer] = useState();

  useEffect(()=>{
    console.log("parsing registerEvents",registerEvents)
    let allPlayers = []
    let active = false
    for(let e in registerEvents){
      if(!allPlayers.includes(registerEvents[e].args.txOrigin)){
        allPlayers.push(registerEvents[e].args.txOrigin)
        if(registerEvents[e].args.txOrigin==address){
          active=true;
        }
      }
    }
    //console.log("ACTIVE:",setActivePlayer)
    setActivePlayer(active)
    //console.log("allPlayers",allPlayers)
    setPlayers(allPlayers)
  },[registerEvents])




  const [playerData, setPlayerData] = useState();

  useEffect(async ()=>{
    console.log("PARSE PLAYERS:::",players)
    let playerInfo = {}
    for(let p in players){
      console.log("loading info for ",players[p])
      playerInfo[players[p]] = {
        health: (await readContracts.Game.health(players[p])).toNumber(),
        position: await readContracts.Game.yourPosition(players[p]),
        contract: await readContracts.Game.yourContract(players[p]),
        gold: await readContracts.GLDToken.balanceOf(players[p]),
      }
    }
    console.log("final player info",playerInfo)
    setPlayerData(playerInfo)
  },[players, blockNumber])

  const [highScores, setHighScores] = useState();

  useEffect(() => {
    //console.log("USE PLAYER DATA TO DRAW HIGH SCORE LIST::",playerData)

    let playersSorted = []

    console.log("players",players)

    for(let p in players){
      if(playerData[players[p]]){
      //  console.log("player",playerData[players[p]])
        playersSorted.push({
          address: players[p],
          health: playerData[players[p]].health,
          gold: playerData[players[p]].gold
        })
      }
    }

    //console.log("players",playersSorted)
    playersSorted.sort((a, b) => {
      if(a.health <= b.health) return 1
      else return -1
    })
    playersSorted.sort((a, b) => {
      if(a.gold.lte(b.gold)) return 1
      else return -1
    })
    //console.log("sorted?",playersSorted)
    setHighScores(playersSorted)
  },[playerData])


  const highScoreDisplay = []
  for(let i in highScores){
    //console.log("HIGH",highScores[i])
    highScoreDisplay.push(
      <div>
        <Address value={highScores[i].address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={14}/>
        <span style={{margin:16}}>{ethers.utils.formatEther(highScores[i].gold)}🏵</span>
        <span style={{margin:16,opacity:0.77}}>{highScores[i].health}❤️</span>

      </div>
    )
  }

  const s = 64
  const squareW = s
  const squareH = s

  const [worldView, setWorldView] = useState();

  useEffect(() => {
    console.log("rendering world...")
    let worldUpdate = []
    for( let y=0;y<height;y++){
      for(let x=width-1;x>=0;x--){

        let goldHere = 0
        let healthHere = 0
        for(let d in drops){
          if(drops[d].x == x && drops[d].y==y){
            goldHere+=drops[d].gold
            healthHere+=drops[d].health
          }
        }

        let fieldDisplay = ""

        if(goldHere>0){
          fieldDisplay = <img src="Gold_Full.svg" style={{transform:"rotate(45deg) scale(1,3)",width:60,height:60,marginLeft:15,marginTop:-45}} />
        }

        if(healthHere>0){
          fieldDisplay = <img src="Health_Full.svg" style={{transform:"rotate(45deg) scale(1,3)",width:60,height:60,marginLeft:15,marginTop:-45}} />
        }

        //look for players here...
        let playerDisplay = ""
        for(let p in players){
          //console.log("comparing ",players[p])
          let thisPlayerData = playerData[players[p]]
          //console.log("thisPlayerData",thisPlayerData)
          if(thisPlayerData && thisPlayerData.position.x==x && thisPlayerData.position.y==y){
            playerDisplay = (
              <div style={{position:"relative"}}>
                <Blockie address={players[p]} size={8} scale={7.5} />
                <img src="Warrior_1.svg" style={{transform:"rotate(45deg) scale(1,3)",width:170,height:170,marginLeft:90,marginTop:-400}} />
              </div>
            )
          }
        }
        worldUpdate.push(
          <div style={{width:squareW,height:squareH,padding:1,position:"absolute",left:squareW*x,top:squareH*y}}>
            <div style={{position:"realative",height:"100%",background:(x+y)%2?"#BBBBBB":"#EEEEEE"}}>
              { playerDisplay ? playerDisplay : <span style={{opacity:0.4}}>{""+x+","+y}</span> }
              <div style={{opacity:0.7,position:"absolute",left:squareW/2-10,top:0}}>{ fieldDisplay }</div>
            </div>
          </div>
        )
      }
    }
    setWorldView(worldUpdate)
  }, [playerData]);



  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

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
      yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    yourLocalBalance,
    yourMainnetBalance,
    readContracts,
    writeContracts,
    mainnetContracts,
    localChainId,
    myMainnetDAIBalance,
  ]);

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
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;


  let playerButtons
  if(activePlayer){
    //show controls
    playerButtons = (
      <div>
      <Address value={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={14}/>

      <div style={{padding:4}}>
          <Button onClick={async ()=>{
            const result = tx(writeContracts.Game.move(0))
          }}>UP (0)</Button>
      </div>
      <div style={{padding:4}}>
          <Button onClick={async ()=>{
            const result = tx(writeContracts.Game.move(1))
          }}>DOWN (1)</Button>
      </div>
      <div style={{padding:4}}>
          <Button onClick={async ()=>{
            const result = tx(writeContracts.Game.move(2))
          }}>LEFT (2)</Button>
      </div>
      <div style={{padding:4}}>
          <Button onClick={async ()=>{
            const result = tx(writeContracts.Game.move(3))
          }}>RIGHT (3)</Button>
      </div>

      <div style={{padding:8}}>
          <Button onClick={async ()=>{
            const result = tx(writeContracts.Game.collectHealth())
          }}>Collect Health</Button>
      </div>
      <div style={{padding:8}}>
          <Button onClick={async ()=>{
            const result = tx(writeContracts.Game.collectTokens())
          }}>Collect Gold</Button>
      </div>
      </div>
    )
  }else{
    //register button
    playerButtons = (
      <div>
        <div style={{padding:4}}>
            <Button onClick={async ()=>{
              const result = tx(writeContracts.Game.register())
            }}>Register</Button>
        </div>
      </div>
    )
  }

  let extraDisplay
  if(DEBUG){
    extraDisplay = (
      <div>
      <div>{ blockNumber ? "block: "+blockNumber :"loading blocknumber..."}</div>
      <div>{ width ? width : "..."}x{ height ? height : "..."}</div>
      { highScores ? <pre>{JSON.stringify(highScores)}</pre> : "loading highScores..."}

      </div>
    )
  }


  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {extraDisplay}
      <NetworkDisplay
        NETWORKCHECK={NETWORKCHECK}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
      />
      <div style={{position:"absolute",left:"5%",top:"40%"}}>
        <div style={{padding:4,}}>
          <Address fontSize={48} value={readContracts && readContracts.Game && readContracts.Game.address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
        </div>
        <div style={{paddingBottom:16,fontSize:32,marginBottom:16,borderBottom:"1px solid #555555"}}>
          #{blockNumber}
        </div>
        {highScoreDisplay}
      </div>
      <div style={{position:"absolute",right:"5%",top:"30%"}}>
              {playerButtons}
      </div>
      <Menu style={{ textAlign: "center", marginTop: 40 }} selectedKeys={[location.pathname]} mode="horizontal">
        <Menu.Item key="/">
          <Link to="/">App Home</Link>
        </Menu.Item>
        <Menu.Item key="/debug">
          <Link to="/debug">Contracts</Link>
        </Menu.Item>

      </Menu>

      <Switch>
        <Route exact path="/">


          <div style={{transform: "scale(1,0.4)"}}>
            <div style={{transform:"rotate(-45deg)",color:"#111111",fontWeight:"bold",width:width*squareW,height:height*squareH,margin:"auto",position:"relative"}}>
              {worldView}
            </div>
          </div>

          {/* pass in any web3 props to this Home component. For example, yourLocalBalance */}
          <Home yourLocalBalance={yourLocalBalance} readContracts={readContracts} />
        </Route>
        <Route exact path="/debug">
          {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}

          <Contract
            name="Game"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
          <Contract
            name="GLDToken"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
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
            userSigner={userSigner}
            mainnetProvider={mainnetProvider}
            localProvider={localProvider}
            yourLocalBalance={yourLocalBalance}
            price={price}
            tx={tx}
            writeContracts={writeContracts}
            readContracts={readContracts}
            purpose={false}
          />
        </Route>
        <Route path="/mainnetdai">
          <Contract
            name="DAI"
            customContract={mainnetContracts && mainnetContracts.contracts && mainnetContracts.contracts.DAI}
            signer={userSigner}
            provider={mainnetProvider}
            address={address}
            blockExplorer="https://etherscan.io/"
            contractConfig={contractConfig}
            chainId={1}
          />
          {/*
            <Contract
              name="UNI"
              customContract={mainnetContracts && mainnetContracts.contracts && mainnetContracts.contracts.UNI}
              signer={userSigner}
              provider={mainnetProvider}
              address={address}
              blockExplorer="https://etherscan.io/"
            />
            */}
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

      <ThemeSwitch />



      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          {USE_NETWORK_SELECTOR && (
            <div style={{ marginRight: 20 }}>
              <NetworkSwitch
                networkOptions={networkOptions}
                selectedNetwork={selectedNetwork}
                setSelectedNetwork={setSelectedNetwork}
              />
            </div>
          )}
          <Account
            useBurner={USE_BURNER_WALLET}
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
        {yourLocalBalance.lte(ethers.BigNumber.from("0")) && (
          <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
        )}
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
