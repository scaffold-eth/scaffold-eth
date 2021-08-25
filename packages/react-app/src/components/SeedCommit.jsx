import React, { useState, useCallback, useMemo } from "react";
import { Input, Button, Tooltip } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useContractLoader, useContractExistsAtAddress } from "../hooks";
import DisplayVariable from "./Contract/DisplayVariable";
import FunctionForm from "./Contract/FunctionForm";

export default function SeedCommit({customContract, account, gasPrice, signer, provider, name, show, price, blockExplorer}) {
    const contracts = useContractLoader(provider);
    
    let contract
    contract = contracts ? contracts[name] : "";
    

    const address = contract ? contract.address : "";
    const contractIsDeployed = useContractExistsAtAddress(provider, address);
    const [refreshRequired, triggerRefresh] = useState(false);
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
    const dealCard = contractIsDeployed ? displayedContractFunctions[0] : null
    const dealCardForm = contractIsDeployed ? <FunctionForm 
                                                key={"FF" + dealCard.name}
                                                contractFunction={(dealCard.stateMutability === "view" || dealCard.stateMutability === "pure")?contract[dealCard.name]:contract.connect(signer)[dealCard.name]}
                                                functionInfo={dealCard}
                                                provider={provider}
                                                gasPrice={gasPrice}
                                                triggerRefresh={triggerRefresh}/> : <div></div>

    const thresholdVariable = contractIsDeployed ? displayedContractFunctions[7] : 15
    const thresholdForm = contractIsDeployed ? <DisplayVariable 
            key={thresholdVariable.name} contractFunction={contract[thresholdVariable.name]} 
            functionInfo={thresholdVariable} refreshRequired={refreshRequired} 
            triggerRefresh={triggerRefresh}/> : null
    

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
                {dealCardForm}
                {thresholdForm}
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
      </div>
    )
}