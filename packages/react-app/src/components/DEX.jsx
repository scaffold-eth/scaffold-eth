import React, { useState } from 'react'
import { ethers } from "ethers";
import Blockies from 'react-blockies';
import { Card, Row, Col, List, Input, Button, Divider } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useContractLoader, useContractReader, useEventListener, useBlockNumber, useBalance } from "eth-hooks";
import { useTokenBalance } from "eth-hooks/erc/erc-20/useTokenBalance";
import { Transactor } from "../helpers"
import { Address, TokenBalance, Timeline } from "../components"
import Curve from './Curve'
const { Meta } = Card;

const contractName = "DEX"
const tokenName = "Balloons"

export default function DEX(props) {

  const tx = Transactor(props.injectedProvider,props.gasPrice)

  const localBlockNumber = useBlockNumber(props.injectedProvider)
  const localBalance = useBalance(props.injectedProvider, props.address)

  const writeContracts = useContractLoader(props.injectedProvider);

  const contractAddress = props.readContracts?props.readContracts[contractName].address:""
  const contractBalance = useBalance(props.injectedProvider, contractAddress)

  const tokenBalance = useTokenBalance(props.readContracts, contractAddress)
  const tokenBalanceFloat = parseFloat(ethers.utils.formatEther(tokenBalance))
  const ethBalance = useBalance(props.localProvider, contractAddress )
  const ethBalanceFloat = parseFloat(ethers.utils.formatEther(ethBalance))

  const liquidity = useContractReader(props.readContracts,contractName,"liquidity",[props.address])

  let display = []

  const [ form, setForm ] = useState({})
  const [ values, setValues ] = useState({})

  const rowForm = (title,icon,onClick)=>{
    return (
      <Row>
        <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>{title}</Col>
        <Col span={16}>
          <div style={{cursor:"pointer",margin:2}}>
            <Input
              onChange={(e)=>{
                let newValues = {...values}
                newValues[title] = e.target.value
                setValues(newValues)
              }}
              value={values[title]}
              addonAfter={
                <div type="default" onClick={()=>{
                  onClick(values[title])
                  let newValues = {...values}
                  newValues[title] = ""
                  setValues(newValues)
                }}>{icon}</div>
              }
            />
          </div>
        </Col>
      </Row>
    )
  }


  if(props.readContracts && props.readContracts[contractName]){

    display.push(
      <div>

        {rowForm("ethToToken","💸",async (value)=>{
          let valueInEther = ethers.utils.parseEther(""+value)
          let swapEthToTokenResult = await props.writeContracts[contractName]["ethToToken"]({from: props.address, value: valueInEther}) //await tx( writeContracts[contractName]["ethToToken"]({value: valueInEther}) )
          console.log("swapEthToTokenResult:",swapEthToTokenResult)
        })}

        {rowForm("tokenToEth","🔏",async (value)=>{
          let valueInEther = ethers.utils.parseEther(""+value)
          console.log("valueInEther",valueInEther)
          let allowance =  await props.readContracts[tokenName].allowance(props.address,props.readContracts[contractName].address)
          console.log("allowance",allowance)
          let nonce = await props.injectedProvider.getTransactionCount(props.address)
          console.log("nonce",nonce)
          let approveTx
          if(allowance.lt(valueInEther)){
            approveTx = props.writeContracts[tokenName].approve(props.readContracts[contractName].address,valueInEther,{from:props.address, gasLimit:200000 , nonce:nonce++})
            console.log("approve tx is in, not waiting on it though...",approveTx)
          }
          let swapTx = props.writeContracts[contractName]["tokenToEth"](valueInEther,{from:props.address, gasLimit:200000, nonce:nonce++})
          if(approveTx){
            console.log("waiting on approve to finish...")
            let approveTxResult = await approveTx;
            console.log("approveTxResult:",approveTxResult)
          }
          let swapTxResult = await swapTx;
          console.log("swapTxResult:",swapTxResult)
        })}

        <Divider> Liquidity ({liquidity?ethers.utils.formatEther(liquidity):"none"}):</Divider>

        {rowForm("deposit","📥",async (value)=>{
          let valueInEther = ethers.utils.parseEther(""+value)
          let valuePlusExtra = ethers.utils.parseEther(""+value*1.03)
          console.log("valuePlusExtra",valuePlusExtra)
          let allowance =  await props.readContracts[tokenName].allowance(props.address,props.readContracts[contractName].address)
          console.log("allowance",allowance)
          let nonce = await props.injectedProvider.getTransactionCount(props.address)
          console.log("nonce",nonce)
          let approveTx
          if(allowance.lt(valuePlusExtra)){
            approveTx = tx( writeContracts[tokenName].approve(props.readContracts[contractName].address,valuePlusExtra,{gasLimit:200000 , nonce:nonce++}) )
            console.log("approve tx is in, not waiting on it though...",approveTx)
          }
          let depositTx = props.writeContracts[contractName]["deposit"]({from: props.address, value: valueInEther, gasLimit:200000, nonce:nonce++}) 
          if(approveTx){
            console.log("waiting on approve to finish...")
            let approveTxResult = await approveTx;
            console.log("approveTxResult:",approveTxResult)
          }
          let depositTxResult = await depositTx;
          console.log("depositTxResult:",depositTxResult)
        })}

        {rowForm("withdraw","📤",async (value)=>{
          let valueInEther = ethers.utils.parseEther(""+value)
          let withdrawTxResult = props.writeContracts[contractName]["withdraw"](valueInEther, {from: props.address})
          console.log("withdrawTxResult:",withdrawTxResult)
        })}

      </div>
    )
  }

  let addingEth = 0

  return (
    <div>
      <div style={{padding:20}}>
        <Curve
          addingEth={values && values["ethToToken"]?values["ethToToken"]:0}
          addingToken={values && values["tokenToEth"]?values["tokenToEth"]:0}
          ethReserve={ethBalanceFloat}
          tokenReserve={tokenBalanceFloat}
          width={500} height={500}
        />
      </div>
      <Card
        title={(
          <div>
            <Address value={contractAddress} />
            <div style={{float:'right',fontSize:24}}>
              {parseFloat(ethers.utils.formatEther(contractBalance)).toFixed(4)} ⚖️
              <TokenBalance name={tokenName} img={"🎈"} address={contractAddress} contracts={props.readContracts} />

            </div>
          </div>
        )}
        size="large"
        style={{ width: 550, marginTop: 25 }}
        loading={false}>
        { display }
      </Card>

    </div>
  );

}
