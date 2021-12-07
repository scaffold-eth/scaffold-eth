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
  Address,
  Contract,
  Faucet,
  GasGauge,
  Header,
  Ramp,
  ThemeSwitch,
  NetworkDisplay,
  FaucetHint,
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { YourLoogies, Loogies } from "./views";
import { useStaticJsonRPC } from "./hooks";

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

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://rpc.scaffoldeth.io:48544",
];

function App(props) {
  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const location = useLocation();

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

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

  const priceToMint = useContractReader(readContracts, "YourCollectible", "price");
  if (DEBUG) console.log("🤗 priceToMint:", priceToMint);

  const totalSupply = useContractReader(readContracts, "YourCollectible", "totalSupply");
  if (DEBUG) console.log("🤗 totalSupply:", totalSupply);
  const loogiesLeft = 3728 - totalSupply;

  // keep track of a variable from the contract in the local React state:
  const balance = useContractReader(readContracts, "YourCollectible", "balanceOf", [address]);
  if (DEBUG) console.log("🤗 address: ", address, " balance:", balance);

  //
  // 🧠 This effect will update yourCollectibles by polling when your balance changes
  //
  const yourBalance = balance && balance.toNumber && balance.toNumber();
  const [yourCollectibles, setYourCollectibles] = useState();
  const [transferToAddresses, setTransferToAddresses] = useState({});

  useEffect(() => {
    const updateYourCollectibles = async () => {
      const collectibleUpdate = [];
      for (let tokenIndex = 0; tokenIndex < balance; tokenIndex++) {
        try {
          if (DEBUG) console.log("Getting token index", tokenIndex);
          const tokenId = await readContracts.YourCollectible.tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting Loogie tokenId: ", tokenId);
          const tokenURI = await readContracts.YourCollectible.tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));

          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            collectibleUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourCollectibles(collectibleUpdate.reverse());
    };
    updateYourCollectibles();
  }, [address, yourBalance]);

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

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      <NetworkDisplay
        NETWORKCHECK={NETWORKCHECK}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
      />
      <Menu style={{ textAlign: "center" }} selectedKeys={[location.pathname]} mode="horizontal">
        <Menu.Item key="/">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="/yourLoogies">
          <Link to="/yourLoogies">Your Optimistic Loogies</Link>
        </Menu.Item>
        <Menu.Item key="/howto">
          <Link to="/howto">How To Use Optimistic Network</Link>
        </Menu.Item>
        <Menu.Item key="/debug">
          <Link to="/debug">Debug Contracts</Link>
        </Menu.Item>
      </Menu>

      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
        <div style={{ fontSize: 16 }}>
          <p>
            Only <strong>3728 Optimistic Loogies</strong> available (2X the supply of the <a href="https://loogies.io" target="_blank">Original Ethereum Mainnet Loogies</a>) on a price curve <strong>increasing 0.2%</strong> with each new mint.
          </p>
          <p>All Ether from sales goes to public goods!!</p>
        </div>

        <Button
          type="primary"
          onClick={async () => {
            const priceRightNow = await readContracts.YourCollectible.price();
            try {
              const txCur = await tx(writeContracts.YourCollectible.mintItem({ value: priceRightNow }));
              await txCur.wait();
            } catch (e) {
              console.log("mint failed", e);
            }
          }}
        >
          MINT for Ξ{priceToMint && (+ethers.utils.formatEther(priceToMint)).toFixed(4)}
        </Button>

        <p style={{ fontWeight: "bold" }}>
          { loogiesLeft } left
        </p>
      </div>

      <Switch>
        <Route exact path="/">
          <Loogies
            readContracts={readContracts}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            totalSupply={totalSupply}
            DEBUG={DEBUG}
          />
        </Route>
        <Route exact path="/yourLoogies">
          <YourLoogies
            readContracts={readContracts}
            writeContracts={writeContracts}
            priceToMint={priceToMint}
            yourCollectibles={yourCollectibles}
            tx={tx}
            mainnetProvider={mainnetProvider}
            blockExplorer={blockExplorer}
            transferToAddresses={transferToAddresses}
            setTransferToAddresses={setTransferToAddresses}
            address={address}
          />
        </Route>
        <Route exact path="/howto">
          <div style={{ fontSize: 18, width: 820, margin: "auto" }}>
            <h2 style={{ fontSize: "2em", fontWeight: "bold" }}>How to add Optimistic Ethereum network on MetaMask</h2>
            <div style={{ textAlign: "left", marginLeft: 50, marginBottom: 50 }}>
              <ul>
                <li>
                  Go to <a target="_blank" href="https://chainid.link/?network=optimism">https://chainid.link/?network=optimism</a>
                </li>
                <li>
                  Click on <strong>connect</strong> to add the <strong>Optimistic Ethereum</strong> network in <strong>MetaMask</strong>.
                </li>
              </ul>
            </div>
            <h2 style={{ fontSize: "2em", fontWeight: "bold" }}>How to add funds to your wallet on Optimistic Ethereum network</h2>
            <div style={{ textAlign: "left", marginLeft: 50, marginBottom: 100 }}>
              <ul>
                <li><a href="https://portr.xyz/" target="_blank">The Teleporter</a>: the cheaper option, but with a 0.05 ether limit per transfer.</li>
                <li><a href="https://gateway.optimism.io/" target="_blank">The Optimism Gateway</a>: larger transfers and cost more.</li>
                <li><a href="https://app.hop.exchange/send?token=ETH&sourceNetwork=ethereum&destNetwork=optimism" target="_blank">Hop.Exchange</a>: where you can send from/to Ethereum mainnet and other L2 networks.</li>
              </ul>
            </div>
          </div>
        </Route>
        <Route exact path="/debug">
          <div style={{ padding: 32 }}>
            <Address value={readContracts && readContracts.YourCollectible && readContracts.YourCollectible.address} />
          </div>
          <Contract
            name="YourCollectible"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        </Route>
      </Switch>

      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32 }}>
        🛠 built with <a href="https://github.com/scaffold-eth/scaffold-eth" target="_blank">🏗 scaffold-eth</a>
        🍴 <a href="https://github.com/scaffold-eth/scaffold-eth" target="_blank">Fork this repo</a> and build a cool SVG NFT!
      </div>

      <ThemeSwitch />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
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
        <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
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
