import React, { useState, useEffect } from "react";
import { Input, Button, Tabs, Divider, Result } from "antd";
import JSONpretty from "react-json-pretty";
import ReactJson from 'react-json-view';
const snarkjs = require("snarkjs");

const { TabPane } = Tabs;


export default function ZkpInterface({
  name,
  inputFields,
  wasm,
  zkey,
  vkey,
  scVerifyFunc,
}) {

  const [proofInputs, setProofInputs] = useState(
    // inputFields.reduce(
    //   (acc, curr, index) => {
    //     acc[curr] = "0";
    //     return acc;
    //   },
    //   {}
    // )
    inputFields
  );

  const [proof, setProof] = useState();
  const [signals, setSignals] = useState();
  const [solidityCalldata, setSolidityCalldata] = useState();
  const [verResult, setVerResult] = useState();
  const [scVerResult, setScVerReesult] = useState();

  function parseSolidityCalldataString(str) {
    let i = [];
    while (i[i.length-1] != -1) {
       i.push(str.indexOf('"', i[i.length-1]+1));
    }
    i.pop();
    let data = [];
    for (let j = 0; j<i.length-1; j+=2) {
      data.push(str.slice(i[j]+1, i[j+1]));
    }
    let calldata = [
      [data[0].slice(2), data[1].slice(2)],
      [
        [data[2].slice(2), data[3].slice(2)],
        [data[4].slice(2), data[5].slice(2)]
      ],
      [data[6].slice(2), data[7].slice(2)],
      [data[8].slice(2), data[9].slice(2)]
    ];
    return calldata;
  }

  async function proveInputs() {

    console.log("Calculating Proof! ...")
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(proofInputs, wasm, zkey);
    const calldataString = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
    const calldata = parseSolidityCalldataString(calldataString);

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
    fields.push(
      <div style={{padding: "8px"}}>
        <div style={{ float: "left" }}>
          <h3>{inputFieldsKeys[i]}:</h3>
        </div>
        <Input
        placeholder={inputFields[inputFieldsKeys[i]]}
        allowClear={true}
        onChange={event => {
          const inputUpdate = { ...proofInputs };
          inputUpdate[inputFieldsKeys[i]] = event.target.value;
          setProofInputs(inputUpdate);
        }}
        />
      </div>
    );
  }

  const proofDataDisp = (
    <div style={{textAlign: "left", margin: "auto"}}>
      {/*<JSONpretty
        data={(proof)}
        style={{fontSize: "0.7em"}}
      />*/}
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
      {/*<JSONpretty
        data={signals}
        style={{fontSize: "0.7em"}}
      />*/}
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
      {/*<JSONpretty
        data={solidityCalldata}
        style={{fontSize: "0.7em"}}
      />*/}
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
        <p style={{ padding: "0.5vw"}}>{proofInputs ? JSON.stringify(proofInputs) : "undefined proof inputs"}</p>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Proof Data" key="1">
            <Result
              status={verResult == undefined ? undefined : verResult ? "success" : "error"}
              subTitle={verResult == undefined ? "Proof unverified" : verResult ? "Valid proof" : "Invalid proof"}
              extra={
                <Button
                  type="primary"
                  onClick={
                    async () => {
                      let res = await verifyProof();
                      setVerResult(res);
                    }
                  }
                >
                  Verify
                </Button>
              }
            />
            {proof ? proofDataDisp : "proof undefined"}
            <br/>
            {signals ? pubSigData : "public signals undefined"}
          </TabPane>
          <TabPane tab="Solidity Calldata" key="0">
            <Result
              status={scVerResult == undefined ? undefined : scVerResult ? "success" : "error"}
              subTitle={scVerResult == undefined ? "Proof unverified" : scVerResult ? "Valid proof" : "Invalid proof"}
              extra={
                <Button
                  type="primary"
                  onClick={
                    async () => {
                      let res = await scVerifyFunc(...solidityCalldata);
                      setScVerReesult(res);
                    }
                  }
                >
                  Verify with smart contract
                </Button>
              }
            />
            <br/>
            {solidityCalldata ? solCalldataDisp : "solidity calldata undefined"}
          </TabPane>

        </Tabs>
        <Divider/>
      </div>
      <br/>
    </div>
  );

}
