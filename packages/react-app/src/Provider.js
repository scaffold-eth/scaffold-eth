import React, { useState, useEffect, useRef } from 'react'
import Blockies from 'react-blockies';
import { usePoller } from "eth-hooks";
import { Button, Badge } from 'antd';
//import { WalletOutlined } from '@ant-design/icons';

import Address from "./Address.js"

export default function Provider(props) {

  const [showMore, setShowMore] = useState(false)
  const [status, setStatus] = useState("processing")
  const [network, setNetwork] = useState()
  const [signer, setSigner] = useState()
  const [address, setAddress ] = useState()
  const [blockNumber, setBlockNumber] = useState("processing")

  usePoller(async ()=>{
    try{
      const newNetwork = await props.provider.getNetwork()
      setNetwork(newNetwork)
      if(newNetwork.chainId>0){
        setStatus("success")
      }else{
        setStatus("warning")
      }
    }catch(e){
      console.log(e)
      setStatus("processing")
    }
    try{
      const newBlockNumber = await props.provider.getBlockNumber()
      setBlockNumber(newBlockNumber)
      const newSigner = await props.provider.getSigner()
      setSigner(newSigner)
      const newAddress = await newSigner.getAddress()
      setAddress(newAddress)
    }catch(e){}

  },1377)

  let showExtra = ""
  if(showMore){
    showExtra = (
      <span>
        <span style={{padding:3}}>
          id:{network?network.chainId:""}
        </span>
        <span style={{padding:3}}>
          name:{network?network.name:""}
        </span>
      </span>
    )
  }

  let showWallet = ""
  if(typeof signer != "undefined"){
    showWallet = (
      <span>
        <span style={{padding:3}}>
          <Address minimized={true} value={address} />
        </span>
      </span>
    )
  }

  return (
    <div style={{padding:8}}>
      <Button shape="round" size="large" onClick={()=>{setShowMore(!showMore)}}>
        <Badge status={status} /> {props.name} {showWallet} #{blockNumber} {showExtra}
      </Button>
    </div>
  );
}
