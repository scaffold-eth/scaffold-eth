import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { groth16 } from "snarkjs";


export default function ZkpInterface({
  name,
  inputFields,
  wasm,
  zkey
}) {

  const [proofInputs, setProofInputs] = useState(
    inputFields.reduce(
      (acc, curr, index) => {
        acc[curr] = "0" /*inputs[index]*/;
        return acc;
      },
      {}
    )
  );

  const [fullProof, setFullProof] = useState();

  async function proveInputs() {
    // const { proof, pubSignals } = await groth16.fullprove(proofInputs, wasm, zkey);
    // setFullProof(proof);
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
        <p>{JSON.stringify(proofInputs)}</p>
      </div>
    </div>
  );

}
