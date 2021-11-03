import React, { useState, useEffect } from "react";
import { Input, Button, Tabs, Divider, Result, Typography, message } from "antd";
import ReactJson from 'react-json-view';
const snarkjs = require("snarkjs");

const { TabPane } = Tabs;
const { Text } = Typography;


export default function ZkpInterface({
  inputFields,
  wasm,
  zkey,
  vkey,
  scVerifyFunc,
}) {

  const [proofInputs, setProofInputs] = useState(inputFields);

  const [proof, setProof] = useState();
  const [signals, setSignals] = useState();
  const [solidityCalldata, setSolidityCalldata] = useState();
  const [verResult, setVerResult] = useState();
  const [scVerResult, setScVerReesult] = useState();

  function parseSolidityCalldata(prf, sgn) {
    // let i = [];
    // while (i[i.length-1] != -1) {
    //    i.push(str.indexOf('"', i[i.length-1]+1));
    // }
    // i.pop();
    // let data = [];
    // for (let j = 0; j<i.length-1; j+=2) {
    //   data.push(str.slice(i[j]+1, i[j+1]));
    // }
    // let calldata = [
    //   [data[0].slice(2), data[1].slice(2)],
    //   [
    //     [data[2].slice(2), data[3].slice(2)],
    //     [data[4].slice(2), data[5].slice(2)]
    //   ],
    //   [data[6].slice(2), data[7].slice(2)],
    //   [data[8].slice(2), data[9].slice(2)]
    // ];

    let calldata = [
      [prf.pi_a[0], prf.pi_a[1]],
      [
        [prf.pi_b[0][1], prf.pi_b[0][0]],
        [prf.pi_b[1][1], prf.pi_b[1][0]]
      ],
      [prf.pi_c[0], prf.pi_c[1]],
      [...sgn]
    ];

    return calldata;
  }

  async function proveInputs() {

    console.log("Calculating Proof! ...")
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(proofInputs, wasm, zkey);
    // const calldataString = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
    const calldata = parseSolidityCalldata(proof, publicSignals);

    setVerResult(undefined);
    setScVerReesult(undefined);

    console.log(proof);
    setProof(proof);

    console.log(publicSignals);
    setSignals(publicSignals);

    console.log(calldata)
    setSolidityCalldata(calldata);
  }

  async function verifyProof() {
    if (!vkey) {
      vkey = await snarkjs.zKey.exportVerificationKey(zkey);
    }
    const verified = await snarkjs.groth16.verify(vkey, signals, proof);
    return verified;
  }


  const fields = [];
  const inputFieldsKeys = Object.keys(inputFields);
  for (let i = 0; i < inputFieldsKeys.length; i++) {
    if (!Array.isArray(proofInputs[inputFieldsKeys[i]])) {
      fields.push(
        <div style={{padding: "8px"}}>
          <div style={{ float: "left" }}>
            <h3>{inputFieldsKeys[i]}:</h3>
          </div>
          <Input
          defaultValue={proofInputs[inputFieldsKeys[i]]}
          allowClear={true}
          onChange={event => {
            const inputUpdate = { ...proofInputs };
            inputUpdate[inputFieldsKeys[i]] = event.target.value;
            setProofInputs(inputUpdate);
          }}
          />
        </div>
      );
    } else {
      const arrElements = [];
      for (let j = 0; j < proofInputs[inputFieldsKeys[i]].length; j++)
      arrElements.push(
        <div style={{padding: "4px"}}>
          <div style={{ float: "left"}}>
            <h4>index: {j}</h4>
          </div>
          <Input
            defaultValue={proofInputs[inputFieldsKeys[i]][j]}
            allowClear={true}
            onChange={(event) => {
              const inputUpdate = { ...proofInputs };
              inputUpdate[inputFieldsKeys[i]][j] = event.target.value;
              setProofInputs(inputUpdate);
            }}
          />
        </div>
      );
      fields.push(
        <div style={{padding: "8px"}}>
          <div style={{ float: "left"}}>
            <h3>{inputFieldsKeys[i]}:</h3>
          </div>
          <br/>
          <div style={{padding: "2vw"}}>
            {arrElements}
          </div>
        </div>
      );
    }
  }

  const proofDataDisp = (
    <div style={{textAlign: "left", margin: "auto"}}>
      <ReactJson
        src={proof}
        style={{fontSize: "0.7em"}}
        displayArrayKey={false}
        displayDataTypes={false}
      />
    </div>
  );

  const pubSigData = (
    <div style={{textAlign: "left", margin: "auto"}}>
      <ReactJson
        src={signals}
        style={{fontSize: "0.7em"}}
        displayArrayKey={false}
        displayDataTypes={false}
      />
    </div>
  );

  const solCalldataDisp = (
    <div style={{textAlign: "left", margin: "auto"}}>
      <ReactJson
        src={solidityCalldata}
        style={{fontSize: "0.7em"}}
        displayArrayKey={false}
        displayDataTypes={false}
      />
    </div>
  );

  return (
    <div style={{ margin: "auto", width: "48vw" }}>
      <div >
        {fields}
      </div>
      <div>
        <Button
          style={{ margin: "2vw" }}
          size="large"
          danger
          type=""
          onClick={proveInputs}
        >
          Prove
        </Button>
      </div>
      <div>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Proof Data" key="1">
            <Result
              status={verResult == undefined ? undefined : verResult ? "success" : "error"}
              subTitle={verResult == undefined ? "Proof unverified" : verResult ? "Valid proof" : "Invalid proof"}
              extra={
                <Button
                  type="primary"
                  ghost={verResult == undefined ? false : true}
                  onClick={
                    async () => {
                      try {
                        let res = await verifyProof();
                        setVerResult(res);
                      } catch (err) {
                        console.error(err);
                        message.error("Something is not right here", 3);
                      }
                    }
                  }
                >
                  Verify
                </Button>
              }
            />
            {proof ? proofDataDisp : <Text>proof undefined</Text>}
            <br/>
            {signals ? pubSigData : <Text>public signals undefined</Text>}
          </TabPane>
          <TabPane tab="Solidity Calldata" key="0">
            <Result
              status={scVerResult == undefined ? undefined : scVerResult ? "success" : "error"}
              subTitle={scVerResult == undefined ? "Proof unverified" : scVerResult ? "Valid proof" : "Invalid proof"}
              extra={
                <Button
                  type="primary"
                  ghost={scVerResult == undefined ? false : true}
                  onClick={
                    async () => {
                      try {
                        let res = await scVerifyFunc(...solidityCalldata);
                        setScVerReesult(res);
                      } catch (err) {
                        console.error(err);
                        message.error("Something is not right here", 3);
                      }
                    }
                  }
                >
                  Verify with smart contract
                </Button>
              }
            />
            {solidityCalldata ? solCalldataDisp : <Text>solidity calldata undefined</Text>}
          </TabPane>

        </Tabs>
        <Divider/>
      </div>
      <br/>
    </div>
  );

}
