import React, { useState, useEffect } from "react";
import { Input, Button, Tabs, Divider } from "antd";
import JSONpretty from "react-json-pretty";
import { useGroth16SolidityCalldata } from "../hooks"
const snarkjs = require("snarkjs");

const { TabPane } = Tabs;


export default function ZkpInterface({
  name,
  inputFields,
  wasm,
  zkey,
  vkey,
}) {

  const [proofInputs, setProofInputs] = useState(
    inputFields.reduce(
      (acc, curr, index) => {
        acc[curr] = "0";
        return acc;
      },
      {}
    )
  );

  const [proof, setProof] = useState();
  const [signals, setSignals] = useState();
  const [solidityCalldata, setSolidityCalldata] = useState();

  async function proveInputs() {

    console.log("Calculating Proof! ...")
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(proofInputs, wasm, zkey);
    const calldata = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);

    console.log(proof);
    setProof(proof);

    console.log(publicSignals);
    setSignals(publicSignals);

    console.log(calldata)
    setSolidityCalldata(calldata);
  }

  const fields = [];
  for (let i = 0; i < inputFields.length; i++) {
    fields.push(
      <div style={{padding: "8px"}}>
        <div style={{ float: "left" }}>
          <h3>{inputFields[i]}:</h3>
        </div>
        <Input
        allowClear={true}
        onChange={event => {
          const inputUpdate = { ...proofInputs };
          inputUpdate[inputFields[i]] = event.target.value;
          setProofInputs(inputUpdate);
        }}
        />
      </div>
    );
  }

  const proofDataDisp = (
    <div>
      <JSONpretty
        data={(proof)}
        style={{fontSize: "0.7em"}}
      />
    </div>
  );

  const solCalldataDisp = (
    <div>
      <JSONpretty
        data={solidityCalldata}
        style={{fontSize: "0.7em"}}
      />
    </div>
  );

  const pubSigData = (
    <div>
      <JSONpretty
        data={signals}
        style={{fontSize: "0.7em"}}
      />
    </div>
  );

  return (
    <div>
      <div style={{ margin: "auto", width: "46vw" }}>
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
          <TabPane tab="Solidity Calldata" key="0">
            {solidityCalldata ? solCalldataDisp : "solidity calldata undefined"}
          </TabPane>
          <TabPane tab="Proof Data" key="1">
            {proof ? proofDataDisp : "proof undefined"}
            <br/>
            {signals ? pubSigData : "public signals undefined"}
          </TabPane>
        </Tabs>
        <Divider/>
      </div>
      <br/>
    </div>
  );

}
