import React, { useState, useEffect, useRef } from 'react'
import Blockies from 'react-blockies';
import { ethers } from "ethers";
import { usePoller } from "eth-hooks";
import BurnerProvider from 'burner-provider';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button, Typography } from 'antd';
const { Text } = Typography;

const web3Modal = new Web3Modal({
  //network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "2717afb6bf164045b5d5468031b93f87" // MY INFURA_ID, SWAP IN YOURS!
      }
    }
  }
});


export default function Account(props) {

  const createBurnerIfNoAccount = () => {
    if (!props.injectedProvider){
      if(props.localProvider.connection && props.localProvider.connection.url){
        props.setInjectedProvider(new ethers.providers.Web3Provider(new BurnerProvider(props.localProvider.connection.url)))
      }else{
        props.setInjectedProvider(new ethers.providers.Web3Provider(new BurnerProvider(props.mainnetProvider.providers[0].connection.url)))
      }
    }else{
      pollInjectedProvider()
    }
  }
  useEffect(createBurnerIfNoAccount, [props.injectedProvider]);

  const pollInjectedProvider = async ()=>{
    if(props.injectedProvider){
      let accounts = await props.injectedProvider.listAccounts()
      if(accounts && accounts[0] && accounts[0] != props.account){
        console.log("ACCOUNT: ",accounts[0])
        props.setAccount(accounts[0])
      }
    }
  }
  usePoller(pollInjectedProvider,props.pollTime?props.pollTime:1999)

  const loadWeb3Modal = async ()=>{
    const provider = await web3Modal.connect();
    console.log("GOT CACHED PROVIDER FROM WEB3 MODAL",provider)
    props.setInjectedProvider(new ethers.providers.Web3Provider(provider))
    pollInjectedProvider()
  }

  const logoutOfWeb3Modal = async ()=>{
    const clear = await web3Modal.clearCachedProvider();
    console.log("Cleared cache provider!?!",clear)
    setTimeout(()=>{
      window.location.reload()
    },1)
  }

  let modalButtons = []
  if (web3Modal.cachedProvider) {
    modalButtons.push(
      <Button style={{marginLeft:8,marginTop:4}} shape={"round"} size={"large"}  onClick={logoutOfWeb3Modal}>logout</Button>
    )
  }else{
    modalButtons.push(
      <Button style={{marginLeft:8,marginTop:4}} shape={"round"} size={"large"} type={"primary"} onClick={loadWeb3Modal}>connect</Button>
    )
  }

  React.useEffect(async () => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal()
    }
  }, []);

  return (
    <div style={{verticalAlign:"middle",position:'fixed',textAlign:'right',right:0,top:0,padding:10}}>
      {props.account?(
        <span>
          <span >
            <Blockies seed={props.account.toLowerCase()} size={8} scale={4}/>
          </span>
          <span style={{paddingLeft:5,fontSize:28}}>
            <Text copyable={{text:props.account}}>
              <a style={{color:"#222222"}} href={"https://etherscan.io/address/"+props.account}>{props.account.substr(0,6)}...{props.account.substr(-4)}</a>
            </Text>
          </span>
        </span>
      ):"Connecting..."}
      {modalButtons}
    </div>
  );
}
