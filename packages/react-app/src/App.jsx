import { Button, Card, Col, Input, List, Menu, Row } from "antd";
import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  usePoller,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import { useEventListener } from "eth-hooks/events/useEventListener";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import {
  Account,
  Address,
  AddressInput,
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
import { Home, ExampleUI, Hints, Subgraph, About } from "./views";
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

// 😬 Sorry for all the console logging
const DEBUG = false;
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
  const networkOptions = ["localhost", "kovanOptimism", "mainnet", "rinkeby"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[1]);
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
  const readContracts = useContractLoader(localProvider, contractConfig, localChainId);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // call every 1500 seconds.
  usePoller(() => {
    updateLoogieTanks();
  }, 1500000);

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);

  // keep track of a variable from the contract in the local React state:
  const loogieBalance = useContractReader(readContracts, "Loogies", "balanceOf", [address]);
  if (DEBUG) console.log("🤗 loogie balance:", loogieBalance);

  const loogiePrice = useContractReader(readContracts, "Loogies", "price");
  if (DEBUG) console.log("🤗 priceToMint:", loogiePrice);

  const loogieTankBalance = useContractReader(readContracts, "LoogieTank", "balanceOf", [address]);
  if (DEBUG) console.log("🤗 loogie tank balance:", loogieTankBalance);

  const loogieTankPrice = useContractReader(readContracts, "LoogieTank", "price");

  // 📟 Listen for broadcast events
  const loogieTransferEvents = useEventListener(readContracts, "Loogies", "Transfer", localProvider, 1);
  if (DEBUG) console.log("📟 Loogie Transfer events:", loogieTransferEvents);

  const loogieTankTransferEvents = useEventListener(readContracts, "LoogieTank", "Transfer", localProvider, 1);
  if (DEBUG) console.log("📟 Loogie Tank Transfer events:", loogieTankTransferEvents);

  //
  // 🧠 This effect will update yourCollectibles by polling when your balance changes
  //
  const yourLoogieBalance = loogieBalance && loogieBalance.toNumber && loogieBalance.toNumber();
  const [yourLoogies, setYourLoogies] = useState();

  const yourLoogieTankBalance = loogieTankBalance && loogieTankBalance.toNumber && loogieTankBalance.toNumber();
  const [yourLoogieTanks, setYourLoogieTanks] = useState();

  const [previews, setPreviews] = useState({});

  async function updateLoogieTanks() {
    const loogieTankUpdate = [];
    for (let tokenIndex = 0; tokenIndex < yourLoogieTankBalance; tokenIndex++) {
      try {
        if (DEBUG) console.log("Getting token index", tokenIndex);
        const tokenId = await readContracts.LoogieTank.tokenOfOwnerByIndex(address, tokenIndex);
        if (DEBUG) console.log("tokenId", tokenId);
        const tokenURI = await readContracts.LoogieTank.tokenURI(tokenId);
        if (DEBUG) console.log("tokenURI", tokenURI);
        const jsonManifestString = atob(tokenURI.substring(29))
        if (DEBUG) console.log("jsonManifestString", jsonManifestString);

        try {
          const jsonManifest = JSON.parse(jsonManifestString);
          if (DEBUG) console.log("jsonManifest", jsonManifest);
          loogieTankUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
        } catch (e) {
          console.log(e);
        }

      } catch (e) {
        console.log(e);
      }
    }
    setYourLoogieTanks(loogieTankUpdate.reverse());
  }

  useEffect(() => {
    const updateYourCollectibles = async () => {
      const loogieUpdate = [];
      for (let tokenIndex = 0; tokenIndex < yourLoogieBalance; tokenIndex++) {
        try {
          if (DEBUG) console.log("Getting token index", tokenIndex);
          const tokenId = await readContracts.Loogies.tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("tokenId", tokenId);
          const tokenURI = await readContracts.Loogies.tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29))
          if (DEBUG) console.log("jsonManifestString", jsonManifestString);
          /*
                    const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");
                    console.log("ipfsHash", ipfsHash);
                    const jsonManifestBuffer = await getFromIPFS(ipfsHash);
                  */
          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            if (DEBUG) console.log("jsonManifest", jsonManifest);
            loogieUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (e) {
            console.log(e);
          }

        } catch (e) {
          console.log(e);
        }
      }
      setYourLoogies(loogieUpdate.reverse());

      updateLoogieTanks();
    };
    updateYourCollectibles();
  }, [address, yourLoogieBalance, yourLoogieTankBalance]);

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

  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [transferToTankId, setTransferToTankId] = useState({});
  const [scale, setScale] = useState({});

  const [transferNFTFromAddress, setTransferNFTFromAddress] = useState({});
  const [transferIdToTank, setTransferIdToTank] = useState({});
  function mintHeader(readContract, writeContract, priceToDisplay, updateFunc) {
    return (
      <div>
        <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
          <Button type={"primary"} onClick={async () => {
            const priceRightNow = await readContract.price();
            try {
              const txCur = await tx(writeContract.mintItem({ value: priceRightNow }));
              await txCur.wait();
            } catch (e) {
              console.log("mint failed", e);
            }
          }}>MINT for Ξ{priceToDisplay && (+ethers.utils.formatEther(priceToDisplay)).toFixed(4)}</Button>
        <Button
          onClick={async () => await updateFunc()}>
        Refresh
        </Button>
        </div>
      </div>
    )
  }

  function transferNFTComponent(item, id, writeContract) {
    return (
      <div>
        owner:{" "}
        <Address
          address={item.owner}
          ensProvider={mainnetProvider}
          blockExplorer={blockExplorer}
          fontSize={16}
        />
        <AddressInput
          ensProvider={mainnetProvider}
          placeholder="transfer to address"
          value={transferToAddresses[id]}
          onChange={newValue => {
            const update = {};
            update[id] = newValue;
            setTransferToAddresses({ ...transferToAddresses, ...update });
          }}
        />
        <Button
          onClick={() => {
            tx(writeContract.transferFrom(address, transferToAddresses[id], id));
          }}
        >
          Transfer
        </Button>

      </div>
    )
  }

  function transferToTankComponent(item, id, writeContract) {
    return (
      <div>
        <AddressInput
          ensProvider={mainnetProvider}
          placeholder="SVG NFT address"
          value={transferNFTFromAddress[id]}
          onChange={newValue => {
            const update = {};
            update[id] = newValue;
            setTransferNFTFromAddress({ ...transferNFTFromAddress, ...update });
          }}
        />
        <Input
          placeholder="NFT ID"
          // value={transferToTankId[id]}
          onChange={newValue => {
            if (DEBUG) console.log("newValue", newValue.target.value);
            const update = {};
            update[id] = newValue.target.value;
            setTransferIdToTank({ ...transferIdToTank, ...update });
          }}
        />
        <Input
          placeholder="Scale; 0-original, 1-min, 9-max"
          // value={transferToTankId[id]}
          onChange={newValue => {
            if (DEBUG) console.log("newValue", newValue.target.value);
            const update = {};
            update[id] = newValue.target.value;
            setScale({ ...scale, ...update });
          }}
        />
        <Button
          onClick={async () => {
            let abi = ["function renderTokenById(uint256) public view returns (string memory)"];
            if (DEBUG) console.log(transferNFTFromAddress[id]);
            let nftContract = new ethers.Contract(transferNFTFromAddress[id], abi, localProvider);

            var scaleString="";
            if(scale[id]!="0") {
              scaleString = `values="0.${scale[id]} 0.${scale[id]}"`;
            }
            var _preview = await nftContract.renderTokenById(transferIdToTank[id]);
            _preview = (`<svg width="310" height="310" xmlns="http://www.w3.org/2000/svg">`+
            `<rect x="0" y="0" width="310" height="310" stroke="black" fill="#8FB9EB" stroke-width="5"/>`+
            `<g transform="translate(50 50)">`+
            `<animateTransform attributeName="transform" type="scale" additive="sum" ${scaleString}/>`+
            `${_preview}</g></svg>`);
            const update = {};
            update[id] = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(_preview)))}`;
            setPreviews({ ...previews, ...update });
          }}>
          Preview
        </Button>
        <br />
        <Button
          onClick={() => {
            let abi = ["function approve(address,uint256) public"];
            if (DEBUG) console.log(transferNFTFromAddress[id]);
            let nftContract = new ethers.Contract(transferNFTFromAddress[id], abi, userSigner);

            tx(nftContract["approve(address,uint256)"](readContracts.LoogieTank.address, transferIdToTank[id]));
          }}
        >
          Approve
        </Button>
        <Button
          onClick={() => {
            console.log(transferNFTFromAddress[id], transferIdToTank[id], id, scale[id]);

            tx(writeContracts.LoogieTank.transferNFT(transferNFTFromAddress[id], transferIdToTank[id], id, scale[id], {gasLimit: 1000000}));
          }}>
          Transfer
        </Button>
        {renderCard("Preview", previews[id], "Scaled NFT in tank")}
      </div>
    )
  }

  function renderCard(name, image, description) {
    // console.log(image);
    return (
      <div>
        <Card
          title={
            <div>
              <span style={{ fontSize: 18, marginRight: 8 }}>{name}</span>
            </div>
          }
        >
          <img src={image} />
          <div>{description}</div>
        </Card>

      </div>
    )
  }

  function transferNFTToLoogieTankComponent(writeContract, id) {
    return (
      <div>
        Transfer to Loogie Tank:{" "}
        <Address
          address={readContracts.LoogieTank.address}
          blockExplorer={blockExplorer}
          fontSize={16}
        />
        <Input
          placeholder="Tank ID"
          // value={transferToTankId[id]}
          onChange={newValue => {
            if (DEBUG) console.log("newValue", newValue.target.value);
            const update = {};
            update[id] = newValue.target.value;
            setTransferToTankId({ ...transferToTankId, ...update });
          }}
        /><br/><br/>
        <Input
          type="number"
          placeholder="0=no scaling, 1=min scaling, 9=max scaling"
          min={1}
          max={10}
          defaultValue={3}
          onChange = {newValue => {
            const _update = {};
            _update[id] = newValue.target.value;
            setScale({ ...scale, ..._update });
          }}
        />
        <Button
          onClick={() => {
            if (DEBUG) console.log("transferToTankId[id]", transferToTankId[id]);
            if (DEBUG) console.log(parseInt(transferToTankId[id]));

            const tankIdInBytes = "0x" + parseInt(transferToTankId[id]).toString(16).padStart(64, '0') + scale[id].padStart(2, '0');
            if (DEBUG) console.log(tankIdInBytes);

            tx(writeContract["safeTransferFrom(address,address,uint256,bytes)"](address, readContracts.LoogieTank.address, id, tankIdInBytes));
          }}>
          Transfer
        </Button>

      </div>
    )
  }

  function renderLoogies() {
    return (
      <div>
        {mintHeader(readContracts.Loogies, writeContracts.Loogies, loogiePrice, () => {})}

        <div style={{ width: 820, margin: "auto", paddingBottom: 256 }}>
          <List
            bordered
            dataSource={yourLoogies}
            renderItem={item => {
              const id = item.id.toNumber();

              if (DEBUG) console.log("IMAGE", item.image);

              return (
                <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                {renderCard(item.name, item.image, item.description)}

                  <div>
                    {transferNFTComponent(item, id, writeContracts.Loogies)}
                    <br /><br />
                    {transferNFTToLoogieTankComponent(writeContracts.Loogies, id)}
                  </div>
                </List.Item>
              );
            }}
          />
        </div>
      </div>
    );
  }

  function renderLoogieTank() {
    return (
      <div>
        {mintHeader(readContracts.LoogieTank, writeContracts.LoogieTank, loogieTankPrice, updateLoogieTanks)}

        <div style={{ width: 820, margin: "auto", paddingBottom: 256 }}>
          <List
            bordered
            dataSource={yourLoogieTanks}
            renderItem={item => {
              const id = item.id.toNumber();

              if (DEBUG) console.log("IMAGE", item.image);

              return (
                <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                  {renderCard(item.name, item.image, item.description)}

                  <div>
                    {transferNFTComponent(item, id, writeContracts.LoogieTank)}
                    <br /><br />
                    {transferToTankComponent(item, id, writeContracts.LoogieTank)}
                    <br /><br />
                    <Button
                      onClick={() => {
                        tx(writeContracts.LoogieTank.returnAll(id))
                      }}>
                      Eject Loogies
                        </Button>
                  </div>
                </List.Item>
              );
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      <NetworkDisplay
        NETWORKCHECK={NETWORKCHECK}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
      />
      <Menu style={{ textAlign: "center" }} selectedKeys={[location.pathname]} mode="horizontal">
        <Menu.Item key="/">
          <Link to="/">Mint Loogie Tank</Link>
        </Menu.Item>
        <Menu.Item key="/loogies">
          <Link to="/loogies">Transfer Loogies</Link>
        </Menu.Item>
        <Menu.Item key="/debug-loogie-tank">
          <Link to="/debug-loogie-tank">Debug Loogie Tank</Link>
        </Menu.Item>
        <Menu.Item key="/debug-loogie">
          <Link to="/debug-loogie">Debug Loogies</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/about">About</Link>
        </Menu.Item>
      </Menu>

      <Switch>
        <Route exact path="/debug-loogie">
          {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}

          <Contract
            name="Loogies"
            customContract={writeContracts && writeContracts.Loogies}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        </Route>
        <Route exact path="/debug-loogie-tank">
          <Contract
            name="LoogieTank"
            customContract={writeContracts && writeContracts.LoogieTank}
            signer={userSigner}
            provider={localProvider}
            address={address}
            chainId="69"
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        </Route>
        <Route exact path="/loogies">
          {renderLoogies()}
        </Route>
        <Route exact path="/">
          {renderLoogieTank()}
        </Route>
        <Route exact path="/about">
          <About />
        </Route>
      </Switch>
      <ThemeSwitch />

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <div style={{ marginRight: 20 }}>
            <NetworkSwitch
              networkOptions={networkOptions}
              selectedNetwork={selectedNetwork}
              setSelectedNetwork={setSelectedNetwork}
            />
          </div>
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
        </div>
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
