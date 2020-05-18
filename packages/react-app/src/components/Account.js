import React, { useState, useEffect, useRef } from 'react'
import { ethers } from "ethers";
import { RelayProvider } from '@opengsn/gsn';
import BurnerProvider from 'burner-provider';
import Web3Modal from "web3modal";
import { Balance, Address } from "."
import { usePoller } from "../hooks"
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button, Typography, Checkbox } from 'antd';
const { Text } = Typography;

const relayHubAddress = require('../build/gsn/RelayHub.json').address
const stakeManagerAddress = require('../build/gsn/StakeManager.json').address
const paymasterAddress = require('../build/gsn/Paymaster.json').address

const INFURA_ID = "2717afb6bf164045b5d5468031b93f87"  // MY INFURA_ID, SWAP IN YOURS!

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

  const createBurnerIfNoAddress = () => {
    if (!props.injectedProvider && props.localProvider){
      let burnerProvider
      if(props.localProvider.connection && props.localProvider.connection.url){
        //props.setInjectedProvider(new ethers.providers.Web3Provider(new BurnerProvider(props.localProvider.connection.url)))
        burnerProvider = new BurnerProvider(props.localProvider.connection.url)

      }else if( props.localProvider._network && props.localProvider._network.name ){
        //props.setInjectedProvider(new ethers.providers.Web3Provider(new BurnerProvider("https://"+props.localProvider._network.name+".infura.io/v3/"+INFURA_ID)))
        burnerProvider = new BurnerProvider("https://"+props.localProvider._network.name+".infura.io/v3/"+INFURA_ID)

      }else{
        //props.setInjectedProvider(new ethers.providers.Web3Provider(new BurnerProvider("https://mainnet.infura.io/v3/"+INFURA_ID)))
        burnerProvider = new BurnerProvider("https://mainnet.infura.io/v3/"+INFURA_ID)
      }

      updateProviders(burnerProvider)

    }else{
      pollInjectedProvider()
    }
  }
  useEffect(createBurnerIfNoAddress, [props.injectedProvider, props.metaProvider]);

  const updateProviders =  async (provider) => {


    props.setInjectedProvider(new ethers.providers.Web3Provider(provider))

    let gsnConfig = {
      relayHubAddress,
      stakeManagerAddress,
      paymasterAddress,
    }

    if (provider._metamask) {
      console.log('using metamask')
      gsnConfig = {...gsnConfig, methodSuffix: '_v4', jsonStringifyRequest: true, chainId: provider.networkVersion}

    }

    const gsnProvider = new RelayProvider(provider, gsnConfig)
    props.setMetaProvider(new ethers.providers.Web3Provider(gsnProvider))
  }

  const pollInjectedProvider = async ()=>{
    if(props.injectedProvider){
      let accounts = await props.injectedProvider.listAccounts()
      if(accounts && accounts[0] && accounts[0] != props.account){
        //console.log("ADDRESS: ",accounts[0])
        if(typeof props.setAddress == "function") props.setAddress(accounts[0])
      }
    }
  }
  usePoller(()=>{pollInjectedProvider()},props.pollTime?props.pollTime:1999)

  const loadWeb3Modal = async ()=>{
    const provider = await web3Modal.connect();
    //console.log("GOT CACHED PROVIDER FROM WEB3 MODAL",provider)
    //props.setInjectedProvider(new ethers.providers.Web3Provider(provider))
    updateProviders(provider)
    pollInjectedProvider()
  }

  const logoutOfWeb3Modal = async ()=>{
    const clear = await web3Modal.clearCachedProvider();
    //console.log("Cleared cache provider!?!",clear)
    setTimeout(()=>{
      window.location.reload()
    },1)
  }

  let modalButtons = []
  if (web3Modal.cachedProvider) {
    modalButtons.push(
      <Button key="logoutbutton" style={{verticalAlign:"top",marginLeft:8,marginTop:4}} shape={"round"} size={"large"}  onClick={logoutOfWeb3Modal}>logout</Button>
    )
  }else{
    modalButtons.push(
      <Button key="loginbutton" style={{verticalAlign:"top",marginLeft:8,marginTop:4}} shape={"round"} size={"large"} type={"primary"} onClick={loadWeb3Modal}>connect</Button>
    )
  }

  React.useEffect(async () => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal()
    }
  }, []);

  return (
    <div>
      {props.address?(
        <Address value={props.address} ensProvider={props.mainnetProvider}/>
      ):"Connecting..."}
      <Balance address={props.address} provider={props.injectedProvider} dollarMultiplier={props.price}/>
      {modalButtons}
    </div>
  );
}
