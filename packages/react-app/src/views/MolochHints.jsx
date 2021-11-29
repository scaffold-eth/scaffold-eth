import { utils } from "ethers";
import { Button, Input, Card, Row, Col, Select, Form, InputNumber } from "antd";
import React, { useState } from "react";
import { Address, AddressInput } from "../components";
import { useTokenList, useContractLoader, useContractReader } from "eth-hooks";
import Events from "../components/Events";
import { local } from "web3modal";
import autoprefixer from "autoprefixer";

const { Option } = Select;

export default function Hints({ localProvider, yourLocalBalance, mainnetProvider, price, address, tx, writeContracts,  mainnetContracts, readContracts }) {
  const ogNFT2 = useContractReader(readContracts,"ConditionalMolochBot", "ogNFT");
  const [tokenId, setTokenId] = useState("...");

  const ethBotOwnerOf = useContractReader(mainnetContracts, "MOLOCHBOT", "ownerOf", [
   tokenId 
  ]);
  
  function onFinish() {
    tx(writeContracts.ConditionalMolochBot.claim(tokenId));
  }

  return (
      <div>
          <Row justify='start' align='middle' style={{
          backgroundImage:'url(./img/molochbackground.png',
          backgroundSize:'cover',
          backgroundPosition:'right top'
          }}>
            <Col xs={24} lg={8}>
                <Card title="MINT YOUR 3d Moloch!">
                <Card title="Source Contract:">
                 Address: <Address 
                  address={ogNFT2}
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
