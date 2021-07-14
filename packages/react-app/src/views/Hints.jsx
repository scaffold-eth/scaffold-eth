/* eslint-disable jsx-a11y/accessible-emoji */

import { utils } from "ethers";
import { Card, Select, Form, Button, Row, Col} from "antd";
import React, { useState } from "react";
import { Address, AddressInput } from "../components";
import { useTokenList, useContractReader} from "../hooks";

export default function Hints ({ readContracts, writeContracts, tx, yourLocalBalance, mainnetProvider, price, address }) {

    const [fromAddress, setFromAddress] = useState();
    const [toAddress, setToAddress] = useState();
    const owner = useContractReader(readContracts, "MVPNFT", "owner") 
    function onFinish() {
tx(writeContracts.MVPNFT['safeTransferFrom(address,address,uint256)'](fromAddress, toAddress, 1))
    }

  return (
    <div style={{margin: 32}}>
      <Row justify="center">
            <Col span={6}>
            <Card title="SafeTransferFrom">
            <Form 
                name="MinimumViableNFT"
            >
                <Form.Item
                label="From"
                name="From">
                <AddressInput 
                placeholder="Enter address"
                value={fromAddress}
                onChange={setFromAddress}/>
                </Form.Item>

                <Form.Item
                label="To"
                name="To">
                <AddressInput 
                placeholder="Enter address"
                value={toAddress}
                onChange={setToAddress}/>
                </Form.Item>

                <Form.Item>
                <Button type="primary" onClick={onFinish} >
                Send! 
                </Button>
                </Form.Item>
            </Form>
            </Card>
            </Col>
            <Col span={6}>
            <Card title="Current Owner:">
            <Address 
            address={owner}/>
            </Card>
            </Col>
      </Row>
    </div>
  );
}
