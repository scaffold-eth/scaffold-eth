import React, { useState, useEffect, useRef } from 'react'
import Blockies from 'react-blockies';
import { Typography } from 'antd';
const { Text } = Typography;

export default function Balance(props) {

  //usePoller(async ()=>{
  //},props.pollTime?props.pollTime:1999)

  if(!props.address){
    return (
      <span>
      </span>
    )
  }

  return (
    <span style={{verticalAlign:"middle",fontSize:24,padding:8}}>
      ${parseFloat("0.00").toFixed(2)}
    </span>
  );
}
