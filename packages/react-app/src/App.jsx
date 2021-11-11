import WalletConnectProvider from "@walletconnect/web3-provider";
//import Torus from "@toruslabs/torus-embed"
import WalletLink from "walletlink";
import { Alert, Button, Card, Col, Input, List, Menu, Row, Tabs, Dropdown, Badge } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";
import "./App.css";
import { Account, Address, AddressInput, Contract, Faucet, GasGauge, Header, Ramp, ThemeSwitch, Footer } from "./components";
import { INFURA_ID, NETWORK, NETWORKS } from "./constants";
import { Transactor } from "./helpers";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";

import { useContractConfig } from "./hooks";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import Authereum from "authereum";

const { ethers } = require("ethers");
const { TabPane } = Tabs;
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
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544")
  : null;
const poktMainnetProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider(
      "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
    )
  : null;
const mainnetInfura = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
  : null;
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID
// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

// Coinbase walletLink init
const walletLink = new WalletLink({
  appName: "coinbase",
});

// WalletLink provider
const walletLinkProvider = walletLink.makeWeb3Provider(`https://mainnet.infura.io/v3/${INFURA_ID}`, 1);

// Portis ID: 6255fb2b-58c8-433b-a2c9-62098c05ddc9
/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
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
          1: `https://mainnet.infura.io/v3/${INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
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

function App(props) {
  const mainnetProvider =
    poktMainnetProvider && poktMainnetProvider._isProvider
      ? poktMainnetProvider
      : scaffoldEthProvider && scaffoldEthProvider._network
      ? scaffoldEthProvider
      : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();

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

  const contractConfig = useContractConfig();

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  const nfts = ["Bow", "Mouth", "Eyelash", "Mustache", "ContactLenses"];

  const nftsSvg = {
    Bow: (
      <g class="bow" transform="translate(0,0) scale(0.07 0.07)">
        <path fill="#1890ff" d="M476.532,135.396c-12.584-7.796-29-7.356-46.248,1.228l-117.868,59.88c-10.048-9.7-23.728-14.452-38.816-14.452h-50.156c-15.204,0-28.992,4.828-39.064,14.652L66.1,137.256c-17.232-8.58-33.836-9.336-46.412-1.544C7.1,143.508,0,158.1,0,177.368v141.104c0,19.268,7.1,34.18,19.68,41.96c5.972,3.708,12.904,5.556,20.28,5.556c8.164,0,17.04-2.256,26.092-6.764l118.312-58.14c10.072,9.824,23.88,16.588,39.08,16.588H273.6c15.084,0,28.78-6.692,38.82-16.396l117.884,58.276c9.068,4.512,17.9,6.596,26.064,6.596c7.388,0,14.192-1.928,20.164-5.636C489.108,352.72,496,337.744,496,318.476V177.368C496,158.1,489.108,143.192,476.532,135.396z"/>
      </g>
    ),
    Mouth: (
      <g transform="translate(-32,-35) scale(0.25 0.25)">
        <g id="head">
          <ellipse fill="transparent" stroke-width="1" cx="204.5" cy="211.80065" id="svg_5" rx="65" ry="51.80065" stroke="gray"/>
        </g>
        <g class="mouth" transform="translate(24,0)">
          <path d="M 130 240 Q 165 250 195 235" stroke="#1890ff" stroke-width="3" fill="transparent"/>
        </g>
      </g>
    ),
    Eyelash: (
      <g class="eyelash" transform="translate(-60,-45) scale(0.4 0.4)">
        <g id="eye1">
          <ellipse stroke-width="1" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="gray" fill="#fff"/>
        </g>
        <g id="eye2">
          <ellipse stroke-width="1" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="gray" fill="#fff"/>
        </g>
        <path d="M 164 130 Q 154 125 169 120" stroke-width="1" fill="transparent" stroke="#1890ff" />
        <path d="M 171 127 Q 161 122 176 117" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 179 125 Q 169 120 184 115" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 186 126 Q 176 121 191 116" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 194 127 Q 184 122 199 117" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 196 142 Q 186 137 201 132" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 203 140 Q 193 135 208 130" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 211 139 Q 201 134 216 129" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 218 141 Q 208 136 223 131" stroke="#1890ff" stroke-width="1" fill="transparent"/>
        <path d="M 226 143 Q 216 138 231 133" stroke="#1890ff" stroke-width="1" fill="transparent"/>
      </g>
    ),
    Mustache: (
      <g class="mustache" transform="translate(0,0) scale(1.40 1.40)">,
        <path fill="#1890ff" d="M21.455,13.025c-0.604-3.065-5.861-4.881-7.083-2.583c-1.22-2.299-6.477-0.483-7.081,2.583C6.501,16.229,2.321,17.11,0,15.439c0,3.622,3.901,3.669,6.315,3.9c5.718-0.25,7.525-2.889,8.057-4.093c0.532,1.205,2.34,3.843,8.058,4.093c2.416-0.231,6.315-0.278,6.315-3.9C26.423,17.11,22.244,16.229,21.455,13.025z"/>
      </g>
    ),
    ContactLenses: (
      <g class="contact-lenses" transform="translate(-60,-47) scale(0.4 0.4)">
        <g id="eye1">
          <ellipse stroke-width="1" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="gray" fill="#fff"/>
          <ellipse ry="3.5" rx="2.5" id="svg_3" cy="154.5" cx="173.5" stroke-width="3" stroke="#1890ff" fill="#000000"/>
        </g>
        <g id="eye2">
          <ellipse stroke-width="1" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="gray" fill="#fff"/>
          <ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#000000" stroke="#1890ff"/>
        </g>
      </g>
    ),
  };

  const [updateBalances, setUpdateBalances] = useState(0);
  const [nftBalance, setNftBalance] = useState({});
  const [yourNftBalance, setYourNftBalance] = useState({});
  const [loogieBalance, setLoogieBalance] = useState(0);
  const [yourLoogieBalance, setYourLoogieBalance] = useState(0);
  const [fancyLoogieBalance, setFancyLoogieBalance] = useState(0);
  const [yourFancyLoogieBalance, setYourFancyLoogieBalance] = useState(0);
  const [yourNftTotalBalance, setYourNftTotalBalance] = useState(0);
  const [fancyLoogieContracts, setFancyLoogieContracts] = useState([]);
  const [yourLoogies, setYourLoogies] = useState();
  const [yourNfts, setYourNfts] = useState({});
  const [yourFancyLoogies, setYourFancyLoogies] = useState();
  const [yourLoogiesApproved, setYourLoogiesApproved] = useState({});
  const [fancyLoogiesNfts, setFancyLoogiesNfts] = useState();
  const [selectedFancyLoogie, setSelectedFancyLoogie] = useState();
  const [selectedNfts, setSelectedNfts] = useState({});
  const [selectedFancyLoogiePreview, setSelectedFancyLoogiePreview] = useState({});

  useEffect(() => {
    const updateFancyLoogieContracts = async () => {
      if (readContracts.FancyLoogie) {
        if (DEBUG) console.log("Updating FancyLoogie contracts address...");
        const fancyLoogieContractsAddress = await readContracts.FancyLoogie.getContractsAddress();
        if (DEBUG) console.log("🤗 fancy loogie contracts:", fancyLoogieContractsAddress);
        setFancyLoogieContracts(fancyLoogieContractsAddress);
      }
    };
    updateFancyLoogieContracts();
  }, [address, readContracts.FancyLoogie]);

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating balances...");
      let contractsDefined = true;
      if (!readContracts.Loogies || !readContracts.FancyLoogie) {
        contractsDefined = false;
      }
      for (let nftIndex = 0; nftIndex < nfts.length; nftIndex++) {
        const nft = nfts[nftIndex];
        if (!readContracts[nft]) {
          contractsDefined = false;
        }
      };
      if (contractsDefined) {
        const loogieNewBalance = await readContracts.Loogies.balanceOf(address);
        const yourLoogieNewBalance = loogieNewBalance && loogieNewBalance.toNumber && loogieNewBalance.toNumber();
        if (DEBUG) console.log("NFT: Loogie - Balance: ", loogieNewBalance);
        const fancyLoogieNewBalance = await readContracts.FancyLoogie.balanceOf(address);
        if (DEBUG) console.log("NFT: FancyLoogie - Balance: ", fancyLoogieNewBalance);
        const yourFancyLoogieNewBalance = fancyLoogieNewBalance && fancyLoogieNewBalance.toNumber && fancyLoogieNewBalance.toNumber();
        const nftNewBalance = {};
        for (let nftIndex = 0; nftIndex < nfts.length; nftIndex++) {
          const nft = nfts[nftIndex];
          nftNewBalance[nft] = await readContracts[nft].balanceOf(address);
          if (DEBUG) console.log("NFT: ", nft, " - Balance: ", nftNewBalance[nft]);
        };
        let yourNftTotalNewBalance = 0;
        const yourNftNewBalance = {};
        nfts.forEach(function (nft) {
          yourNftNewBalance[nft] = nftNewBalance[nft] && nftNewBalance[nft].toNumber && nftNewBalance[nft].toNumber();
          if (yourNftNewBalance[nft] > 0) {
            yourNftTotalNewBalance += yourNftNewBalance[nft];
          }
        });
        if (DEBUG) console.log("TOTAL NFT Balance: ", yourNftTotalNewBalance);
        setNftBalance(nftNewBalance);
        setYourNftBalance(yourNftNewBalance);
        setLoogieBalance(loogieNewBalance);
        setYourLoogieBalance(yourLoogieNewBalance);
        setFancyLoogieBalance(fancyLoogieNewBalance);
        setYourFancyLoogieBalance(yourFancyLoogieNewBalance);
        setYourNftTotalBalance(yourNftTotalNewBalance);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updateBalances();
  }, [address, readContracts, readContracts.length, updateBalances]);

  useEffect(() => {
    const updateYourCollectibles = async () => {
      const loogieUpdate = [];
      const loogieApproved = {};
      for (let tokenIndex = 0; tokenIndex < yourLoogieBalance; tokenIndex++) {
        try {
          const tokenId = await readContracts.Loogies.tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting Loogie tokenId: ", tokenId);
          const tokenURI = await readContracts.Loogies.tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));

          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            loogieUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
            let approved = await readContracts.Loogies.getApproved(tokenId);
            loogieApproved[tokenId] = approved;
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourLoogies(loogieUpdate.reverse());
      setYourLoogiesApproved(loogieApproved);

      const nftUpdate = {};

      for (const nft of nfts) {
        nftUpdate[nft] = [];
        for (let tokenIndex = 0; tokenIndex < yourNftBalance[nft]; tokenIndex++) {
          try {
            const tokenId = await readContracts[nft].tokenOfOwnerByIndex(address, tokenIndex);
            if (DEBUG) console.log("Getting ", nft, " tokenId: ", tokenId);
            const tokenURI = await readContracts[nft].tokenURI(tokenId);
            if (DEBUG) console.log("tokenURI: ", tokenURI);
            const jsonManifestString = atob(tokenURI.substring(29));

            try {
              const jsonManifest = JSON.parse(jsonManifestString);
              nftUpdate[nft].unshift({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
            } catch (e) {
              console.log(e);
            }
          } catch (e) {
            console.log(e);
          }
        }
      }

      setYourNfts(nftUpdate);

      const fancyLoogieUpdate = [];
      const fancyLoogiesNftsUpdate = {};
      for (let tokenIndex = 0; tokenIndex < yourFancyLoogieBalance; tokenIndex++) {
        try {
          const tokenId = await readContracts.FancyLoogie.tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting FancyLoogie tokenId: ", tokenId);
          const tokenURI = await readContracts.FancyLoogie.tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));

          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            fancyLoogieUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
            fancyLoogiesNftsUpdate[tokenId] = {};
            for (let contractIndex = 0; contractIndex < fancyLoogieContracts.length; contractIndex++) {
              const contractAddress = fancyLoogieContracts[contractIndex];
              const nftId = await readContracts.FancyLoogie.nftId(contractAddress, tokenId);
              fancyLoogiesNftsUpdate[tokenId][contractAddress] = nftId.toString();
            }
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourFancyLoogies(fancyLoogieUpdate.reverse());
      setFancyLoogiesNfts(fancyLoogiesNftsUpdate);
    };
    updateYourCollectibles();
  }, [address, yourLoogieBalance, yourFancyLoogieBalance, yourNftTotalBalance]);

  useEffect(() => {
    const updatePreview = async () => {
      if (selectedFancyLoogie) {
        let nftUpdate = {};
        const loogieSvg = await readContracts.FancyLoogie.renderTokenById(selectedFancyLoogie);
        let nftsSvg = "";
        for (const nft of nfts) {
          if (selectedNfts[nft]) {
            nftsSvg += await readContracts[nft].renderTokenById(selectedNfts[nft]);
          }
          const svg =
            '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">' + loogieSvg + nftsSvg + "</svg>";
          setSelectedFancyLoogiePreview(svg);
        }
      } else {
        setSelectedFancyLoogiePreview("");
      }
    };
    updatePreview();
  }, [address, selectedFancyLoogie, selectedNfts]);

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

  let networkDisplay = "";
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network ID"
            description={
              <div>
                You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
                HardHat.
                <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    } else {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network"
            description={
              <div>
                You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
                <Button
                  onClick={async () => {
                    const ethereum = window.ethereum;
                    const data = [
                      {
                        chainId: "0x" + targetNetwork.chainId.toString(16),
                        chainName: targetNetwork.name,
                        nativeCurrency: targetNetwork.nativeCurrency,
                        rpcUrls: [targetNetwork.rpcUrl],
                        blockExplorerUrls: [targetNetwork.blockExplorer],
                      },
                    ];
                    console.log("data", data);

                    let switchTx;
                    // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
                    try {
                      switchTx = await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: data[0].chainId }],
                      });
                    } catch (switchError) {
                      // not checking specific error code, because maybe we're not using MetaMask
                      try {
                        switchTx = await ethereum.request({
                          method: "wallet_addEthereumChain",
                          params: data,
                        });
                      } catch (addError) {
                        // handle "add" error
                      }
                    }

                    if (switchTx) {
                      console.log(switchTx);
                    }
                  }}
                >
                  <b>{networkLocal && networkLocal.name}</b>
                </Button>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    }
  } else {
    networkDisplay = (
      <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
        {targetNetwork.name}
      </div>
    );
  }

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

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

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

  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [transferToTankId, setTransferToTankId] = useState({});

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Header />
      {networkDisplay}

      <Row>
        <Col flex="auto">
          <Tabs defaultActiveKey="/" tabPosition="left">
            <TabPane tab={
                <div class="tab-item">
                  <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" style={{ float: "left" }}>
                    <g transform="translate(-23,-22) scale(0.22 0.22)">
                      <g id="eye1">
                        <ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="#000" fill="#fff"/>
                        <ellipse ry="3.5" rx="2.5" id="svg_3" cy="154.5" cx="173.5" stroke-width="3" stroke="#000" fill="#000000"/>
                      </g>
                      <g id="head">
                        <ellipse fill="#4c2228" stroke-width="3" cx="204.5" cy="211.80065" id="svg_5" rx="57" ry="51.80065" stroke="#000"/>
                      </g>
                      <g id="eye2">
                        <ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="#000" fill="#fff"/>
                        <ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#000000" stroke="#000"/>
                      </g>
                      <g class="bow" transform="translate(180,235) scale(0.10 0.10)">
                        <path fill="#7a8c22" d="M476.532,135.396c-12.584-7.796-29-7.356-46.248,1.228l-117.868,59.88c-10.048-9.7-23.728-14.452-38.816-14.452h-50.156c-15.204,0-28.992,4.828-39.064,14.652L66.1,137.256c-17.232-8.58-33.836-9.336-46.412-1.544C7.1,143.508,0,158.1,0,177.368v141.104c0,19.268,7.1,34.18,19.68,41.96c5.972,3.708,12.904,5.556,20.28,5.556c8.164,0,17.04-2.256,26.092-6.764l118.312-58.14c10.072,9.824,23.88,16.588,39.08,16.588H273.6c15.084,0,28.78-6.692,38.82-16.396l117.884,58.276c9.068,4.512,17.9,6.596,26.064,6.596c7.388,0,14.192-1.928,20.164-5.636C489.108,352.72,496,337.744,496,318.476V177.368C496,158.1,489.108,143.192,476.532,135.396z"/>
                      </g>
                      <g class="mustache" transform="translate(140,195) scale(1.50 1.50)">
                        <path fill="#ba27d3" d="M21.455,13.025c-0.604-3.065-5.861-4.881-7.083-2.583c-1.22-2.299-6.477-0.483-7.081,2.583C6.501,16.229,2.321,17.11,0,15.439c0,3.622,3.901,3.669,6.315,3.9c5.718-0.25,7.525-2.889,8.057-4.093c0.532,1.205,2.34,3.843,8.058,4.093c2.416-0.231,6.315-0.278,6.315-3.9C26.423,17.11,22.244,16.229,21.455,13.025z"/>
                      </g>
                      <path d="M 164 130 Q 154 125 169 110" stroke="black" stroke-width="1" fill="transparent"/>
                      <path d="M 171 127 Q 161 122 176 107" stroke="black" stroke-width="1" fill="transparent"/>
                      <path d="M 179 125 Q 169 120 184 105" stroke="black" stroke-width="1" fill="transparent"/>
                      <path d="M 186 126 Q 176 121 191 106" stroke="black" stroke-width="1" fill="transparent"/>
                      <path d="M 194 127 Q 184 122 199 107" stroke="black" stroke-width="1" fill="transparent"/>
                      <path d="M 196 142 Q 186 137 201 122" stroke="black" stroke-width="1" fill="transparent"/>
                      <path d="M 203 140 Q 193 135 208 120" stroke="black" stroke-width="1" fill="transparent"/>
                      <path d="M 211 139 Q 201 134 216 119" stroke="black" stroke-width="1" fill="transparent"/>
                      <path d="M 218 141 Q 208 136 223 121" stroke="black" stroke-width="1" fill="transparent"/>
                      <path d="M 226 143 Q 216 138 231 123" stroke="black" stroke-width="1" fill="transparent"/>

                      <g class="mouth" transform="translate(27,0)">
                        <path d="M 130 240 Q 165 250 190 235" stroke="black" stroke-width="3" fill="transparent"/>
                      </g>
                    </g>
                  </svg>
                  <Badge count={yourFancyLoogies && yourFancyLoogies.length}>
                    <p style={{ float: "left", marginBottom: 0, fontSize: 24, fontWeight: "bold", marginLeft: 5 }}>FancyLoogies</p>
                  </Badge>
                </div>
              }
              key="/"
            >
              <div style={{ width: 515, margin: "0 auto", paddingBottom: 256 }}>
                <List
                  bordered
                  dataSource={yourFancyLoogies}
                  renderItem={item => {
                    const id = item.id.toNumber();

                    return (
                      <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                        <Card
                          title={
                            <div>
                              <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                              {selectedFancyLoogie != id ? (
                                <Button
                                  className="action-inline-button"
                                  onClick={() => {
                                    setSelectedFancyLoogie(id);
                                  }}
                                >
                                  Select to wear
                                </Button>
                              ) : (
                                <Button className="action-inline-button" disabled>
                                  Selected
                                </Button>
                              )}
                              <Dropdown overlay={
                                <Menu>
                                  <Menu.Item key="downgrade">
                                    <Button
                                      className="fancy-loogie-action-button action-button"
                                      onClick={() => {
                                        tx(writeContracts.FancyLoogie.downgradeLoogie(id), function (transaction) {
                                          if (transaction.status == "confirmed") {
                                            setUpdateBalances(updateBalances + 1);
                                          }
                                        });
                                      }}
                                    >
                                      Downgrade
                                    </Button>
                                  </Menu.Item>
                                  {nfts.map(function (nft) {
                                    return fancyLoogiesNfts &&
                                      fancyLoogiesNfts[id] &&
                                      fancyLoogiesNfts[id][readContracts[nft].address] > 0 && (
                                        <Menu.Item key={"remove-"+nft}>
                                          <Button
                                            className="fancy-loogie-action-button action-button"
                                            onClick={() => {
                                              tx(writeContracts.FancyLoogie.removeNftFromLoogie(readContracts[nft].address, id), function (transaction) {
                                                if (transaction.status == "confirmed") {
                                                  setUpdateBalances(updateBalances + 1);
                                                }
                                              });
                                            }}
                                          >
                                            Remove {nft}
                                          </Button>
                                        </Menu.Item>
                                      );
                                  })}
                                </Menu>
                              }>
                                <Button>
                                  Actions <DownOutlined />
                                </Button>
                              </Dropdown>
                            </div>
                          }
                        >
                          <img src={item.image} />
                          <div style={{ height: 90 }}>
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
                                tx(writeContracts.FancyLoogie.transferFrom(address, transferToAddresses[id], id), function (transaction) {
                                  if (transaction.status == "confirmed") {
                                    setUpdateBalances(updateBalances + 1);
                                  }
                                });
                              }}
                            >
                              Transfer
                            </Button>
                          </div>
                        </Card>
                      </List.Item>
                    );
                  }}
                />
              </div>
            </TabPane>
            <TabPane
              tab={
                <div class="tab-item">
                  <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" style={{ float: "left" }}>
                    <g transform="translate(-20,-20) scale(0.2 0.2)">
                      <g id="eye1">
                        <ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="#000" fill="#fff"/>
                        <ellipse ry="3.5" rx="2.5" id="svg_3" cy="154.5" cx="173.5" stroke-width="3" stroke="#000" fill="#000000"/>
                      </g>
                      <g id="head">
                        <ellipse fill="#1890ff" stroke-width="3" cx="204.5" cy="211.80065" id="svg_5" rx="65" ry="51.80065" stroke="#000"/>
                      </g>
                      <g id="eye2">
                        <ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="#000" fill="#fff"/>
                        <ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#000000" stroke="#000"/>
                      </g>
                    </g>
                  </svg>
                  <Badge count={yourLoogies && yourLoogies.length}>
                    <p style={{ float: "left", marginBottom: 0, fontSize: 24, fontWeight: "bold", marginLeft: 5 }}>Loogies</p>
                  </Badge>
                </div>
              }
              key="loogies"
            >
              <div style={{ maxWidth: 515, margin: "0 auto", paddingBottom: 32 }}>
                <Button
                  type={"primary"}
                  onClick={() => {
                    tx(writeContracts.Loogies.mintItem(), function (transaction) {
                      if (transaction.status == "confirmed") {
                        setUpdateBalances(updateBalances + 1);
                      }
                    });
                  }}
                >
                  MINT
                </Button>
              </div>
              {/* */}
              <div style={{ width: 515, margin: "0 auto", paddingBottom: 256 }}>
                <List
                  bordered
                  dataSource={yourLoogies}
                  renderItem={item => {
                    const id = item.id.toNumber();

                    return (
                      <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                        <Card
                          title={
                            <div>
                              <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                              {yourLoogiesApproved[id] != readContracts.FancyLoogie.address ? (
                                <Button
                                  onClick={async () => {
                                    tx(writeContracts.Loogies.approve(readContracts.FancyLoogie.address, id)).then(
                                      res => {
                                        setYourLoogiesApproved(yourLoogiesApproved => ({
                                          ...yourLoogiesApproved,
                                          [id]: readContracts.FancyLoogie.address,
                                        }));
                                      },
                                    );
                                  }}
                                >
                                  Approve upgrade to FancyLoogie
                                </Button>
                              ) : (
                                <Button
                                  onClick={async () => {
                                    tx(writeContracts.FancyLoogie.mintItem(id), function (transaction) {
                                      if (transaction.status == "confirmed") {
                                        setUpdateBalances(updateBalances + 1);
                                      }
                                    });
                                  }}
                                >
                                  Upgrade to FancyLoogie
                                </Button>
                              )}
                            </div>
                          }
                        >
                          <img src={item.image} />
                          <div style={{ height: 90 }}>{item.description}</div>
                          <div style={{ height: 90 }}>
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
                                tx(writeContracts.Loogies.transferFrom(address, transferToAddresses[id], id), function (transaction) {
                                  if (transaction.status == "confirmed") {
                                    setUpdateBalances(updateBalances + 1);
                                  }
                                });
                              }}
                            >
                              Transfer
                            </Button>
                          </div>
                        </Card>
                      </List.Item>
                    );
                  }}
                />
              </div>
            </TabPane>
            {nfts.map(function (nft) {
              return (
                <TabPane
                  tab={
                    <div class="tab-item">
                      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" style={{ float: "left" }}>
                        {nftsSvg[nft]}
                      </svg>
                      <Badge count={yourNfts[nft] && yourNfts[nft].length}>
                        <p style={{ float: "left", marginBottom: 0, fontSize: 24, fontWeight: "bold", marginLeft: 5 }}>{nft}</p>
                      </Badge>
                    </div>
                  }
                  key={nft}
                >
                  <div style={{ maxWidth: 515, margin: "0 auto", paddingBottom: 32 }}>
                    <Button
                      type={"primary"}
                      onClick={() => {
                        tx(writeContracts[nft].mintItem(), function (transaction) {
                          if (transaction.status == "confirmed") {
                            setUpdateBalances(updateBalances + 1);
                          }
                        });
                      }}
                    >
                      Mint {nft}
                    </Button>
                  </div>
                  <div style={{ width: 515, margin: "0 auto", paddingBottom: 256 }}>
                    <List
                      bordered
                      dataSource={yourNfts[nft]}
                      renderItem={item => {
                        const id = item.id.toNumber();
                        return (
                          <List.Item key={id + "_" + item.uri + "_" + item.owner}>
                            <Card
                              title={
                                <div>
                                  <div style={{ height: 45 }}>
                                    <span style={{ fontSize: 18, marginRight: 8 }}>{item.name}</span>
                                    { fancyLoogiesNfts &&
                                      fancyLoogiesNfts[selectedFancyLoogie] &&
                                      fancyLoogiesNfts[selectedFancyLoogie][readContracts[nft].address] == 0 && (
                                      <Button
                                        style={{ marginRight: 10 }}
                                        disabled={ selectedNfts[nft] == id }
                                        onClick={() => {
                                          setSelectedNfts(prevState => ({
                                            ...prevState,
                                            [nft]: id,
                                          }));
                                        }}
                                      >
                                        { selectedNfts[nft] == id ? "Previewing" : "Preview" }
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              }
                            >
                              <div class="nft-image">
                                <img src={item.image} />
                              </div>
                              <div style={{ height: 90 }}>{item.description}</div>
                              <div style={{ height: 90 }}>
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
                                  type="primary"
                                  style={{ marginTop: 10 }}
                                  onClick={() => {
                                    tx(writeContracts[nft].transferFrom(address, transferToAddresses[id], id), function (transaction) {
                                      if (transaction.status == "confirmed") {
                                        setUpdateBalances(updateBalances + 1);
                                      }
                                    });
                                  }}
                                >
                                  Transfer
                                </Button>
                              </div>
                            </Card>
                          </List.Item>
                        );
                      }}
                    />
                  </div>
                </TabPane>
              );
            })}
            <TabPane tab="Debug" key="debug" className="tab-debug">
              <Tabs defaultActiveKey="debug-fancyloogies" tabPosition="top">
                <TabPane tab="FancyLoogies" key="debug-fancyloogies">
                  <Contract
                    name="FancyLoogie"
                    signer={userSigner}
                    provider={localProvider}
                    address={address}
                    blockExplorer={blockExplorer}
                    contractConfig={contractConfig}
                  />
                </TabPane>
                <TabPane tab="Loogies" key="debug-loogies">
                  <Contract
                    name="Loogies"
                    customContract={writeContracts && writeContracts.Loogies}
                    signer={userSigner}
                    provider={localProvider}
                    address={address}
                    blockExplorer={blockExplorer}
                    contractConfig={contractConfig}
                  />
                </TabPane>
                {nfts.map(function (nft) {
                  return (
                    <TabPane tab={nft} key={"debug-" + nft}>
                      <Contract
                        name={nft}
                        signer={userSigner}
                        provider={localProvider}
                        address={address}
                        blockExplorer={blockExplorer}
                        contractConfig={contractConfig}
                      />
                    </TabPane>
                  );
                })}
              </Tabs>
            </TabPane>
          </Tabs>
        </Col>
        <Col flex="100px">
          {selectedFancyLoogiePreview ? (
            <div class="fancy-loogie-preview">
              <Card
                style={{ width: 515 }}
                title={
                  <div style={{ height: 45 }}>
                    <span style={{ fontSize: 18, marginRight: 8 }}>Selected FancyLoogie #{selectedFancyLoogie}</span>
                  </div>
                }
              >
                <div dangerouslySetInnerHTML={{ __html: selectedFancyLoogiePreview }}></div>
                <Tabs defaultActiveKey="preview-Bow">
                  {nfts.map(function (nft) {
                    return (
                      <TabPane tab={
                        <div>
                          <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" style={{ float: "left" }}>
                            { nftsSvg[nft] }
                          </svg>
                        </div>
                        }
                        key={"preview-" + nft}
                      >
                        { fancyLoogiesNfts &&
                          fancyLoogiesNfts[selectedFancyLoogie] &&
                          fancyLoogiesNfts[selectedFancyLoogie][readContracts[nft].address] > 0 ? (
                            <div>
                              Wearing {nft} #{fancyLoogiesNfts[selectedFancyLoogie][readContracts[nft].address]}
                              <Button
                                className="action-inline-button"
                                onClick={() => {
                                  tx(writeContracts.FancyLoogie.removeNftFromLoogie(readContracts[nft].address, selectedFancyLoogie), function (transaction) {
                                    if (transaction.status == "confirmed") {
                                      setUpdateBalances(updateBalances + 1);
                                    }
                                  });
                                }}
                              >
                                Remove {nft}
                              </Button>
                            </div>
                          ) : (
                            <div>
                              {selectedNfts[nft] ? (
                                <div>
                                  <span>Previewing #{selectedNfts[nft]}</span>
                                  { fancyLoogiesNfts &&
                                    fancyLoogiesNfts[selectedFancyLoogie] &&
                                    fancyLoogiesNfts[selectedFancyLoogie][readContracts[nft].address] == 0 && (
                                    <Button
                                      type="primary"
                                      className="action-inline-button"
                                      onClick={() => {
                                        const tankIdInBytes =
                                          "0x" + parseInt(selectedFancyLoogie).toString(16).padStart(64, "0");

                                        tx(
                                          writeContracts[nft]["safeTransferFrom(address,address,uint256,bytes)"](
                                            address,
                                            readContracts.FancyLoogie.address,
                                            selectedNfts[nft],
                                            tankIdInBytes,
                                          ),
                                          function (transaction) {
                                            if (transaction.status == "confirmed") {
                                              setUpdateBalances(updateBalances + 1);
                                            }
                                          },
                                        );
                                      }}
                                    >
                                      Transfer
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <span>Select a {nft} to preview</span>
                              )}
                            </div>
                          )
                        }
                      </TabPane>
                    )
                  })}
                </Tabs>
              </Card>
            </div>
          ) : (
            <div class="fancy-loogie-preview">
              <Card
                style={{ width: 515 }}
                title={
                  <div style={{ height: 45 }}>
                    <span style={{ fontSize: 18, marginRight: 8 }}>No FancyLoogie selected</span>
                  </div>
                }
              >
                <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                  <g id="eye1">
                    <ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_1" cy="154.5" cx="181.5" stroke="#000" fill="#fff"/>
                    <ellipse ry="3.5" rx="2.5" id="svg_3" cy="154.5" cx="173.5" stroke-width="3" stroke="#000" fill="#000000"/>
                  </g>
                  <g id="head">
                    <ellipse fill="white" stroke-width="3" cx="204.5" cy="211.80065" id="svg_5" rx="62" ry="51.80065" stroke="#000"/>
                  </g>
                  <g id="eye2">
                    <ellipse stroke-width="3" ry="29.5" rx="29.5" id="svg_2" cy="168.5" cx="209.5" stroke="#000" fill="#fff"/>
                    <ellipse ry="3.5" rx="3" id="svg_4" cy="169.5" cx="208" stroke-width="3" fill="#000000" stroke="#000"/>
                  </g>
                </svg>
                <div style={{ height: 90 }}>
                  Select a FancyLoogie from the <strong>FancyLoogies</strong> Tab to wear.
                </div>
              </Card>
            </div>
          )}
        </Col>
      </Row>

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
        {faucetHint}
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
      <Footer mainnetProvider={mainnetProvider} />
    </div>
  );
}

export default App;
