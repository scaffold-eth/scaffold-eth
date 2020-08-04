import React, { useEffect, useState } from 'react'
import { ethers } from "ethers";
import BurnerProvider from 'burner-provider';
import Web3Modal from "web3modal";
import { TokenBalance, Balance, Address, Wallet } from "."
import { usePoller } from "../hooks"
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button, Modal } from 'antd';


const INFURA_ID = "9ea7e149b122423991f56257b882261c"  // MY INFURA_ID, SWAP IN YOURS!

const web3Modal = new Web3Modal({
  //network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID
      }
    }
  }
});

export default function Account(props) {

  function warning(network, chainId) {
      Modal.warning({
        title: 'MetaMask Network Mismatch',
        content: <>Please connect to <b>https://dai.poa.network</b></>,
      });
    }

  const createBurnerIfNoAddress = () => {
    if (!props.injectedProvider && props.localProvider && typeof props.setInjectedProvider == "function"){
      let burnerProvider
      if(props.localProvider.connection && props.localProvider.connection.url){
        burnerProvider = new BurnerProvider(props.localProvider.connection.url)
        console.log("________BY URL",props.localProvider.connection.url)
      }else if( props.localProvider._network && props.localProvider._network.name ){
        burnerProvider = new BurnerProvider("https://"+props.localProvider._network.name+".infura.io/v3/"+INFURA_ID)
        console.log("________INFURA")
      }else{
        console.log("________MAINMIAN")
        burnerProvider = new BurnerProvider("https://mainnet.infura.io/v3/"+INFURA_ID)
      }
      updateProviders(burnerProvider)
    }else{
      pollInjectedProvider()
    }
  }
    useEffect(() => {
      createBurnerIfNoAddress()
    }, [props.injectedProvider]);

  const updateProviders =  async (provider) => {

    let newWeb3Provider = await new ethers.providers.Web3Provider(provider)
    props.setInjectedProvider(newWeb3Provider)
    let newNetwork = await newWeb3Provider.getNetwork()
    let localNetwork = await props.localProvider.getNetwork()
    console.log('networkcomparison',provider,props.localProvider)
    if(newNetwork.chainId !== localNetwork.chainId) {
      warning(localNetwork.name, localNetwork.chainId)
    }

  }

  const pollInjectedProvider = async ()=>{
    if(props.injectedProvider){
      let accounts = await props.injectedProvider.listAccounts()
      if(accounts && accounts[0] && accounts[0] !== props.account){
        //console.log("ADDRESS: ",accounts[0])
        if(typeof props.setAddress == "function") props.setAddress(accounts[0])
      }
    }
  }
  usePoller(()=>{
    pollInjectedProvider()
  },props.pollTime?props.pollTime:1999)

  const loadWeb3Modal = async ()=>{
    const provider = await web3Modal.connect();
    if(typeof props.setInjectedProvider == "function"){
      updateProviders(provider)
    }
    pollInjectedProvider()
  }

  const logoutOfWeb3Modal = async ()=>{
    await web3Modal.clearCachedProvider();
    window.localStorage.removeItem('walletconnect');
    //console.log("Cleared cache provider!?!",clear)
    setTimeout(()=>{
      window.location.reload()
    },1)
  }

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


  React.useEffect(() => {
    if (web3Modal.cachedProvider) {
      console.log(web3Modal.cachedProvider)
      loadWeb3Modal()
    }
  }, []);

  const tokenContract = props.localProvider

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
