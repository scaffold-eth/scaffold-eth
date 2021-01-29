/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect } from "react";
import { Space, Form, Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, Select } from "antd";
import { SyncOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Address, Balance, AddressInput, EtherInput, BeneficiariesInput, TokenList } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { useContractReader, useEventListener, useBalance, useTokenList } from '../hooks';
import tryToDisplay from "../components/Contract/utils";
const { Option } = Select;

export default function Create({address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts, setCreate }) {
  const [beneficiaries, setBeneficiaries] = useState(null);
  const [beneficiariesShare, setBeneficiariesShare] = useState([1]);

  const [depositEth, setDepositEth] = useState(0);
  const [depositValue, setDepositValue] = useState(0);
  const [deadline, setDeadline] = useState(null);
  // const [editable, setEditable] = useState(true);
  const [tokenAddress, setTokenAddress] = useState(null);

  var ts = Math.floor(new Date().getTime()/1000);





  let ourTokensList;
{ /* try {
    tokenList = [readContracts.MoCoin.address, readContracts.LarryCoin.address, readContracts.CurlyCoin.address];
  }
  catch(err) {
    tokenList =null;
    console.log(err);
  }
*/}

  return (
    <div>
        <h2>Create TimeLock:</h2>
        <Divider/>
        TimeLock Address:
        <Address
            value={readContracts?readContracts.Noun.address:readContracts}
            ensProvider={mainnetProvider}
            fontSize={16}
        /> <br />
        <Balance
          address={readContracts?readContracts.Noun.address:readContracts}
          provider={localProvider}
          dollarMultiplier={price}
        />
        <div style={{border:"1px solid #cccccc", padding:16, width:600, margin:"auto",marginTop:64}}>

          <Card style={{marginTop:32}}>
          ERC20 Token <br />
            <TokenList
              token={tokenAddress}
              onChange={e => {setTokenAddress(e)}}
            />
            <br />
          to deposit

          <Input disabled={!tokenAddress} onChange={(e)=>{
              setDepositValue(e.target.value);
          }}/>
          <Divider />
          ETH
          <EtherInput
            price={price}
            value={depositEth}
            onChange={value => {
              setDepositEth(value);
            }}
          />
          </Card>

          <Card style={{marginTop:32}}>
{/*
            <div>
              <Switch defaultChecked onChange={
                setEditable(!editable)
              } /> Editable?
            </div>
          */}

            <div style={{marginTop:8}}>
              <h3> DethLOCK time </h3>
                <DatePicker onChange={(e)=>{
                    let dateSelected = new Date(e);
                    setDeadline(Math.floor(dateSelected.getTime()/1000));
                    {/* Js is in miliseconds, block.timestamp in sec*/}
                  }}/>
            </div>

          </Card>

          <BeneficiariesInput
            ensProvider={mainnetProvider}
            value={beneficiaries}
            onChange={e => {setBeneficiaries(e)}}
          />

        <Button type="primary" disabled={!beneficiaries || !deadline} onClick={async ()=>{
          await tx({
              to: writeContracts.Noun.address,
              value: parseEther(depositEth),
              data: writeContracts.Noun.interface.encodeFunctionData(
                "createWill(address, uint)",
                [beneficiaries[0], deadline]
              )});

        }}>
              Create
            </Button>
            <br />
            {ts?ts:null}
            {/*value: parseEther(depositValue),*/}
    </div>

    </div>
  );
}
