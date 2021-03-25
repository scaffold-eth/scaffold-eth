import React, { useEffect, useCallback } from 'react'
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { Balance, Address, Wallet } from "."
import { useBurnerSigner } from "../hooks"
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button } from 'antd';
import { RelayProvider } from '@opengsn/gsn';
//import Fortmatic from "fortmatic";
//import Portis from "@portis/web3";
const Web3HttpProvider = require("web3-providers-http");

const INFURA_ID = "9ea7e149b122423991f56257b882261c"  // MY INFURA_ID, SWAP IN YOURS!
const XDAI_RPC = "https://rpc.xdaichain.com/"

const web3Modal = new Web3Modal({
  network: "xdai", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
        rpc: {
          100: XDAI_RPC,
          // ...
        },
      }
    },
    /*fortmatic: {
      package: Fortmatic, // required
      options: {
        key: "pk_live_4463D2C286A0B058", // required
      }
    },

    portis: {
      package: Portis, // required
      options: {
        id: "5b42dc23-b8b7-494e-a1e0-a32918e4aebe", // required
      }
    }*/
  }
});

export default function Account(props) {

  let httpProvider = new Web3HttpProvider(process.env.REACT_APP_NETWORK_NAME === 'xdai'?XDAI_RPC:"http://localhost:8546");
  const burner = useBurnerSigner(props.localProvider)

  let gsnConfig

  if(process.env.REACT_APP_USE_GSN === 'true') {
    /*
    let relayHubAddress
    let stakeManagerAddress
    let paymasterAddress
    let chainId
  if(process.env.REACT_APP_NETWORK_NAME === 'xdai'){
    relayHubAddress = "0xA58B6fC9264ce507d0B0B477ceE31674341CB27e"
    stakeManagerAddress = "0xd1Fa0c7E52440078cC04a9e99beA727f3e0b981B"
    paymasterAddress = "0x2ebc08948d0DD5D034FBE0b1084C65f57eF7D0bC"
    chainId = 100
  } else if (process.env.REACT_APP_NETWORK_NAME === 'sokol'){
    relayHubAddress = "0xA17C8F25668a5748E9B80ED8Ff842f8909258bF6"
    stakeManagerAddress = "0xbE9B5be78bdB068CaE705EdF1c18F061698B6F83"
    paymasterAddress = "0x205091FE2AFAEbCB8843EDa0A8ee28B170aa0619"
    chainId = 42
  }else {
    relayHubAddress = require('.././gsn/RelayHub.json').address
    stakeManagerAddress = require('.././gsn/StakeManager.json').address
    paymasterAddress = require('.././gsn/Paymaster.json').address
  }
  //gsnConfig = { relayHubAddress, stakeManagerAddress, paymasterAddress, chainId }
  */

  gsnConfig = {
    paymasterAddress: process.env.REACT_APP_NETWORK_NAME === 'xdai' ? "0x4734356359c48ba2Cb50BA048B1404A78678e5C2" : require('.././gsn/Paymaster.json').address,
    verbose: true,
    relayLookupWindowBlocks: 1e18,
    minGasPrice: 20000000000
  }

}

  const updateProviders =  async (provider) => {

    if(provider && ethers.Signer.isSigner(provider)) {
      let burnerAddress = await burner.getAddress()
      props.setAddress(burnerAddress)
      props.setInjectedProvider(provider)
    } else if (provider) {

      // Set provider
      let newWeb3Provider = await new ethers.providers.Web3Provider(provider)
      props.setInjectedProvider(newWeb3Provider)

      let accounts = await newWeb3Provider.listAccounts()

      if(accounts && accounts[0] && accounts[0] !== props.account){
        props.setAddress(accounts[0])
      }

      let injectedNetwork = await newWeb3Provider.getNetwork()
      let localNetwork = await props.localProvider.getNetwork()

      if(injectedNetwork.chainId === localNetwork.chainId && !provider.wc) {
         // If the injected provider is on the right network, create an injected GSN signer
         const gsnProvider = await RelayProvider.newProvider({provider, config: gsnConfig}).init();
         const gsnWeb3Provider = new ethers.providers.Web3Provider(gsnProvider);
         const gsnSigner = gsnWeb3Provider.getSigner(accounts[0])
         props.setInjectedGsnSigner(gsnSigner)
       } else {
          props.setInjectedGsnSigner()
       }
    }

    if(burner) {
      let burnerAddress = await burner.getAddress()

      // Adding a burner meta provider
      const burnerGsnProvider = await RelayProvider.newProvider({provider: httpProvider, config: gsnConfig}).init();
      burnerGsnProvider.addAccount(burner.privateKey);
      const burnerGsnWeb3Provider = new ethers.providers.Web3Provider(burnerGsnProvider);
      const burnerGsnSigner = burnerGsnWeb3Provider.getSigner(burnerAddress);

      props.setMetaProvider(burnerGsnSigner);

    if(provider && ethers.Signer.isSigner(provider)) {

      props.setInjectedGsnSigner(burnerGsnSigner)
    }
  }

  }


  const loadWeb3Modal = useCallback(async () => {

      const provider = await web3Modal.connect();

      if(typeof props.setInjectedProvider == "function"){
        updateProviders(provider)

        provider.on("chainChanged", (chainId) => {
            console.log(`chain changed to ${chainId}! updating providers`)
            updateProviders(provider)
        });

        provider.on("accountsChanged", (accounts: string[]) => {
            console.log(`account changed!`)
            updateProviders(provider)
        });

        // Subscribe to session disconnection
        provider.on("disconnect", (code, reason) => {
          console.log(code, reason);
          logoutOfWeb3Modal()
        });
      }

    }, [props.setInjectedProvider, burner]);

  const logoutOfWeb3Modal = async ()=>{
    await web3Modal.clearCachedProvider();
    window.localStorage.removeItem('walletconnect');
    setTimeout(()=>{
      window.location.reload()
    },1)
  }

  useEffect(() => {
  const checkForProvider =  async () => {
    if (web3Modal.cachedProvider) {
      console.log('using cached provider')
        loadWeb3Modal()
    } else {
      console.log("🔥📡 burner")
      updateProviders(burner)
    }
  }

  checkForProvider()


}, [burner]);


  let modalButtons = []
  if(typeof props.setInjectedProvider == "function"){
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button key="logoutbutton" style={{verticalAlign:"top",marginLeft:8,marginTop:4}} shape={"round"} size={"large"}  onClick={logoutOfWeb3Modal}>logout</Button>
      )
    }else{
      modalButtons.push(
        <Button key="loginbutton" style={{verticalAlign:"top",marginLeft:8,marginTop:4}} shape={"round"} size={"large"} type={props.minimized?"default":"primary"} onClick={loadWeb3Modal}>connect</Button>
      )
    }
  }

  let display=""
  display = (
    <span>
      {props.address?(
        <Address value={props.address} ensProvider={props.mainnetProvider}/>
      ):"Connecting..."}
      <Balance address={props.address} provider={props.localProvider} dollarMultiplier={props.price}/>
      <Wallet address={props.address} provider={props.injectedProvider} ensProvider={props.mainnetProvider} price={props.price} />
    </span>)

  return (
    <div>
      {display}
      {modalButtons}
    </div>
  );
}
