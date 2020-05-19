import React from 'react'
import { ethers, Wallet } from "ethers";
import { Card, Button } from 'antd';
const axios = require('axios');

export default function SmartContractWallet(props) {

  const voteButton = (emoji,emojiName)=>{
    return (
      <Button onClick={()=>{
        castVote(emoji,emojiName)
      }}>{emoji}</Button>
    )
  }

  const castVote = async (emoji,emojiName)=>{
    let timestamp = Date.now()
    console.log("timestamp",timestamp)
    console.log("props.injectedProvider",props.injectedProvider)
    let signer = props.injectedProvider.getSigner()
    //let hex = ethers.utils.hexlify("emojivote"+emoji+timestamp)
    //console.log("hex",hex)
    //web3.utils.stringToHex(string)
    //let hash = ethers.utils.keccak256()
    //console.log("hash",hash)
    let result = await signer.signMessage("emojivote"+emojiName+timestamp)
    console.log("result",result)
    axios.get('https://hooks.zapier.com/hooks/catch/7580698/oiml1yj?address='+props.address+'&vote='+emoji+'&timestamp='+timestamp+'&signature='+result)
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
      console.log("finally")
    });
  }

  return (
    <div>
      <Card
        title={(
          <div>
            Pick Your Favorite Emoji:
          </div>
        )}
        size="large"
        style={{ width: 550, marginTop: 25 }}
        >
          {voteButton("🐮","COW")}
          {voteButton("🦁","LION")}
          {voteButton("🐭","MOUSE")}
          {voteButton("🦊","FOX")}
          {voteButton("🐶","DOG")}
          {voteButton("🐰","RABBIT")}
          {voteButton("🐸","FROG")}
      </Card>
    </div>
  );

}
