import React, { useState } from "react";
import { Space, Form, Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, Select } from "antd";
import { Address, Balance, AddressInput, EtherInput, BeneficiariesInput, TokenList } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";

const { Option } = Select;

export default function TokenInput(props, onTokenSelected) {
  const [tokenList, setTokenList] = useState(null);
  const [tokenAddress, setTokenAddress] = useState(null);
  const [depositValue, setDepositValue] = useState(0);
  const [depositEth, setDepositEth] = useState(0);
  const [state, setState]= useState('ERC20');

  const tabList = [
    {
      key: 'ERC20',
      tab: 'ERC20',
    },
  {
    key: 'Stoodges',
    tab: 'Stoodges',
  },
  {
    key: 'ERC721',
    tab: 'ERC721',
  },
  ];


  const contentList = {
    ERC20:
    <div>
    ERC20 Token <br />
    <TokenList
    token={tokenAddress}
    onChange={e => {
      setTokenAddress(e)
      props.onTokenSelected(e)
    }}
    />
    <br />

    </div>
    ,
    Stoodges:
    <div>
    Stoodges Tokens<br />
    <Select
    style={{ width: 200 }}
    onChange={(value)=>{
      // console.log(value.name);
      setTokenAddress(value);
      props.onTokenSelected(value);
    }}
    >
    {props.ourTokensList.map(d => (
      <Option key={d.name} value={d.address}>
      {d.name}
      </Option>
    ))}
    </Select>
    <br />
    </div>
    ,ERC721:
    <div>
      ERC721 <br/>
      <AddressInput
        placeholder="NFT Address"
        value={tokenAddress}
        onChange={setTokenAddress}
      /> - Approval
    </div>,
  };

    return (
      <div>
      <Card style={{marginTop:32, width: '100%'}}
      // title="Make it go up to txs!"
      tabList={tabList}
      style={{alignItems:'center'}}
      activeTabKey={state.key}
      onTabChange={key => {
        setState({['key']:key});
      }}>
      {contentList[state.key]}
      to deposit<br />

      {tokenAddress?
        <Input style={{width:'40%'}} disabled={!tokenAddress} onChange={(e)=>{
            setDepositValue(e.target.value);
            props.onTokenValue(e.target.value);
        }}/>
        :'...'}
        <Divider />
        ETH
        <EtherInput
          price={props.price}
          value={depositEth}
          onChange={value => {
            setDepositEth(value);
            props.onEthValue(value);
          }}
        />
        </Card>
      </div>
)}
