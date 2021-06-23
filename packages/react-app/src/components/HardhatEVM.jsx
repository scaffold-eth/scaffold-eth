import { SendOutlined } from "@ant-design/icons";
import { Button, Input, Tooltip, Drawer, Form, Row, Col, Select, DatePicker } from "antd";
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

  async function increaseTime(increase){
    await localProvider.send("evm_increaseTime", [(3600 * 24)]);
    await localProvider.send("evm_mine");
    updateTime();
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
          <Row gutter={8}>
            <Col span={12}>
                <Button
                onClick={() => {increaseTime(3600 * 24)}}
              >
                Increase Time (1 day)
              </Button>
            </Col>
            <Col span={12}>
                <h2>{chainTimestamp}</h2>
            </Col>
          </Row>
        </Drawer>
      </>
    );
}
