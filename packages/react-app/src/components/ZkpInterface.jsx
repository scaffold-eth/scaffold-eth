import React, { useState, useEffect } from "react";
import { Input, Button } from "antd";
const snarkjs = require("snarkjs");

export default function ZkpInterface({
  name,
  inputFields,
  wasm,
  zkey
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

  const [fullProof, setFullProof] = useState("0");

  async function proveInputs() {
    const { proof, pubSignals } = await snarkjs.groth16.fullProve(proofInputs, wasm, zkey);
    console.log("Calculating Proof!")
    setFullProof(proof);
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

  return (
    <div style={{ margin: "auto", width: "46vw" }}>
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
      <div style={{ padding: "" }}>
        <p>{JSON.stringify(proofInputs)}</p>
        <p>{fullProof}</p>
      </div>
    </div>
  );

}
