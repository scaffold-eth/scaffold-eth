import { utils } from "ethers";
import { Button, Input, Card, Row, Col, Select, Form, InputNumber } from "antd";
import React, { useState } from "react";
import { Address, AddressInput } from "../components";
import { useContractLoader, useContractReader } from "eth-hooks";
import Events from "../components/Events";
import { local } from "web3modal";
import autoprefixer from "autoprefixer";

const { Option } = Select;

export default function Hints({ localProvider, yourLocalBalance, mainnetProvider, price, address, tx, writeContracts,  mainnetContracts, readContracts}) {
  const ogNFT = useContractReader(readContracts,"ConditionalEthBot", "ogNFT");
  const [tokenId, setTokenId] = useState("...");

  const ethBotOwnerOf = useContractReader(mainnetContracts, "ETHBOT", "ownerOf", [
   tokenId 
  ]);
  
  function onFinish() {
    tx(writeContracts.ConditionalEthBot.claim(tokenId));
  }

  return (
      <div>
          <Row justify='start' align='middle' style={{
          backgroundImage:'url(./img/background.png',
          backgroundSize:'cover',
          backgroundPosition:'right top'
          }}>
            <Col xs={24} lg={8}>
                <Card title="MINT YOUR 3d EthBot!">
                <Card title="Source Contract:">
                 Address: <Address 
                  address={ogNFT}
                  fontSize={18} />
                </Card>
                <Card title="NFT to be minted:">
                  <Form
                  title="tokenId"
                  onFinish={onFinish}
                  >
                    <Form.Item>
                      <Input onChange={(e) => setTokenId(e.target.value)} />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Mint!
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
                <Card title="Owner of TOKEN ID:">
                 Address: <Address 
                  address={ethBotOwnerOf}
                  fontSize={18} />
                </Card>
                </Card>
              </Col>
            </Row>
      </div>
  );
}
