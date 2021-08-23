import React, { useState, useCallback } from "react";
import { Input, Button, Tooltip } from "antd";
import { SendOutlined } from "@ant-design/icons";

export default function SeedCommit(props) {
    const [seed, setSeed] = useState();
    const [seedCommit, setSeedCommit] = useState(0);
    const [cardCommit, setCardCommit] = useState(0);
    const [isValid, setIsValid] = useState(null);
    const [hash, setHash] = useState();
    const [threshold, setThreshold] = useState();
  
  
    async function CircuitCalldata(circuitName, x, hash, threshold) {
  
      const { proof, publicSignals } =
        await window.snarkjs.groth16.fullProve({ "x": x, "hash": hash.toString(), "threshold":threshold },
        "/react-app/src/circuits/hash_circuit.wasm",
        "/react-app/src/circuits/hash_circuit_final.zkey");
  
      const vKey = await fetch("/react-app/src/circuits/hash_verification_key.json").then(function(res) {
        const js = res.json();
        return js;
      });
  
      const res = await window.snarkjs.groth16.verify(vKey, publicSignals, proof);
      return res;
    }
    
  
    const handleIsValid = async () => {
      const res = await CircuitCalldata("hash", seed, hash, threshold);
      setIsValid(res.toString());
    };

    return(
        <div style={{padding:100}}>
            <span>
                <Input
                    size="large"
                    placeholder={props.placeholder ? props.placeholder : "Enter secret seed!!"}
                    value={seed}
                    onChange={async e => {
                        const newSeed = e.target.value;
                        setSeed(newSeed);
                        setHash("15893827533473716138720882070731822975159228540693753428689375377280130954696")
                    }}
                    suffix={
                        <Tooltip title="Commit your secret seed!!">
                        <Button
                            onClick={() => {
                            }}
                            shape="circle"
                            icon={<SendOutlined />}
                        />
                        </Tooltip>
                    }
                />
                <h2>
                    Check your Mimc hash {seed} :   {hash}
                </h2>
            </span>
            <span>
                <Button
                    onClick={() =>{
                        setThreshold(1000)
                    }}
                    size="large"
                    >
                        Check threshold
                </Button>
                <h2>
                    Your target is {threshold}
                </h2>
                <Button 
                    onClick={async() => {
                        handleIsValid()
                    }}
                    size="large"
                >
                    Generate zk proof
                </Button>
                <h2>
                    Your proof is {isValid}
                </h2>
            </span>
        </div>
    )
}