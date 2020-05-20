import React, { useEffect, useState } from 'react'
import { ethers } from "ethers";
import { useTimestamp } from "./hooks"
import { Card } from 'antd';

export default function TimeReport(props) {

  const [votes, setVotes] = useState([])
  const [results, setResults] = useState([])

  useEffect(()=>{
    try{
      let loadedVotes = require("./validVotes.json")
      setVotes(loadedVotes)
      let newResults = {}
      for(let v in loadedVotes){
        if(newResults[loadedVotes[v].vote]){
          newResults[loadedVotes[v].vote] = newResults[loadedVotes[v].vote].add(loadedVotes[v].balance)
        }else{
          newResults[loadedVotes[v].vote] = ethers.utils.bigNumberify(loadedVotes[v].balance)
        }
      }
      setResults(newResults)
    }catch(e){console.log("ERR",e)}
  },[])

  let displayVotes = []
  let winner
  for(let r in results){
    let floatValue = parseFloat(ethers.utils.formatEther(results[r]))
    if( typeof winner == "undefined" || winner.floatValue < floatValue){
      winner = {
        vote:r,
        floatValue:floatValue,
      }
    }
    displayVotes.push(
      <div key={"vote"+r}>
        {r} {floatValue.toFixed(4)}
      </div>
    )
  }

  return (
    <div>
      <Card
        title={(
          <div>
            📑  Votes: ( {winner?winner.vote+" is winning":""} )
          </div>
        )}
        size="large"
        style={{ width: 550, marginTop: 25 }}
        >
          {displayVotes}
      </Card>
    </div>
  );

}
