import App from "./App";

import "antd/dist/antd.css";
import { useBalance, useContractLoader, useContractReader, useGasPrice, useUserProviderAndSigner } from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";
import { ALCHEMY_KEY, NETWORKS } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
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

const web3Modal = Web3ModalSetup();

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 🛰 providers
const providers = [
  `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  "https://rpc.scaffoldeth.io:48544",
];

const POLL_TIME = 5000;
const USE_BURNER_WALLET = true; // toggle burner wallet feature

function AppLoaders({ subgraphUri }) {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, "mainnet", "goerli"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);

  const targetNetwork = NETWORKS[selectedNetwork];

  // check the current network name
  const isMainnet = targetNetwork.name === "mainnet";

  // if current network is mainnet then  provider will be mainnet provider and mainnetProvider will be null
  const { provider, mainnetProvider } = useStaticJsonRPC(
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
    providers,
    isMainnet,
  );

  const isMainnetProvider = mainnetProvider === null;

  useEffect(() => {
    if (provider !== null) {
      setIsLoaded(true);
    }
  }, [provider, mainnetProvider]);

  // /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(
    targetNetwork,
    isMainnetProvider ? provider : mainnetProvider,
    isLoaded ? POLL_TIME : 500,
  );

  // /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast", isLoaded ? POLL_TIME : 500);
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(
    injectedProvider,
    // isMainnetProvider ? provider : mainnetProvider,
    provider,
    USE_BURNER_WALLET,
  );
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

  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(provider, address, POLL_TIME);

  // // Just plug in different 🛰 providers to get your balance on different chains:
  const yourMainnetBalance = useBalance(isMainnetProvider ? provider : mainnetProvider, address);

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

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  return (
    <div className="">
      <App
        provider={provider}
        mainnetProvider={mainnetProvider}
        price={price}
        gasPrice={gasPrice}
        userSigner={userSigner}
        address={address}
        yourLocalBalance={yourLocalBalance}
        yourMainnetBalance={yourMainnetBalance}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        subgraphUri={subgraphUri}
      />
    </div>
  );
}

export default AppLoaders;
