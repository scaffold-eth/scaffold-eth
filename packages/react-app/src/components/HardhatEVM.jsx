import { SendOutlined } from "@ant-design/icons";
import { Button, Input, Tooltip, Drawer, Form, Row, Col, Select, DatePicker, Divider } from "antd";
import { useLookupAddress } from "eth-hooks";
import React, { useCallback, useState } from "react";
import Blockies from "react-blockies";
import { Transactor } from "../helpers";
import Wallet from "./Wallet";
import {
  useOnBlock,
} from "../hooks";

const { Option } = Select;
const { utils } = require("ethers");

/*
  ~ What it does? ~

  

  ~ How can I use? ~

  <HardhatEVM
    localProvider={localProvider}
  />

  ~ Features ~
*/

export default function HardhatEVM(props) {
  const [address, setAddress] = useState();
  const [visible, setVisible] = useState(false);
  const [chainTimestamp, setChainTimestamp] = useState();

  const localProvider = props.localProvider;

  useOnBlock(localProvider, () => {
    updateTime();
  });

  async function updateTime(){
    const time = await localProvider.getBlock();
    setChainTimestamp(new Date(time.timestamp * 1000).toLocaleString("en-US"));
  }

  function onClose(){
    setVisible(false);
  }

  function showDrawer(){  
    setVisible(true);
  }

  async function increaseTime(){
    await localProvider.send("evm_increaseTime", [parseInt(form["increaseTimeSeconds"])]);
    await localProvider.send("evm_mine");
    updateTime();
  }

   async function setNextBlockTimestamp(){
    await localProvider.send("evm_setNextBlockTimestamp", [parseInt(form["nextBlockTimestamp"])]);
    await localProvider.send("evm_mine");
    updateTime();
  }

  const [ form, setForm ] = useState({})
  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
  }

  return (
      <>
        <Button type="primary" onClick={() => {showDrawer();}}>
          <span style={{ marginRight: 8 }} role="img" aria-label="support">
                👷‍♂️
              </span>
              Hardhat
        </Button>
        <Drawer
          title="Hardhat Network Manager"
          width={720}
          onClose={() => {onClose();}}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={() => {onClose();}} type="primary">
                Close
              </Button>
            </div>
          }
        >
          <h2>Increase Time (evm_increaseTime)</h2>
          <p>Increases the blockchain time by a given amount (in seconds)</p>
          <Row gutter={8}>
            <Col span={8}>
              <Input placeholder="Increase time by seconds" onChange={e => setField('increaseTimeSeconds', e.target.value)}/>
            </Col>
            <Col span={8}>
                <Button
                onClick={() => {increaseTime()}}
              >
                Increase Time
              </Button>
            </Col>
            <Col span={8}>
                <h3>{chainTimestamp}</h3>
            </Col>
          </Row>

          <Divider /> 

          <h2>Set Next Block Timestamp (evm_setNextBlockTimestamp)</h2>
          <p>Sets the next block timestamp to a given number</p>
          <Row gutter={8}>
            <Col span={8}>
              <Input placeholder="Desired timestamp Unix timestamp" onChange={e => setField('nextBlockTimestamp', e.target.value)}/>
            </Col>
            <Col span={8}>
                <Button
                onClick={() => {setNextBlockTimestamp()}}
              >
                Increase Time
              </Button>
            </Col>
            <Col span={8}>
                <h3>{chainTimestamp}</h3>
            </Col>
          </Row>
          <Divider /> 
        </Drawer>
      </>
    );
}
