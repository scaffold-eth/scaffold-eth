import React, { useState } from 'react'
import { Input, Button, Tooltip } from 'antd';
import Blockies from 'react-blockies';
import { SendOutlined } from  '@ant-design/icons';
import { ethers } from "ethers";
import { Transactor } from "../helpers"
import Wallet from "./Wallet.js"

export default function Faucet(props) {

  const [address, setAddress] = useState()

  let blockie
  if(address && typeof address.toLowerCase=="function"){
    blockie = (
        <Blockies seed={address.toLowerCase()} size={8} scale={4}/>
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
          placeholder={props.placeholder?props.placeholder:"local faucet"}
          prefix={blockie}
          value={address}
          onChange={(e)=>{
            setAddress(e.target.value)
          }}
          suffix={
            <Tooltip title="Faucet: Send local ether to an address.">
              <Button onClick={()=>{
                localTx({
                  to: address,
                  value: ethers.utils.parseEther('1'),
                })
                setAddress("")
              }} shape="circle" icon={<SendOutlined />} />
              <Wallet color={"#888888"} provider={props.localProvider} price={props.price}/>
            </Tooltip>
          }
        />
    </span>
  );
}
