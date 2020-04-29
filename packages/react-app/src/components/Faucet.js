import React, { useState, useEffect, useRef } from 'react'
import { Input, Button, Tooltip } from 'antd';
import Blockies from 'react-blockies';
import { SendOutlined } from  '@ant-design/icons';
import { ethers } from "ethers";
import { Transactor } from "."


export default function Faucet(props) {

  const [address, setAddress] = useState()

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  let blockie
  if(address && typeof address.toLowerCase=="function"){
    blockie = (
        <Blockies seed={address.toLowerCase()} size={8} scale={3}/>
    )
  }else{
    blockie = (
      <div></div>
    )
  }

  const localTx = Transactor(props.localProvider)

  return (
    <span>
        <Input
          size="large"
          placeholder="local faucet"
          prefix={blockie}
          value={address}
          onChange={(e)=>{
            setAddress(e.target.value)
          }}
          suffix={
            <Tooltip title="Faucet: Send local ether to and address.">
              <Button onClick={()=>{
                localTx({
                  to: address,
                  value: ethers.utils.parseEther('0.01'),
                })
                setAddress("")
              }} shape="circle" icon={<SendOutlined />} />
            </Tooltip>
          }
        />
    </span>
  );
}
