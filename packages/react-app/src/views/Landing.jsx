import { utils } from "ethers";
import { Button, Input, Card, Row, Col, Select, Form, InputNumber, Divider } from "antd";
import React, { useState } from "react";
import { Address, AddressInput } from "../components";
import { useTokenList, useContractLoader, useContractReader } from "../hooks";
import { V2Hints } from '../views';
import Events from "../components/Events";
import { local } from "web3modal";

const { Option } = Select;

export default function Landing({ localProvider, yourLocalBalance, mainnetProvider, price, address, tx, writeContracts, useEventListener, mainnetContracts, readContracts }) {
  
  return (
    <div>
      <Row>
        <Col sm={{span:24}} lg={{span:8, offset:4}}>
              <h1>Welcome to the next dimension of the greatest larp...</h1> 
                <h1>R U READY ANON?</h1>
                <br />
              <h3>Hello Anon, 

              Thank you for helping us build and fund the open web. 
              The Greatest LARP was launched as an Alternate Reality Game and NFT fundraiser to support public goods. You can read the free comic and browse the auction at <a href="https://greatestlarp.com">GreatestLARP.com.</a>
              <br />
              On Level 2, we have been summoning the ETHbots to slay Moloch! As a thank you, 3D bots are now available to anyone holding a Digital ETHBot NFT #1-200. 
              <br />
              ETHBot holders can mint immediately and will receive a "blank bot". All bots are random and their art will be revealed when we unlock level 3! (this makes it harder to game the system and encourages us to work together to fund public goods!)
              <br />
              Free for Digital ETHbot holders (pick one up and support public goods at GreatestLARP.com)
              20 Bot designs inspired by @lahcen_kha
              Original audio by @AnnimusEdie Backend by @Blind_nabler 

              <br />
                    The five rarest bots can be seen <a href="https://youtu.be/7uJdhFuVSfo">here.</a> 
                    <br />
                    <a href="https://greatestlarp.com">GreatestLARP.com</a>
              </h3>
                    Rarity:
                    Two 1/1 (NGMIbot, WAGMIbot)
                    One 1/3 (Blackout)
                    Two 1/5 (GreenMachine, Wooden)
                    Three 1/9
                    Five 1/12
                    Seven 1/14
        </Col>
        <Col sm={24} lg={12}>
          <Row justify={'center'}>
            <Col span={12}>
                  <video controls autoPlay loop src={'/Videos/trailer.mp4'} style={{
                    maxWidth:'100%',
                    height:'auto',
                    width:'auto'
                   }} />
            </Col>
          </Row>
        </Col>
      </Row>
            <V2Hints
              address={address}
              yourLocalBalance={yourLocalBalance}
              mainnetProvider={mainnetProvider}
              price={price}
              localProvider={localProvider}
              writeContracts={writeContracts}
              tx={tx}
              useEventListener={useEventListener}
              mainnetContracts={mainnetContracts}
              readContracts={readContracts}
              style={{
                margin:'20px'
              }}
            />
    </div>
  );
}
