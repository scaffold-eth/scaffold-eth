import WalletConnectProvider from "@walletconnect/web3-provider";
//import Torus from "@toruslabs/torus-embed"
import WalletLink from "walletlink";
import { Alert, Button } from "antd";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import Web3Modal from "web3modal";
import { INFURA_ID, NETWORKS, ALCHEMY_KEY } from "../constants";
import { Transactor } from "../helpers";
import { useBalance, useContractLoader, useGasPrice, useOnBlock, useUserProviderAndSigner } from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";

// contracts
import deployedContracts from "../contracts/hardhat_contracts.json";
import externalContracts from "../contracts/external_contracts";

import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import Authereum from "authereum";

const { ethers } = require("ethers");

// create our app context
export const Web3Context = React.createContext({});

// provider Component that wraps the entire app and provides context variables
export function Web3Provider({ children, ...props }) {
  // for Nextjs Builds, return null until "window" is available
  if (!global.window) {
    return null;
  }

  const { network = "localhost", DEBUG = true, NETWORKCHECK = true } = props;

  // app states
  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();

  /// 📡 What chain are your contracts deployed to?
  const targetNetwork = NETWORKS[network]; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

  // 🛰 providers
  const scaffoldEthProvider = useMemo(() => {
    return navigator.onLine ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544") : null;
  }, [navigator.onLine]);
  const poktMainnetProvider = useMemo(() => {
    return navigator.onLine
      ? new ethers.providers.StaticJsonRpcProvider(
          "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
        )
      : null;
  }, [navigator.onLine]);
  const mainnetInfura = useMemo(() => {
    if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
    return navigator.onLine
      ? new ethers.providers.StaticJsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`)
      : null;
  }, [navigator.onLine]);
  const localProvider = useMemo(() => {
    // 🏠 Your local provider is usually pointed at your local blockchain
    const localProviderUrl = targetNetwork.rpcUrl;
    // as you deploy to other networks you can set PROVIDER=https://dai.poa.network in packages/react-app/.env
    const localProviderUrlFromEnv = process.env.NEXT_PUBLIC_PROVIDER
      ? process.env.NEXT_PUBLIC_PROVIDER
      : localProviderUrl;
    if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
    return new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);
  }, []);

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  /*
    Web3 modal helps us "connect" external wallets:
  */
  const web3Modal = useMemo(() => {
    // Coinbase walletLink init
    const walletLink = new WalletLink({
      appName: "coinbase",
    });

    // WalletLink provider
    const walletLinkProvider = walletLink.makeWeb3Provider(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`, 1);

    // Portis ID: 6255fb2b-58c8-433b-a2c9-62098c05ddc9
    return new Web3Modal({
      network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
      cacheProvider: true, // optional
      theme: "light", // optional. Change to "dark" for a dark theme.
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            bridge: "https://polygon.bridge.walletconnect.org",
            infuraId: INFURA_ID,
            rpc: {
              1: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
              42: `https://kovan.infura.io/v3/${INFURA_ID}`,
              100: "https://dai.poa.network", // xDai
            },
          },
        },
        portis: {
          display: {
            logo: "https://user-images.githubusercontent.com/9419140/128913641-d025bc0c-e059-42de-a57b-422f196867ce.png",
            name: "Portis",
            description: "Connect to Portis App",
          },
          package: Portis,
          options: {
            id: "6255fb2b-58c8-433b-a2c9-62098c05ddc9",
          },
        },
        fortmatic: {
          package: Fortmatic, // required
          options: {
            key: "pk_live_5A7C91B2FC585A17", // required
          },
        },
        // torus: {
        //   package: Torus,
        //   options: {
        //     networkParams: {
        //       host: "https://localhost:8545", // optional
        //       chainId: 1337, // optional
        //       networkId: 1337 // optional
        //     },
        //     config: {
        //       buildEnv: "development" // optional
        //     },
        //   },
        // },
        "custom-walletlink": {
          display: {
            logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
            name: "Coinbase",
            description: "Connect to Coinbase Wallet (not Coinbase App)",
          },
          package: walletLinkProvider,
          connector: async (provider, _options) => {
            await provider.enable();
            return provider;
          },
        },
        authereum: {
          package: Authereum, // required
        },
      },
    });
  }, []);

  const mainnetProvider =
    poktMainnetProvider && poktMainnetProvider._isProvider
      ? poktMainnetProvider
      : scaffoldEthProvider && scaffoldEthProvider._network
      ? scaffoldEthProvider
      : mainnetInfura;

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

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(localProvider, gasPrice);

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(localProvider, address);

  // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(mainnetProvider, address);

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

  /*
  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");
  console.log("🏷 Resolved austingriffith.eth as:",addressFromENS)
  */

  //
  // 🧫 DEBUG 👨🏻‍🔬
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
    if (web3Modal && web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [web3Modal]);

  let faucetHint = "";
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const [faucetClicked, setFaucetClicked] = useState(false);
  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId === 31337 &&
    yourLocalBalance &&
    ethers.utils.formatEther(yourLocalBalance) <= 0
  ) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            faucetTx({
              to: address,
              value: ethers.utils.parseEther("0.01"),
            });
            setFaucetClicked(true);
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    );
  }

  // use props as a way to pass configuration values
  const providerProps = {
    ...props,
    network,
    DEBUG,
    NETWORKCHECK,
    tx,
    price,
    gasPrice,
    selectedChainId,
    localChainId,
    localProvider,
    userSigner,
    readContracts,
    writeContracts,
    mainnetProvider,
    yourMainnetBalance,
    address,
    blockExplorer,
    faucetHint,
    web3Modal,
    faucetAvailable,
    loadWeb3Modal,
    logoutOfWeb3Modal,
    contractConfig,
    targetNetwork,
  };

  return <Web3Context.Provider value={providerProps}>{children}</Web3Context.Provider>;
}

export function Web3Consumer(Component) {
  return function HOC(pageProps) {
    return <Web3Context.Consumer>{web3Values => <Component web3={web3Values} {...pageProps} />}</Web3Context.Consumer>;
  };
}
