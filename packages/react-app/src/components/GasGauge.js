import React from 'react'
import { Button } from 'antd';

export default function GasGauge(props) {
  return (
    <Button onClick={()=>{window.open("https://ethgasstation.info/")}} size="large" shape="round">
      <span style={{marginRight:8}}>⛽️</span>
      {parseInt(props.gasPrice)/10**8}g
    </Button>
  );
}
