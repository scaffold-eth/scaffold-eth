import { Button } from "antd";

import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  // useOnBlock,
  // useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
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
import { getRPCPollTime, Web3ModalSetup } from "./helpers";
import { PayToVendor, SelectVendor, ClaimTokens, TransferTokens } from "./views";
import { useStaticJsonRPC, useGasPrice, useUserProviderAndSigner } from "./hooks";
import { Web3Provider, Contract as ContractZK } from "zksync-web3";

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
const initialNetwork = NETWORKS.zksyncalpha; // <------- select your target frontend network (localhost, goerli, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;
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
  const networkOptions = [initialNetwork.name, "mainnet", "goerli"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);

  const [useBurnerWallet, setUseBurnerWallet] = useState(localStorage.getItem("useBurnerWallet"));

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);

  const mainnetProvider = useStaticJsonRPC(providers, localProvider);

  // Sensible pollTimes depending on the provider you are using
  const localProviderPollingTime = getRPCPollTime(localProvider);
  const mainnetProviderPollingTime = getRPCPollTime(mainnetProvider);

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
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider, mainnetProviderPollingTime);

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "FastGasPrice", localProviderPollingTime);
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, useBurnerWallet);
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
  // const tx = Transactor(userSigner, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address, localProviderPollingTime);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address, mainnetProviderPollingTime);

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

  // If you want to call a function on a new block
  // useOnBlock(mainnetProvider, () => {
  //   console.log(`⛓ A new mainnet block is here: ${mainnetProvider._lastBlockNumber}`);
  // });

  // Then read your DAI balance like:
  /*
  const myMainnetDAIBalance = useContractReader(
    mainnetContracts,
    "DAI",
    "balanceOf",
    ["0x34aA3F359A9D614239015126635CE7732c18fDF3"],
    mainnetProviderPollingTime,
  );
  */

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:", addressFromENS)
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
  ]);

  const loadWeb3Modal = useCallback(async () => {
    //const provider = await web3Modal.connect();
    const provider = await web3Modal.requestProvider();
    setInjectedProvider(new Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new Web3Provider(provider));
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
    //automatically connect if it is a safe app
    const checkSafeApp = async () => {
      if (await web3Modal.isSafeApp()) {
        loadWeb3Modal();
      }
    };
    checkSafeApp();
  }, [loadWeb3Modal]);

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  // mainnet
  const vendorsByChainId = {
    270: [
      { label: "Vendor1", value: "0x0D43eB5B8a47bA8900d84AA36656c92024e9772e" },
      { label: "Vendor2", value: "0x7f1A8F0811Bf6700c3bc98342758145113c58E4A" },
    ],
    280: [
      { label: "Vendor1", value: "0x0dc01C03207fB73937B4aC88d840fBBB32e8026d" },
      { label: "Vendor2", value: "0x7EBa38e027Fa14ecCd87B8c56a49Fa75E04e7B6e" },
    ],
    324: [
      { label: "Pepsi Roadhouse Concessions (1)", value: "0x2406Fb7143f22F221e74524aA25bd0F7FFA6bA66" },
      { label: "Pepsi Roadhouse Concessions (2)", value: "0x8CE80Adea55F41D874398b2EF80c31216B929521" },
      { label: "The Cafeteria (1)", value: "0xDA55D516b2438645e0FC31aC448d0900aD78045f" },
      { label: "The Cafeteria (2)", value: "0xdCE10742Ab93587DF464935C0063b1ba5db02968" },
      { label: "Stadium Grill (1)", value: "0xe664c6454300f48942239605810178221b34959f" },
      { label: "Stadium Grill (2)", value: "0xc4779195760540E2CBF73d855695D8537b1f545E" },
      { label: "BBB Lounge (1) ", value: "0xa65150551B77719E31eBfe395c3f0A009aD0c19e" },
      { label: "Gourmet Coffee Lounge (1)", value: "0xBb101CBEE74549768E8495877109B0A788245B09" },
      { label: "Network Lounge (1) ", value: "0xf5d2d68377725aC40719Fa1AEd5f9cF1457D0BE7" },
      { label: "BUIDLathon bodega (1)", value: "0x642cfD51f29E383fCB9f726eC0CCD0B03Cf723Cb" },
      { label: "Mainstage (1)", value: "0x9BFCD4dB79a3D513f28aEcaff1b962F163bA57BD" },
      { label: "Original by Greeks (1) ", value: "0x837717d8fCaF2ec72c132FEe49f4BE3Ddf27b501" },
      { label: "elevation 5280 smokehouse (1) ** ", value: "0xfe7835f82181db55236BC998234A2C6c7030Ba82" },
      { label: "high society pizza (1) ", value: "0x41436B6F50DcfCa53b357C81a9D6C88349cC8e19" },
      { label: "Downtown Fingers (1) ", value: "0x71cFB7Ff2cb34c9d86D02BBC0967264108c19FdB" },
      { label: "Denver Taco Truck (1)", value: "0x9598cd29af4368d49270DB724E7511CCcD2e4be8" },
      { label: "Cheese Love Grill (1)", value: "0x8360F4F9Ba02a131757EAFECE17bc814313a61de" },
      { label: "Arcade 1", value: "0x31edD5A882583CBf3A712E98E100Ef34aD6934b4" },
    ],
  };

  const paymasterByChanId = {
    270: "0x628e8b27F0c5c443a68297893c920328dD18e611",
    280: "0x7F904e350F27aF4D4A70994AE1f3bBC1dAfEe665",
    324: "0xfC5B07a5dd1b80cf271D35642f75cC0500fF1e2C",
  };

  const apiUrlByChainId = {
    270: "https://staging.ethdenver2023.zksync.dev",
    280: "https://staging.ethdenver2023.zksync.dev",
    324: "https://ethdenver2023.zksync.dev",
  };

  const [contractBuidl, setContractBuidl] = useState();
  const [balance, setBalance] = useState();
  const [vendors, setVendors] = useState();
  const [paymasterAddress, setPaymasterAddress] = useState();
  const [apiUrl, setApiUrl] = useState();

  useEffect(() => {
    setVendors(vendorsByChainId[localChainId]);
    setPaymasterAddress(paymasterByChanId[localChainId]);
    setApiUrl(apiUrlByChainId[localChainId]);
  }, [localChainId]);

  const abi = externalContracts[localChainId]?.contracts.BuidlBuxx.abi;
  const BUIDLBUXX_ADDRESS = externalContracts[localChainId]?.contracts.BuidlBuxx.address;

  useEffect(() => {
    const updateContractBuidl = async () => {
      if (BUIDLBUXX_ADDRESS && abi) {
        const newContractBuidl = new ContractZK(BUIDLBUXX_ADDRESS, abi, userSigner);
        console.log("newContractBuidl: ", newContractBuidl);
        setContractBuidl(newContractBuidl);
      }
    };
    updateContractBuidl();
  }, [BUIDLBUXX_ADDRESS, abi, userSigner]);

  const updateBalanceBuidl = async () => {
    if (contractBuidl && address) {
      const newBalance = await contractBuidl.balanceOf(address);
      console.log("newBalance: ", (newBalance / 100).toString());
      setBalance((newBalance / 100).toString());
    }
  };

  useEffect(() => {
    updateBalanceBuidl();
  }, [contractBuidl, address]);

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header>
        {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flex: 1 }}>
            {!useBurnerWallet && (
              <div style={{ marginRight: 30 }}>
                <Button
                  onClick={() => {
                    setUseBurnerWallet(true);
                    localStorage.setItem("useBurnerWallet", true);
                  }}
                >
                  Enable Burner Wallet
                </Button>
              </div>
            )}
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
              useBurner={useBurnerWallet}
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
        </div>
      </Header>
      {yourLocalBalance.lte(ethers.BigNumber.from("0")) && (
        <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
      )}
      <NetworkDisplay
        NETWORKCHECK={NETWORKCHECK}
        localChainId={localChainId}
        selectedChainId={selectedChainId}
        targetNetwork={targetNetwork}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        USE_NETWORK_SELECTOR={USE_NETWORK_SELECTOR}
      />

      <Switch>
        <Route exact path="/">
          <div className="px-4">
            <h2 className="text-xl shadow-sm font-bold font-mono">Buidl Balance: {balance}</h2>

            {balance > 0 && (
              <SelectVendor
                provider={localProvider}
                userSigner={userSigner}
                updateBalanceBuidl={updateBalanceBuidl}
                contractBuidl={contractBuidl}
                vendors={vendors}
              />
            )}
            <ClaimTokens
              userSigner={userSigner}
              address={address}
              updateBalanceBuidl={updateBalanceBuidl}
              apiUrl={apiUrl}
              localChainId={localChainId}
            />
            {balance > 0 && (
              <TransferTokens
                provider={localProvider}
                userSigner={userSigner}
                mainnetProvider={mainnetProvider}
                updateBalanceBuidl={updateBalanceBuidl}
                contractBuidl={contractBuidl}
              />
            )}
          </div>
        </Route>
        <Route exact path="/pay">
          <h2>Buidl Balance: {balance}</h2>
          <PayToVendor
            provider={localProvider}
            userSigner={userSigner}
            updateBalanceBuidl={updateBalanceBuidl}
            contractBuidl={contractBuidl}
            vendors={vendors}
            paymasterAddress={paymasterAddress}
          />
        </Route>
        <Route exact path="/claim">
          <span className="text-xl">Buidl Balance: {balance}</span>
          <ClaimTokens
            userSigner={userSigner}
            address={address}
            updateBalanceBuidl={updateBalanceBuidl}
            apiUrl={apiUrl}
            localChainId={localChainId}
          />
        </Route>
        <Route exact path="/debug">
          {/*
                🎛 this scaffolding is full of commonly used components
                this <Contract/> component will automatically parse your ABI
                and give you a form to interact with it locally
            */}

          <Contract
            name="BuidlBuxx"
            price={price}
            signer={userSigner}
            provider={localProvider}
            address={address}
            blockExplorer={blockExplorer}
            contractConfig={contractConfig}
          />
        </Route>
      </Switch>

      <ThemeSwitch />
    </div>
  );
}

export default App;
