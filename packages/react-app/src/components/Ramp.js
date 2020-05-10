import React, { useState } from 'react'
import { Input, Button, Tooltip } from 'antd';
import { DollarCircleOutlined } from  '@ant-design/icons';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';



export default function Ramp(props) {


  return (
    <Button size="large" shape="round" onClick={()=>{

      new RampInstantSDK({
        hostAppName: 'scaffold-eth',
        hostLogoUrl: 'https://scaffoldeth.io/scaffold-eth.png',
        swapAmount: '100000000000000000', // 0.1 ETH in wei  ?
        swapAsset: 'ETH',
        userAddress: props.address,
      }).on('*', event => console.log(event)).show();
      
    }}>
        <DollarCircleOutlined style={{color:"#52c41a"}}/> {props.price.toFixed(2)}
    </Button>
  );
}
