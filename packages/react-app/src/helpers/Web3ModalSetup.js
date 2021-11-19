import Fortmatic from "fortmatic";
import WalletLink from "walletlink";
import { SafeAppWeb3Modal } from "@gnosis.pm/safe-apps-web3modal";
import Portis from "@portis/web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";
import { INFURA_ID, ALCHEMY_KEY } from "../constants";

// Coinbase walletLink init
const walletLink = new WalletLink({
  appName: "coinbase",
});

// WalletLink provider
const walletLinkProvider = walletLink.makeWeb3Provider(`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`, 1);

// Portis ID: 6255fb2b-58c8-433b-a2c9-62098c05ddc9
/*
  Web3 modal helps us "connect" external wallets:
*/
const web3ModalSetup = () =>
  new SafeAppWeb3Modal({
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

export default web3ModalSetup;
