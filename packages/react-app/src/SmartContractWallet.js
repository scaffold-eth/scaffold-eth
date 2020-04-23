import React, { useState, useEffect, useRef } from 'react'
import { usePoller } from "eth-hooks";

export default function SmartContractWallet(props) {

  const [purpose, setPurpose] = useState();
  const loadPurpose = async ()=>{
      if(props.contracts && props.contracts.SmartContractWallet){
        let newPurpose = await props.contracts.SmartContractWallet.purpose()
        if(newPurpose!=purpose){
          console.log("purpose: ",newPurpose)
          setPurpose(newPurpose)
        }
      }
  }
  usePoller(loadPurpose,3333)

  return (
    <div style={{position:'fixed',textAlign:'left',left:0,bottom:0,padding:10}}>
      {purpose?purpose:"Connecting..."}
    </div>
  );
}
