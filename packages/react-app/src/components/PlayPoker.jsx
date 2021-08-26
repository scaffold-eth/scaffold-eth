import React, { useState, useCallback, useMemo } from "react";
import { Input, Button, Tooltip } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useContractLoader, useContractExistsAtAddress, genSolidityCalldata } from "../hooks";
import DisplayVariable from "./Contract/DisplayVariable";
import FunctionForm from "./Contract/FunctionForm";
const { utils } = require("ethers");
import mimcHash from '../mimc.js';

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
    // console.log("functions: ", displayedContractFunctions)

    function ReturnFunctionForm(fn){
        return <FunctionForm 
            key={"FF" + fn.name}
            contractFunction={(fn.stateMutability === "view" || fn.stateMutability === "pure")?contract[fn.name]:contract.connect(signer)[fn.name]}
            functionInfo={fn}
            provider={provider}
            gasPrice={gasPrice}
            triggerRefresh={triggerRefresh}/>
    }

    function ReturnDisplayVariable(fn){
        return <DisplayVariable 
            key={fn.name} contractFunction={contract[fn.name]} 
            functionInfo={fn} refreshRequired={fn} 
            triggerRefresh={triggerRefresh}/>
    }

    const playerCardCommit = contractIsDeployed ? displayedContractFunctions[0] : null
    const playerCardCommitForm = contractIsDeployed ? ReturnFunctionForm(playerCardCommit) : null

    const playerCardHash = contractIsDeployed ? displayedContractFunctions[6] : null

    const placeBet = contractIsDeployed ? displayedContractFunctions[4] : null
    const placeBetForm = contractIsDeployed ? ReturnFunctionForm(placeBet) : null

    const playerBet = contractIsDeployed ? displayedContractFunctions[5] : null
    const playerBetForm = contractIsDeployed ? ReturnDisplayVariable(playerBet) : null

    const dealCard = contractIsDeployed ? displayedContractFunctions[2] : null
    const dealCardForm = contractIsDeployed ? ReturnFunctionForm(dealCard) : null

    const thresholdVariable = contractIsDeployed ? displayedContractFunctions[3] : null
    const thresholdForm = contractIsDeployed ? ReturnDisplayVariable(thresholdVariable) : null
    
    

    const [seed, setSeed] = useState(1764);
    const [seedCommit, setSeedCommit] = useState(0);
    // const [cardCommit, setCardCommit] = useState(0);
    const [isValid, setIsValid] = useState(null);
    const [hash, setHash] = useState();
    const [threshold, setThreshold] = useState();
    

    async function getValue(contractFunction, setVariable, triggerRefresh, number){
        const refresh = async () => {
            try {
            const funcResponse = await contractFunction();
            if (number) {
                setVariable(funcResponse.toNumber());
            } else{
                setVariable(funcResponse.toString());
            }
            triggerRefresh(false);
            } catch (e) {
            console.log(e);
            }
        };
        refresh()
    }
        
  
  
    async function CircuitCalldata(seed, hash, threshold) {
  
      const { proof, publicSignals } =
        await window.snarkjs.groth16.fullProve({ "x": seed, "hash": hash, "threshold":threshold },
        "/circuits/hash_circuit.wasm",
        "/circuits/hash_circuit_final.zkey");
  
      const vKey = await fetch("/circuits/hash_verification_key.json").then(function(res) {
        const js = res.json();
        return js;
      });
  
      const res = await window.snarkjs.groth16.verify(vKey, publicSignals, proof);
      const genCallData = await genSolidityCalldata(publicSignals, proof);
      // TODO: figure out how to send genSolidityCallData to backend
      return res, genCallData;
    }
    
  
    const handleIsValid = async () => {
      const [res, genCallData] = await CircuitCalldata(seedCommit, hash, threshold);
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
                                setSeedCommit(seed)
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
                    Check your Mimc hash {seed} :   {seedCommit}
                </h2>
            </span>
            <span>
                {playerCardCommitForm}
                {placeBetForm}
                {playerBetForm}
                {dealCardForm}
                {thresholdForm}
                <Button 
                    // TODO Figure out async handling in react and combine this button with the next
                    onClick={async()=>{
                        getValue(contract[thresholdVariable.name], setThreshold, triggerRefresh, true);
                        getValue(contract[playerCardHash.name], setHash, triggerRefresh, false);                        
                    }}
                    size="large"
                >
                    Prepare zk proof
                </Button>
                <Button 
                    onClick={async() => {
                        //await getValue(contract[thresholdVariable.name], setThreshold, triggerRefresh, true);
                        //await getValue(contract[playerCardHash.name], setHash, triggerRefresh, false);
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