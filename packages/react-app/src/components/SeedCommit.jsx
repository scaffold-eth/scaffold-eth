import React, { useState, useCallback, useMemo } from "react";
import { Input, Button, Tooltip } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useContractLoader, useContractExistsAtAddress } from "../hooks";
import DisplayVariable from "./Contract/DisplayVariable";
import FunctionForm from "./Contract/FunctionForm";
import mimcHash from '../mimc.js';

export default function SeedCommit({customContract, account, gasPrice, signer, provider, name, show, price, blockExplorer}) {
    const contracts = useContractLoader(provider);
    
    let contract
    contract = contracts ? contracts[name] : "";
    

    const address = contract ? contract.address : "";
    const contractIsDeployed = useContractExistsAtAddress(provider, address);
    const displayedContractFunctions = useMemo(
        () =>
          contract
            ? Object.values(contract.interface.functions).filter(
                fn => fn.type === "function" && !(show && show.indexOf(fn.name) < 0),
              )
            : [],
        [contract, show],
      );
    console.log("functions: ", displayedContractFunctions)
    

    const [seed, setSeed] = useState();
    const [seedCommit, setSeedCommit] = useState(0);
    const [cardCommit, setCardCommit] = useState(0);
    const [isValid, setIsValid] = useState(null);
    const [hash, setHash] = useState();
    const [threshold, setThreshold] = useState();
  
  
    async function CircuitCalldata(seed, hash, threshold) {
  
      const { proof, publicSignals } =
        await window.snarkjs.groth16.fullProve({ "x": seed, "hash": hash.toString(), "threshold":threshold },
        "/circuits/hash_circuit.wasm",
        "/circuits/hash_circuit_final.zkey");
  
      const vKey = await fetch("/circuits/hash_verification_key.json").then(function(res) {
        const js = res.json();
        return js;
      });
  
      const res = await window.snarkjs.groth16.verify(vKey, publicSignals, proof);
      return res;
    }
    
  
    const handleIsValid = async () => {
      const res = await CircuitCalldata(seed, hash, threshold);
      setIsValid(res.toString());
    };

    return(
        <div>
        <div style={{padding:100}}>
            <span>
                <Input
                    size="large"
                    placeholder={"Enter secret seed!!"}
                    value={seed}
                    onChange={async e => {
                        const newSeed = e.target.value;
                        setSeed(newSeed);
                        // TODO: Import MIMC hash function and set hash to the correct function
                        setSeedCommit(mimcHash(newSeed));
                        // setHash("15893827533473716138720882070731822975159228540693753428689375377280130954696")
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
                <Text copyable={{ text: seedCommit }} style={{marginTop: 25}}>
                    {seedCommit}
                </Text>
                
                <h2>
                    Check your MiMC hash {seed} :   {seedCommit}
                </h2>
            </span>
            <span>
                <Button
                    onClick={() =>{
                        setThreshold(2000)
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
                    Generate ZK proof
                </Button>
                <h2>
                    Your proof is {isValid}
                </h2>
            </span>
        </div>
      </div>
    )
}