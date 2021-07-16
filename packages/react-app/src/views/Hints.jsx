/* eslint-disable jsx-a11y/accessible-emoji */

import { utils } from "ethers";
import { Card, Row, Col, Select } from "antd";
import React, { useState } from "react";
import { Address, AddressInput } from "../components";
import { useTokenList, useContractLoader, useContractReader } from "../hooks";

const { Option } = Select;

export default function Hints({ localProvider, yourLocalBalance, mainnetProvider, price, address }) {
  // Get a list of tokens from a tokenlist -> see tokenlists.org!
  const [selectedToken, setSelectedToken] = useState("Pick a token!");
  const listOfTokens = useTokenList(
    "https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json",
  );
  const readContracts = useContractLoader(localProvider);
  const ogNFT = useContractReader(readContracts,"ConditionalNFT", "ogNFT")

  return (
    <div>
      <Row justify="center">
        <Col span="12">
          <Card title="Conditional Minter">
            <Row justify="center">
              <Col span="8">
                <Card title="Source Contract">
                 Address: <Address 
                  address={ogNFT}
                  fontSize={18} />
                </Card>
              </Col>
              <Col span="8">
                <Card title="NFT to be minted">

                </Card>
              </Col>
              <Col span="8">
                <Card title="NFT MINTED">

                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
