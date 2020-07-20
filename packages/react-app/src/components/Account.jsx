import React, { useCallback, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import BurnerProvider from "burner-provider";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button } from "antd";
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import { usePoller } from "../hooks";

const INFURA_ID = "2717afb6bf164045b5d5468031b93f87"; // MY INFURA_ID, SWAP IN YOURS!

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
  // console.log("Cleared cache provider!?!",clear)
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

export default function Account({
  account,
  address,
  injectedProvider,
  localProvider,
  mainnetProvider,
  pollTime,
  price,
  minimized,
  setAddress,
  setInjectedProvider,
}) {
  const pollInjectedProvider = useCallback(async () => {
    if (injectedProvider) {
      const accounts = await injectedProvider.listAccounts();
      if (accounts && accounts[0] && accounts[0] !== account) {
        // console.log("ADDRESS: ",accounts[0])
        if (typeof setAddress === "function") setAddress(accounts[0]);
      }
    }
  }, [account, injectedProvider, setAddress]);

  const createBurnerIfNoAddress = useCallback(() => {
    if (!injectedProvider && localProvider && typeof setInjectedProvider === "function") {
      if (localProvider.connection && localProvider.connection.url) {
        setInjectedProvider(new Web3Provider(new BurnerProvider(localProvider.connection.url)));
        console.log("________BY URL", localProvider.connection.url);
        // eslint-disable-next-line no-underscore-dangle
      } else if (localProvider._network && localProvider._network.name) {
        setInjectedProvider(
          // eslint-disable-next-line no-underscore-dangle
          new Web3Provider(new BurnerProvider("https://" + localProvider._network.name + ".infura.io/v3/" + INFURA_ID)),
        );
        console.log("________INFURA");
      } else {
        console.log("________MAINMIAN");
        setInjectedProvider(new Web3Provider(new BurnerProvider("https://mainnet.infura.io/v3/" + INFURA_ID)));
      }
    } else {
      pollInjectedProvider();
    }
  }, [injectedProvider, localProvider, setInjectedProvider]);
  useEffect(createBurnerIfNoAddress, [injectedProvider]);

  usePoller(() => {
    pollInjectedProvider();
  }, pollTime || 1999);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    // console.log("GOT CACHED PROVIDER FROM WEB3 MODAL",provider)
    if (typeof setInjectedProvider === "function") {
      setInjectedProvider(new Web3Provider(provider));
    }
    pollInjectedProvider();
  }, [setInjectedProvider, pollInjectedProvider]);

  const modalButtons = [];
  if (typeof setInjectedProvider === "function") {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={logoutOfWeb3Modal}
        >
          logout
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          type={minimized ? "default" : "primary"}
          onClick={loadWeb3Modal}
        >
          connect
        </Button>,
      );
    }
  }

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  let display = "";
  if (!minimized) {
    display = (
      <span>
        {address ? <Address value={address} ensProvider={mainnetProvider} /> : "Connecting..."}
        <Balance address={address} provider={localProvider} dollarMultiplier={price} />
        <Wallet address={address} provider={injectedProvider} ensProvider={mainnetProvider} price={price} />
      </span>
    );
  }

  return (
    <div>
      {display}
      {modalButtons}
    </div>
  );
}
