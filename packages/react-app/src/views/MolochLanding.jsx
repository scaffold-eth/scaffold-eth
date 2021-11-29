import { utils } from "ethers";
import { Button, Input, Card, Row, Col, Select, Form, InputNumber, Divider } from "antd";
import React, { useState } from "react";
import { Address, AddressInput } from "../components";
import { useContractLoader, useContractReader } from "eth-hooks";
import { MolochHints } from '../views';
import Events from "../components/Events";
import { local } from "web3modal";

const { Option } = Select;

export default function MolochLanding({ localProvider, yourLocalBalance, mainnetProvider, price, address, tx, writeContracts, mainnetContracts, readContracts }) {

  return (
    <div>
      <Row>
        <Col sm={{ span: 24 }} lg={{ span: 8, offset: 4 }}>
          <h1>How to mint a 3D Moloch (Free for Digital Moloch NFT holders):</h1>
          <h3>
            1. Purchase a Digital Moloch NFT at <a href="https://greatestlarp.com"> greatestlarp.com </a>(found on Level 3) 100% of funds go to public goods at Gitcoin
            <br />
            2. Go to <a href="https://opensea.io">opensea.io</a> and find the NFT in your collection
            <br />
            3. Open the Details dropdown and copy the Token ID
            <br />
            4. Go to <a href="http://LARPminter.com">LARPminter.com</a>
            <br />
            5. Scroll down and input the Digital Moloch NFT token ID</h3>
            <br /> 
          <h3>Hello Anon, Thank you for helping us build and fund the open web. The Greatest LARP was launched as an Alternate Reality Game and NFT fundraiser to support public goods. You can read the free comic and browse the auction at GreatestLARP.com.</h3>


          <h3>On Level 3, we have been battling the many Molochs! As a thank you, 3D Molochs are now available (free) to anyone holding a Digital Moloch NFT. </h3>

          <h3>21 Moloch designs inspired by @lahcen_kha
            Original audio by @AnnimusEdie
            Backend by @Blind_nabler</h3>

          <h3>Rarity: Five 1/1, One 1/10, Fifteen 1/19</h3>
        </Col>
        <Col sm={24} lg={12}>
          <Row justify={'center'}>
            <Col span={22}>
              <video controls autoPlay loop src={'/Videos/molochtrailer.mp4'} style={{
                maxWidth:'100%',
                height: 'auto',
                width: 'auto'
              }} />
            </Col>
          </Row>
        </Col>
      </Row>
      <MolochHints
        address={address}
        yourLocalBalance={yourLocalBalance}
        mainnetProvider={mainnetProvider}
        price={price}
        localProvider={localProvider}
        writeContracts={writeContracts}
        tx={tx}
        mainnetContracts={mainnetContracts}
        readContracts={readContracts}
        style={{
          margin: '20px'
        }}
      />
    </div>
  );
}
