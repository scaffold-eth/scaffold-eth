import React, { useState, useCallback, useMemo } from "react";
import { Input, Button, Tooltip } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useContractLoader, useContractExistsAtAddress, genSolidityCalldata, mimcHash } from "../hooks";
import DisplayVariable from "./Contract/DisplayVariable";
import FunctionForm from "./Contract/FunctionForm";
import { Transactor } from "../helpers";
import bigInt from 'big-integer';


export default function PlayPoker({customContract, account, gasPrice, signer, provider, name, show, price, blockExplorer}) {
    const contracts = useContractLoader(provider);
    
    let contract
    contract = contracts ? contracts[name] : "";
    

    const address = contract ? contract.address : "";
    const contractIsDeployed = useContractExistsAtAddress(provider, address);
    const [refreshRequired, triggerRefresh] = useState(false);
    const tx = Transactor(provider, gasPrice);
    const displayedContractFunctions = useMemo(
        () =>
          contract
            ? Object.values(contract.interface.functions).filter(
                fn => fn.type === "function" && !(show && show.indexOf(fn.name) < 0),
              )
            : [],
        [contract, show],
      );
    //console.log("functions: ", displayedContractFunctions)

    function ReturnFunctionForm(i){
        var fn = displayedContractFunctions[i]
        return <FunctionForm 
            key={"FF" + fn.name}
            contractFunction={(fn.stateMutability === "view" || fn.stateMutability === "pure")?contract[fn.name]:contract.connect(signer)[fn.name]}
            functionInfo={fn}
            provider={provider}
            gasPrice={gasPrice}
            triggerRefresh={triggerRefresh}/>
    }

    function ReturnDisplayVariable(i){
        var fn = displayedContractFunctions[i]
        return <DisplayVariable 
            key={fn.name} contractFunction={contract[fn.name]} 
            functionInfo={fn} refreshRequired={fn} 
            triggerRefresh={triggerRefresh}/>
    }
  
    const playerSeedCommitForm = contractIsDeployed ? ReturnFunctionForm(2) : null
    const playerCardCommitForm = contractIsDeployed ? ReturnFunctionForm(1) : null
    const playerCardHash = contractIsDeployed ? ReturnDisplayVariable(10) : null

    const placeBetForm = contractIsDeployed ? ReturnFunctionForm(7) : null
    const playerBetForm = contractIsDeployed ? ReturnDisplayVariable(8) : null
    const dealCardForm = contractIsDeployed ? ReturnFunctionForm(4) : null
    const dealerCard = contractIsDeployed ? ReturnDisplayVariable(5) : null
    const submitProofForm = contractIsDeployed ? ReturnFunctionForm(13) : null
    const win = contractIsDeployed ? ReturnDisplayVariable(14) : null
    

    const [seed, setSeed] = useState(null);
    const [newSeed, setNewSeed] = useState();
    const [seedCommit, setSeedCommit] = useState();
    // const [cardCommit, setCardCommit] = useState(0);
    const [isValid, setIsValid] = useState(null);
    const [card, setCard] = useState("a secret that is yet to be revealed");
    const [cardCommit, setCardCommit] = useState("...");
    const [hash, setHash] = useState();
    const [threshold, setThreshold] = useState();
    const [a, setA] = useState();
    const [b, setB] = useState();
    const [c, setC] = useState();
    const [input, setInput] = useState();
    const [blockhash, setBlockhash] = useState();

    const [a2, setA2] = useState();
    const [b2, setB2] = useState();
    const [c2, setC2] = useState();
    const [input2, setInput2] = useState();
    const [winvar, setWinvar] = useState();
    const [dealerCardvar, setdealerCard] = useState();
    const [playerCardHashvar, setplayerCardHash] = useState();
    const [playerBet, setplayerBet] = useState(); 

    

    async function getValue(contractFunction, setVariable, triggerRefresh, type){
        const refresh = async () => {
            try {
            const funcResponse = await contractFunction();
            if (type == "card"){
                const sum = bigInt(funcResponse.toString()).add(seed)
                const remainder = sum.mod(13) + 1
                setBlockhash(bigInt(funcResponse.toString()).value);
                setVariable(remainder);
            }
            else if (type) {
                setVariable(funcResponse.toNumber());
            } else{
                setVariable(funcResponse.toString());
            }
            //triggerRefresh(false);
            } catch (e) {
            console.log(e);
            }
        };
        refresh()
    }
        
  
  
    async function CircuitCallDataHash(circuitName, cardCommit, hash, dealerCard) {
  
      const { proof, publicSignals } =
        await window.snarkjs.groth16.fullProve({ "playerCard": cardCommit, "playerCardCommit": hash, "dealerCard":dealerCard },
        `/circuits/${circuitName}_circuit.wasm`,
        `/circuits/${circuitName}_circuit_final.zkey`);
  
      const vKey = await fetch(`/circuits/${circuitName}_verification_key.json`).then(function(res) {
        const js = res.json();
        return js;
      });
  
      const res = await window.snarkjs.groth16.verify(vKey, publicSignals, proof);
      const genCallData = await genSolidityCalldata(publicSignals, proof);
      return [res, genCallData];
    }

    async function CircuitCallDataCard(circuitName, seed, blockhash) {
        console.log(blockhash)
  
        const { proof, publicSignals } =
          await window.snarkjs.groth16.fullProve({ "seed": seed, "blockhash": blockhash.toString()},
          `/circuits/${circuitName}_circuit.wasm`,
          `/circuits/${circuitName}_circuit_final.zkey`);
    
        const vKey = await fetch(`/circuits/${circuitName}_verification_key.json`).then(function(res) {
          const js = res.json();
          return js;
        });
    
        const res = await window.snarkjs.groth16.verify(vKey, publicSignals, proof);
        const genCallData = await genSolidityCalldata(publicSignals, proof);
        return [res, genCallData];
      }
    
  
    const handleIsValid = async () => {
      const [res, genCallData] = await CircuitCallDataHash("hash", card, cardCommit, threshold);
      setIsValid(res.toString());
      setA(genCallData[0]);
      setB(genCallData[1]);
      setC(genCallData[2]);
      setInput(genCallData[3]);
    };

    const handleCard = async () => {
        const [res, genCallData] = await CircuitCallDataCard("card", seed, blockhash);
        setA2(genCallData[0]);
        setB2(genCallData[1]);
        setC2(genCallData[2]);
        setInput2(genCallData[3]);
    }

    return(
        <div>
        <div style={{padding:100}}>
            <span>
                <Input
                    size="large"
                    placeholder={"enter secret seed here!"}
                    value={newSeed}
                    onChange={async e => {
                        // TODO: Import MIMC hash function and set hash to the correct function
                        setNewSeed(e.target.value);
                        if (seed==null){
                            setSeedCommit(mimcHash(newSeed).value.toString());
                        }
                        // setHash("15893827533473716138720882070731822975159228540693753428689375377280130954696")
                    }}
                    suffix={
                        <Tooltip title="commit your secret seed!">
                        <Button
                            onClick={() => {
                                setSeed(newSeed)
                                setSeedCommit(mimcHash(newSeed).value.toString());
                            }}
                            shape="circle"
                            icon={<SendOutlined />}
                        />
                        </Tooltip>
                    }
                />

                <h2>
                    the MiMC hash of your seed is: {seedCommit}
                </h2>
                <br></br>
                {playerSeedCommitForm}
            </span>
            <br></br>
            <span>
                <Button
                    onClick={async()=>{
                        getValue(contract[displayedContractFunctions[9].name], setCard, triggerRefresh, "card");
                    }}
                    size="large">
                    draw random card
                </Button>
                <Button 
                    // TODO Figure out async handling in react and combine this button with the next
                    onClick={async()=>{
                        setCardCommit(mimcHash(card).value)                        
                    }}
                    size="large"
                >
                    prepare zk inputs
                </Button>
                <Button 
                    onClick={async() => {
                        await handleCard();
                    }}
                    size="large"
                >
                    generate zk proof
                </Button>
            </span>
            <span>
                <h2>Your card value is {card}. Good luck!</h2>
                <br></br>
                <h2>Your will commit card hash {cardCommit.toString()}</h2>
                <br></br>
                <p>{a2}</p>
                <h2></h2>
                <p>{b2}</p>
                <h2></h2>
                <p>{c2}</p>
                <h2></h2>
                <p>{input2}</p>
            </span>
                
            <span>
                {playerCardCommitForm}
                <a onClick={async() => {
                        await getValue(contract[displayedContractFunctions[10].name], setplayerCardHash, triggerRefresh, false)
                    }}>
                    🔄
                </a>
                <h2> The contract now knows your hash {playerCardHashvar}</h2>
                <br></br>
                {placeBetForm}
                <a onClick={async() => {
                        await getValue(contract[displayedContractFunctions[8].name], setplayerBet, triggerRefresh, false)
                    }}>
                    🔄
                </a>
                <h2>{playerBet} eth into the bet! </h2>
                <br></br>
                {dealCardForm}
                <a onClick={async() => {
                        await getValue(contract[displayedContractFunctions[5].name], setdealerCard, triggerRefresh, false)
                    }}>
                    🔄
                </a>
                <h2>The dealer draws card {dealerCardvar}</h2>
                <Button 
                    // TODO Figure out async handling in react and combine this button with the next
                    onClick={async()=>{
                        // get dealer card
                        getValue(contract[displayedContractFunctions[5].name], setThreshold, triggerRefresh, true);
                        // get player card hash
                        getValue(contract[displayedContractFunctions[10].name], setHash, triggerRefresh, false);                        
                    }}
                    size="large"
                >
                    prepare zk inputs
                </Button>
                <Button 
                    onClick={async() => {
                        //await getValue(contract[thresholdVariable.name], setThreshold, triggerRefresh, true);
                        await getValue(contract[displayedContractFunctions[10].name], setHash, triggerRefresh, false);
                        await handleIsValid();
                    }}
                    size="large"
                >
                    generate zk proof
                </Button>
                <h2></h2>
                <p>{a}</p>
                <h2></h2>
                <p>{b}</p>
                <h2></h2>
                <p>{c}</p>
                <h2></h2>
                <p>{input}</p>
                {/* Submit proof and display outcome */}
                
                {submitProofForm}
                <a onClick={async() => {
                        await getValue(contract[displayedContractFunctions[14].name], setWinvar, triggerRefresh, false)
                    }}>
                    🔄
                </a>
                <h2>Did I win? {winvar}</h2>
                
                {/*
            
                <Button
                    onClick={async() => {
                        // TODO parse callData information
                        //console.log(callData)
                        //const returned = await tx(contract['submitProof'](callData[0], callData[1], callData[2], callData[3]));
                    }}>
                    Upload zk proof
                </Button>*/}
            </span>
        </div>
      </div>
    )
}