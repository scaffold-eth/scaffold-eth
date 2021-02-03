/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState, useEffect } from "react";
import {
  Space,
  Form,
  Button,
  List,
  Divider,
  Input,
  Card,
  DatePicker,
  Slider,
  Switch,
  Progress,
  Spin,
  Select,
} from "antd";
import { SyncOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { parseEther, formatEther } from "@ethersproject/units";
import { Address, Balance, AddressInput, EtherInput, BeneficiariesInput, TokenList } from "../components";
import { useContractReader, useEventListener, useBalance, useTokenList } from "../hooks";
import tryToDisplay from "../components/Contract/utils";

const { Option } = Select;

export default function Create({
  address,
  mainnetProvider,
  userProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  setCreate,
}) {
  const [beneficiaries, setBeneficiaries] = useState(null);
  const [beneficiariesShare, setBeneficiariesShare] = useState([1]);
  const [depositEth, setDepositEth] = useState(0);
  const [depositValue, setDepositValue] = useState(0);
  const [deadline, setDeadline] = useState(null);
  // const [editable, setEditable] = useState(true);
  const [tokenAddress, setTokenAddress] = useState(null);

  const ts = Math.floor(new Date().getTime() / 1000);

  const ourTokensList = [
    readContracts.MoCoin.address,
    readContracts.LarryCoin.address,
    readContracts.CurlyCoin.address,
  ];

  return (
    <div>
      <h2>Create/Update TimeLock:</h2>
      <Divider />
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 600, margin: "auto", marginTop: 64 }}>
        <Card style={{ marginTop: 32 }}>
          <div>
            Stoodges Tokens
            <br />
            {ourTokensList ? (
              <Select
                style={{ width: 200 }}
                onChange={value => {
                  setTokenAddress(value);
                }}
              >
                <Option value={ourTokensList[0]}>MoCoin</Option>
                <Option value={ourTokensList[1]}>LarryCoin</Option>
                <Option value={ourTokensList[2]}>CurlyCoin</Option>
              </Select>
            ) : (
              "Loading.."
            )}
          </div>
          <Divider />
          ERC20 Token <br />
          <TokenList
            token={tokenAddress}
            onChange={e => {
              setTokenAddress(e);
            }}
          />
          <br />
          to deposit
          <Input
            disabled={!tokenAddress}
            onChange={e => {
              setDepositValue(e.target.value);
            }}
          />
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

        <Card style={{ marginTop: 32 }}>
          {/*
            <div>
              <Switch defaultChecked onChange={
                setEditable(!editable)
              } /> Editable?
            </div>
          */}

          <div style={{ marginTop: 8 }}>
            <h3> DethLOCK time </h3>
            <DatePicker
              onChange={e => {
                const dateSelected = new Date(e);
                setDeadline(Math.floor(dateSelected.getTime() / 1000));
                {
                  /* Js is in miliseconds, block.timestamp in sec */
                }
              }}
            />
            <Button
              onClick={() => {
                setDeadline(ts + 60);
              }}
            >
              {" "}
              +1min
            </Button>
          </div>
        </Card>

        {/*          <BeneficiariesInput
            ensProvider={mainnetProvider}
            value={beneficiaries}
            onChange={e => {setBeneficiaries(e)}}
          />
*/}

        <AddressInput
          // ensProvider={props.ensProvider}
          placeholder="beneficiary"
          value={beneficiaries}
          onChange={setBeneficiaries}
        />

        <Button
          type="primary"
          disabled={!beneficiaries || !deadline}
          onClick={async () => {
            const res = await tx({
              to: writeContracts.Noun.address,
              value: parseEther(depositEth),
              data: writeContracts.Noun.interface.encodeFunctionData("createWill(address, address, uint256)", [
                beneficiaries,
                tokenAddress,
                deadline,
              ]),
            });
          }}
        >
          Create
        </Button>
        <br />
        {ts || null}
        {/* value: parseEther(depositValue), */}
      </div>
      TimeLock Address:
      <Address
        value={readContracts ? readContracts.Noun.address : readContracts}
        ensProvider={mainnetProvider}
        fontSize={16}
      />{" "}
      <br />
      <Balance
        address={readContracts ? readContracts.Noun.address : readContracts}
        provider={localProvider}
        dollarMultiplier={price}
      />
    </div>
  );
}
