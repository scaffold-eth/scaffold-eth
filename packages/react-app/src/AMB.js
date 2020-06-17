import React, { useState } from 'react'
import { ethers } from "ethers";
import Blockies from 'react-blockies';
import { Card, Row, Col, List, Input, Button, Divider } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useContractLoader, useContractReader, useEventListener, useBlockNumber, useBalance, useTokenBalance, useCustomContractLoader } from "./hooks"
import { Transactor } from "./helpers"
import { Address, TokenBalance, Timeline } from "./components"
const { Meta } = Card;




export default function AMB(props) {

  const tx = Transactor(props.injectedProvider,props.gasPrice)
  const writeContracts = useContractLoader(props.injectedProvider);

  const AMBABI  = [{"inputs":[{"internalType":"address","name":"_receiver","type":"address"},{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"relayTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}]

  const AMB = useCustomContractLoader(props.injectedProvider,"","0xFEaB457D95D9990b7eb6c943c839258245541754",AMBABI)
  //console.log("AMB",AMB)

  let display = []

  const [ form, setForm ] = useState({})
  const [ values, setValues ] = useState({})


  return (
    <div>
      <Card
        title={(
          <div>
            AMB <Address value={AMB?AMB.address:""} />
          </div>
        )}
        size="large"
        style={{ width: 550, marginTop: 25 }}
        loading={false}>
        { display }
        <Button onClick={()=>{
          tx(props.moonContract.approve("0xFEaB457D95D9990b7eb6c943c839258245541754",ethers.utils.parseEther("100")))
        }}>APPROVE</Button>

        <Button onClick={()=>{
          tx(AMB.relayTokens(props.address,ethers.utils.parseEther("100")))
        }}>moon -> xmoon</Button>
      </Card>

    </div>
  );

}
