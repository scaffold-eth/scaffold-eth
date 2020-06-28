import React, { useState, useEffect } from 'react'
//import Curve from './Curve.js'
import { Row, Col, Button } from 'antd';
import { Bridge } from "."

export default function Exchange(props) {




    return (
      <Row align="middle" gutter={4}>
        <Col span={12}>
        <Bridge {...props} />
        </Col>
        <Col span={12}>
          <div style={{width:"100%",margin:8,border:"1px solid #222222",paddingRight:24,backgroundColor:"#eeeeee",color:"#22222"}}>

         </div>
       </Col>
      </Row>
    )

}








  //////////////////////////////////////////////////////////////////////////  xMOON DEX   //////////////////////////////////////////////////////

/*

<Contract
  name={"DEX"}
  show={["init"]}
  provider={injectedProvider}
  address={address}
/>


  let xMoonDex, xMoonDexMax
  const [xMoonDexMode, setXMoonDexMode] = useState();
  const [xMoonDexAmount, setXMoonDexAmount] = useState();
  if (!xMoonDexMode) {
    xMoonDex = (
      <Row gutter={8}>
        <Col span={12} align="right">
          <Button shape="round" size="large" type="primary" onClick={() => { setXMoonDexMode("up") }} disabled={!injectedNetwork || injectedNetwork.chainId != 100}  >
            <UpOutlined /> xDAI to xMOON
          </Button>
        </Col>
        <Col span={12} align="left">
          <Button shape="round" size="large" type="primary" onClick={() => { setXMoonDexMode("down") }} disabled={!injectedNetwork || injectedNetwork.chainId != 100}  >
            <DownOutlined /> xMOON to xDAI
          </Button>
        </Col>
      </Row>
    )
  } else {
    xMoonDexMax = xmoonBalance ? ethers.utils.formatEther(xmoonBalance) : 0
    let button
    if (xMoonDexMode == "down") {
      button = (
        <Button shape="round" size="large" type="primary" onClick={async () => {

          let allowance = await xmoonContract.allowance(address, xMoonToxDaiDEXAddress)
          let amountInWei = ethers.utils.parseEther(xMoonDexAmount)
          if (amountInWei.gt(allowance)) {
            console.log("they are not approved, this is a two tx move...")
            xdaiTx(xmoonContractWriteable.approve(xMoonToxDaiDEXAddress, ethers.utils.parseEther("" + xMoonDexAmount)))
          } else {
            console.log("they are approved, single tx move...")
            xdaiTx(contractsWriteable["DEX"].tokenToEth(ethers.utils.parseEther("" + xMoonDexAmount)))
          }
        }}>
          <DownOutlined /> xMOON to xDAI
        </Button>
      )
    } else {
      xMoonDexMax = moonBalance ? ethers.utils.formatEther(moonBalance) : 0
      button = (
        <Button shape="round" size="large" type="primary" onClick={async () => {
          let amountInWei = ethers.utils.parseEther(xMoonDexAmount)
          xdaiTx(contractsWriteable["DEX"].ethToToken({value: amountInWei}))
          //let swapEthToTokenResult = await tx( writeContracts[contractName]["ethToToken"]({value: valueInEther}) )
        }}>
          <UpOutlined /> xDAI to xMOON
        </Button>
      )
    }



    xMoonDex = (
      <Row gutter={8}>
        <Col span={10} align="center">
          <AmountInput prefix="" max={xMoonDexMax} value={xMoonDexAmount} setValue={setXMoonDexAmount} />
        </Col>
        <Col span={8} align="center">
          {button}
        </Col>
        <Col span={6} align="center">
          <Button shape="round" size="large" onClick={() => { setXMoonDexMode() }}>
            cancel
        </Button>
        </Col>
      </Row>
    )
  }
*/
