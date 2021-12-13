import { Alert, Button, Col, Menu, Row } from "antd";
import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
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
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { Home, ExampleUI, Hints, Subgraph } from "./views";
import { useStaticJsonRPC } from "./hooks";

const { ethers } = require("ethers");
const SuperfluidSDK = require("@superfluid-finance/js-sdk");

//initialize superfluid

await sf.initialize()

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      network: "",
      balance: "",
      available: [],
      rented: [],
      loading: true,
      newURI: "",
    };

    this.mintAsset = this.mintAsset.bind(this);
    this.rentAsset = this.rentAsset.bind(this);
    this.returnAsset = this.returnAsset.bind(this);
  }

    componentDidMount() {
    this.loadData();
  }

  async mintAsset(e) {
    this.setState({
      loading: true,
    });

    let tokenURI = this.state.newURI;
    this.setState({ loading: true });

    const result = await this.state.NFT.methods
      .createAsset(tokenURI)
      .send({ from: this.state.account });
    console.log(result);
    const available = await this.state.NFT.methods.getAvailableTokens().call();
    console.log(available);

    this.setState({
      available: available,
      loading: false,
    });
  }

  async rentAsset(e) {
    this.setState({
      loading: true,
    });

    let tokenURI = e.target.getAttribute("data-token");
    let contract = this.state.NFT._address;
    let sf = this.state.sf;
    console.log(contract);

    let flowRate = toWad("1").div(toBN(3600));

    await sf.cfa.createFlow({
      flowRate: flowRate.toString(),
      receiver: contract,
      sender: this.state.user.address,
      superToken: DAIxAddress,
      userData: this.state.web3.eth.abi.encodeParameter("uint256", tokenURI),
    });

    const available = await this.state.NFT.methods.getAvailableTokens().call();
    const rented = await this.state.NFT.methods.getRentedTokens().call();

    this.setState({
      available: available,
      rented: rented,
      loading: false,
    });
  }

  async returnAsset(e) {
    this.setState({
      loading: true,
    });

    let tokenURI = e.target.getAttribute("data-token");
    let contract = this.state.NFT._address;
    let sf = this.state.sf;
    console.log(contract);

    await sf.cfa.deleteFlow({
      by: this.state.user.address,
      receiver: contract,
      sender: this.state.user.address,
      superToken: DAIxAddress,
      userData: this.state.web3.eth.abi.encodeParameter("uint256", tokenURI),
    });

    const available = await this.state.NFT.methods.getAvailableTokens().call();
    const rented = await this.state.NFT.methods.getRentedTokens().call();

    this.setState({
      available: available,
      rented: rented,
      loading: false,
    });
  }


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
const targetNetwork = NETWORKS.mumbai; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;

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
  const networkOptions = ["localhost", "mainnet", "rinkeby"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);
  const location = useLocation();

  /// 📡 What chain are your contracts deployed to?
  const targetNetwork = NETWORKS[selectedNetwork]; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

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

  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

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
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  render() {
    return (
      <Container>
        {this.state.loading ? (
          <div></div>
        ) : (
          <Container>
            <Row>
              <h1>Stream Rent</h1>
            </Row>
            <Row>
              <p> Account address : {this.state.account} </p>
            </Row>
            <Row>
              <p> Account Balance : {this.state.balance} </p>
            </Row>
            <Row>
              <Form onSubmit={this.mintAsset}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Asset URI"
                    value={this.state.newURI}
                    onChange={(e) => this.setState({ newURI: e.target.value })}
                  />
                </Form.Group>
                <Button type="submit">Create Asset</Button>
              </Form>
            </Row>
            <br></br>
            <Row>
              <Col>
                <h3>Available Tokens</h3>
                {this.state.available.map((item, index) => (
                  <div>
                    <li>{item}</li>
                    <Button data-token={item} onClick={this.rentAsset}>
                      Rent
                    </Button>
                  </div>
                ))}
              </Col>
              <Col>
                <h3>Rented Tokens</h3>

                {this.state.rented.map((item, index) => (
                  <div>
                    <li>{item}</li>
                    <Button data-token={item} onClick={this.returnAsset}>
                      Return
                    </Button>
                  </div>
                ))}
              </Col>
            </Row>
          </Container>
        )}
      </Container>
    );
  }
}

export default App;
