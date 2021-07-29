import { SyncOutlined, WindowsFilled } from "@ant-design/icons";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch, Row, Col, Tooltip} from "antd";
import React, { useState } from "react";
import { Address, AddressInput, Balance, EtherInput } from "../components";

const { ethers } = require("ethers");

export default function DefiSmileDashboard({ address, unicefAddress, mumaAddress, usaidAddress, totalDistributed, mainnetProvider, price, writeContracts, readContracts, tx, unicefAvailable, mumaAvailable, usaidAvailable }) {

  const [ amount, setAmount ] = useState(0);
  const [ toAddress, setToAddress ] = useState();
  const [ errorMessage, setErrorMessage ] = useState('');

  return (
    <div>
      <h1 style={{margin:"32px"}}>Send Transaction</h1>
      <Row justify="center">
        <Col span={6}>
          <Card >
            <Row justify="center">
              <Col span={16}>
                <EtherInput
                  autofocus
                  price={price}
                  value={amount}
                  placeholder="Enter amount"
                  onChange={value => {
                    setAmount(value);
                  }}
                />
            </Col>
          </Row>
          <h1 >{" "}</h1>
          <Row justify="center" >
            <Col span={20}>
              <AddressInput
                autoFocus
                ensProvider={mainnetProvider}
                placeholder="Recipient address"
                value={toAddress}
                onChange={setToAddress}
              />
            </Col>
            <Button
            onClick={ async ()=>{
              setAmount(amount)
              setToAddress(toAddress)
              console.log(toAddress)
              console.log(amount)
              const result = await tx( writeContracts.DefiSmile.sendFundz(toAddress, {value:ethers.utils.parseEther(amount)}) )
            }}
            style={{margin:'8px'}}
            type="primary"
            size="large"
            >
              Send
            </Button>
          </Row>
          </Card>
        </Col>
      </Row>
      <Divider ></Divider>
      <Row justify="center">
        <Col span={6}>
          <h2 style={{margin:"6px"}}>Donations 💸<h6>(net : {parseInt(totalDistributed)*10**-18} ETH )</h6></h2>
          <Card >
          <Row justify="center">
            <Tooltip title="0x7Fd8898fBf22Ba18A50c0Cb2F8394a15A182a07d">
            <p style={{fontSize:"20px", color:"#ffa000"}}>UNICEF: {unicefAvailable*(10**-18)+" Ξ"}</p>
            </Tooltip>
          </Row>
          <Row justify="center">
            <Tooltip title="0xF08E19B6f75686f48189601Ac138032EBBd997f2">
            <p style={{fontSize:"20px", color:"#e65100"}}>MUMA: {mumaAvailable*(10**-18)+" Ξ"}</p>
            </Tooltip>
          </Row>
          <Row justify="center">
            <Tooltip title="0x93eb95075A8c49ef1BF3edb56D0E0fac7E3c72ac">
            <p style={{fontSize:"20px", color:"#bf360c"}}>USAID: {usaidAvailable*(10**-18)+" Ξ"}</p>
            </Tooltip>
          </Row>
          </Card>
          <Button
          onClick={ async ()=>{
            // Bit of error handling based on the addresses in the contract
            if (address== unicefAddress || address== mumaAddress || address== usaidAddress) {
              const result = await tx( writeContracts.DefiSmile.getPayout() );
              console.log(parseInt(result))
            }
            else{
              console.log("You are not a beneficiary!")
              setErrorMessage("******* Not a Beneficiary *******")
            } 
          }}
          style={{ margin:'6px'}}
          >
          <h4 >I am a beneficiary, Get Payout</h4>
          </Button>
          <Row justify="center"><h3 >{errorMessage}</h3></Row>
        </Col>
      </Row>

    </div>
  );
}
