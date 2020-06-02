import React, { useState } from 'react'
import { ethers } from "ethers";
import Blockies from 'react-blockies';
import { Card, Row, Col, List, Input, Button, Divider } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useContractLoader, useContractReader, useEventListener, useBlockNumber, useBalance, useTokenBalance } from "./hooks"
import { Transactor } from "./helpers"
import { Address, TokenBalance, Timeline, Account } from "./components"
import Curve from './Curve.js'
const { Meta } = Card;

const contractName = "MVD"

export default function MVD(props) {

  const tx = Transactor(props.injectedProvider,props.gasPrice)

  const localBlockNumber = useBlockNumber(props.localProvider)
  const localBalance = useBalance(props.address,props.localProvider)

  const writeContracts = useContractLoader(props.injectedProvider);

  const contractAddress = props.readContracts?props.readContracts[contractName].address:""
  const contractBalance = useBalance(contractAddress,props.localProvider)

  const tokenBalance = useTokenBalance(props.readContracts, "Balloons", contractAddress, props.localProvider)
  const tokenBalanceFloat = parseFloat(ethers.utils.formatEther(tokenBalance))
  const ethBalance = useBalance( contractAddress, props.localProvider )
  const ethBalanceFloat = parseFloat(ethers.utils.formatEther(ethBalance))

  //console.log("MVD tokenBalanceFloat",tokenBalance,"ethBalance",ethBalance,"props.readContracts",props.readContracts,"contractAddress",contractAddress,"props.localProvider",props.localProvider)

  let display = []

  const [ form, setForm ] = useState({})
  const [ values, setValues ] = useState({})

  if(props.readContracts && props.readContracts[contractName]){

    let inputDisplay = []

    let buttonIcon = "💸"

    const name = "ethToToken"

    //let inputs = []
    //inputs.push(contracts["MVD"].abi)

    let afterForm = (
      <Input
        placeholder={"amount of ETH"}
        onChange={(e)=>{
          console.log("CHJANGE")
          let newValues = {...values}
          newValues["valueOf"+name] = e.target.value
          console.log("SETTING:",newValues)
          setValues(newValues)
        }}
        value={values["valueOf"+name]}
      />
    )

    inputDisplay.push(
      <div style={{cursor:"pointer",margin:2}}>
      {afterForm}
        <Input

        onChange={(e)=>{
          console.log("CHJANGE")
          let newValues = {...values}
          newValues[name] = e.target.value
          console.log("SETTING:",newValues)
          setValues(newValues)
        }}

        defaultValue=""
        value={values[name]}

        addonAfter={
          <div type="default" onClick={async ()=>{
            console.log("CLICKITITIT")
            let args = []

          }}>{buttonIcon}</div>
        }
      />


      </div>
    )


    display.push(
      <div key={name}>
        <Row>
          <Col span={8} style={{textAlign:"right",opacity:0.333,paddingRight:6,fontSize:24}}>{name}</Col>
          <Col span={16}>
            {inputDisplay}
          </Col>
        </Row>
        <Divider></Divider>
      </div>
    )
  }




  return (
    <div>
      <div style={{position:"fixed",right:0,top:50,padding:10}}>
        <Curve addingEth={48} ethReserve={ethBalanceFloat} tokenReserve={tokenBalanceFloat} width={500} height={500} />
      </div>
      <Card
        title={(
          <div>
            MVD
            <div style={{float:'right'}}>
              <Account
                address={contractAddress}
                localProvider={props.localProvider}
                setInjectedProvider={props.setInjectedProvider}
                injectedProvider={props.injectedProvider}
                mainnetProvider={props.mainnetProvider}
                readContracts={props.readContracts}
                price={props.price}
              />
              <TokenBalance name={"Balloons"} img={"🎈"} address={contractAddress} contracts={props.readContracts} />

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
