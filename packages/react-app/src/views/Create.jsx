/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect } from "react";
import { Space, Form, Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, Select } from "antd";
import { SyncOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Address, Balance, AddressInput, EtherInput, BeneficiariesInput, TokenList, TokenInput } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { useContractReader, useEventListener, useBalance, useTokenList } from '../hooks';
import tryToDisplay from "../components/Contract/utils";
import { useQuery, gql } from '@apollo/client';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
const { Option } = Select;

export default function Create({address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts, setCreate, willIndex, subgraphUri }) {
  const [beneficiaries, setBeneficiaries] = useState(null);
  const [beneficiariesShare, setBeneficiariesShare] = useState([1]);
  const [deadline, setDeadline] = useState(null);
  // const [editable, setEditable] = useState(true);
  const [depositEth, setDepositEth] = useState(0);
  const [tokenAddress, setTokenAddress] = useState(null);
  const [depositValue, setDepositValue] = useState(0);

  var ts = Math.floor(new Date().getTime()/1000);

  const QUERY_WILL=gql`
  query Will($test:BigInt!){
      wills(where:{index:$test}) {
      index
      owner
      beneficiary
      deadline
      value
      token
      tokenBalance
    }
  }
  `

  const { loading, data } = useQuery(QUERY_WILL,{variables:{test:willIndex}, pollInterval: 2500});
  console.log(data);

  const ourTokensList = [{name:'MoCoin',address:readContracts.MoCoin.address},
                       {name:'LarryCoin',address:readContracts.LarryCoin.address},
                       {name:'CurlyCoin',address:readContracts.CurlyCoin.address}];

  return (
    <div>
        {data==null?
          <h3>Create</h3>
          :
          <div>
            <p>Will selected: {willIndex}</p>
            <h3>Update</h3>
          </div>
        }
        <h2>TimeLock</h2>
        <div style={{border:"1px solid #cccccc", padding:16, width:600, margin:"auto",marginTop:64}}>
          {data==null?
              <TokenInput
                price={price}
                ourTokensList={ourTokensList}
                onTokenSelected = {setTokenAddress}
                onTokenValue = {setDepositValue}
                onEthValue = {setDepositEth}
              />
          :
            <div>
              Token: {data.wills[0].token}<br/>
              Token Balance: {data.wills[0].tokenBalance}<br/>
              It is needed to define tokenAddress in initialize for having it already...<br/>
              <Input onChange={(e)=>{setDepositValue(e.target.value)}} />
              <Button disabled={!depositValue} onClick={async ()=>{
                await tx({
                  to:writeContracts.Noun.address,
                  data:writeContracts.Noun.interface.encodeFunctionData('depositTokensToWill(uint256,address,uint256)',[willIndex-1, tokenAddress,parseEther(depositValue)])
                })
              }}>Deposit tokens</Button><br/>
              <Input onChange={(e)=>{setDepositEth(e.target.value)}} />
              <Button disabled={!depositEth} onClick={async ()=>{
                await tx({
                  to:writeContracts.Noun.address,
                  value:parseEther(depositEth),
                  data:writeContracts.Noun.interface.encodeFunctionData('fundWillETH(uint256)',[willIndex-1])
                })
              }}>Deposit ETH</Button><br/>

            </div>
          }
          <Divider />
          {data==null?
            <Card style={{marginTop:32}}>
            <div style={{marginTop:8}}>
              <h3> DethLOCK time </h3>
                <DatePicker onChange={(e)=>{
                    let dateSelected = new Date(e);
                    setDeadline(Math.floor(dateSelected.getTime()/1000));
                  }}/>
                <Button onClick={()=>{setDeadline(ts+60)}}> +1min</Button>
            </div>

          </Card>
          :
          <div>
            Deadline: {data.wills[0].deadline} <br />
            <DatePicker onChange={(e)=>{
                let dateSelected = new Date(e);
                setDeadline(Math.floor(dateSelected.getTime()/1000));
              }}/>
            <Button onClick={()=>{setDeadline(ts+60)}}> +1min</Button>
            <Button disabled={!setDeadline} onClick={async ()=>{
              await tx({
                to:writeContracts.Noun.address,
                data:writeContracts.Noun.interface.encodeFunctionData('setDeadline(uint256,uint256)',[willIndex-1, deadline])
              })
            }}>Set new deadline</Button><br/>
          </div>
        }
        <Divider />
        {data == null?
        <AddressInput
          // ensProvider={props.ensProvider}
          placeholder="beneficiary"
          value={beneficiaries}
          onChange={setBeneficiaries}
        />
        :
        <div>
          Benefactor: {data.wills[0].beneficiary}<br/>
          <AddressInput
            // ensProvider={props.ensProvider}
            placeholder="beneficiary"
            value={beneficiaries}
            onChange={setBeneficiaries}
          />
          <Button disabled={!beneficiaries} onClick={async ()=>{
            await tx({
              to:writeContracts.Noun.address,
              data:writeContracts.Noun.interface.encodeFunctionData('setBeneficiary(uint256,address)',[willIndex-1, beneficiaries])
            })
          }}>Change beneficiary</Button><br/>

        </div>
        }

        <Divider />
        {data==null?
          <Button type="primary" disabled={!beneficiaries || !deadline} onClick={async ()=>{
              let res = await tx({
                to: writeContracts.Noun.address,
                value: parseEther(depositEth),
                data: writeContracts.Noun.interface.encodeFunctionData(
                  "createWill(address, address, uint256)",
                  [beneficiaries, tokenAddress, deadline]
                )});

              }}>
                Create
              </Button>
            :null}
            <br />
            {ts?ts:null}

      </div>

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

    </div>
  );
}
