import React, { useState, useEffect, useRef } from 'react'
import Blockies from 'react-blockies';
import { Typography } from 'antd';
const { Text } = Typography;

export default function Address(props) {
  if(!props.value){
    return (
      <span>

      </span>
    )
  }

  let text
  if(props.onChange){
    text = (
      <Text editable={{onChange:props.onChange}} copyable={{text:props.value}}>
        <a style={{color:"#222222"}} href={"https://etherscan.io/address/"+props.value}>{props.value.substr(0,6)}...{props.value.substr(-4)}</a>
      </Text>
    )
  }else{
    text = (
      <Text copyable={{text:props.value}}>
        <a style={{color:"#222222"}} href={"https://etherscan.io/address/"+props.value}>{props.value.substr(0,6)}...{props.value.substr(-4)}</a>
      </Text>
    )
  }

  return (
    <span>
      <span style={{verticalAlign:"middle"}}>
        <Blockies seed={props.value.toLowerCase()} size={8} scale={4}/>
      </span>
      <span style={{verticalAlign:"middle",paddingLeft:5,fontSize:28}}>
        {text}
      </span>
    </span>
  );
}
