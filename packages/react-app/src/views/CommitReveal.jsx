import React, { useState } from "react";
import { Button, List, Card, Row, Col, Input, Tooltip, Typography } from "antd";
import { Address, EtherInput, BytesStringInput } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { useContractReader } from "eth-hooks";
const { utils, constants } = require("ethers");
const { Text } = Typography;

export default function CommitReveal({
  commitEvents,
  revealEvents,
  mainnetProvider,
  price,
  tx,
  readContracts,
  writeContracts,
}) {

  const [ commitData, setCommitData ] = useState("");
  const [ commitBlock, setCommitBlock ] = useState(0);
  const [ revealData, setRevealData ] = useState("");
  const [ hashData, setHashData ] = useState(constants.HashZero);

  // const hash = useContractReader(readContracts, "YourContract", "getHash", [hashData]);
  const hash = () => {
    return utils.solidityKeccak256(["address", "bytes32"], [readContracts.YourContract.address, hashData]);
  }

  return (
    <div>
      <div style={{ margin: "auto", width: "50vw" }}>
        <Card
          title={
            <h2>Calculate hash</h2>
          }
          size="small"
          style={{ marginTop: 25 }}
        >
          <Row justify="center">

            <BytesStringInput
              autofocus
              placeholder="Enter value..."
              onChange={value => {
                let tempVal = value;
                if (!utils.isHexString(value)) {
                  /* in case user enters invalid bytes32 number,
                       it considers it as string and converts to bytes32 */
                  tempVal = utils.formatBytes32String(value);
                }
                setHashData(tempVal);
              }}
            />
            <Text copyable style={{marginTop: 25}}>
              {readContracts && readContracts.YourContract ? hash() : constants.HashZero}
            </Text>

          </Row>
        </Card>

        <Card
          title={
              <h2>Commit</h2>
          }
          size="small"
          style={{ marginTop: 25 }}
        >
          <Row justify="center">
            <h4>Enter commit data:</h4>
            <Input
              onChange={
                async e => {
                  setCommitData(e.target.value);
            }} style={{marginBottom:25}} />

            <h4>Enter block number:</h4>
            <Input onChange={
              async e => {
                setCommitBlock(e.target.value);
            }}/>

            <Button onClick={()=>{
              tx( writeContracts.YourContract.commit(commitData, commitBlock ))
            }} style={{marginTop:25}}>
              Commit
            </Button>
          </Row>
        </Card>

        <Card
          title={
              <h2>Reveal</h2>
          }
          size="small"
          style={{ marginTop: 25 }}
        >
          <Row justify="center">
            <h4>Enter reveal data:</h4>
            <Input onChange={
              async e => {
                setRevealData(e.target.value);
            }}/>

            <Button onClick={()=>{
              tx( writeContracts.YourContract.reveal(revealData ))
            }} style={{marginTop:25}}>
              Reveal
            </Button>

          </Row>
        </Card>
      </div>

      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <h2>Commit Events:</h2>
        <List
          bordered
          dataSource={commitEvents}
          renderItem={(item) => {
            return (
            <List.Item>
              <Address
                value={item.args.sender}
                ensProvider={mainnetProvider}
                fontSize={16}
              /> =>
              {item.args.dataHash}
            </List.Item>
            )
          }}
        />
      </div>

      <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
        <h2>Reveal Events:</h2>
        <List
          bordered
          dataSource={revealEvents}
          renderItem={(item) => {
            return (
            <List.Item>
              <Address
                value={item.args.sender}
                ensProvider={mainnetProvider}
                fontSize={16}
              /> =>
              {item.args.revealHash}
              <h4>Random number: {item.args.random}</h4>
            </List.Item>
            )
          }}
        />
      </div>
    </div>
  );
}
