/* eslint-disable jsx-a11y/accessible-emoji */

import { formatEther } from "@ethersproject/units";
import { Select } from "antd";
import React, { useState, useEffect } from "react";
import { Address, AddressInput } from "../components";
import { usePoller } from "../hooks";
import { useHistory, useParams } from 'react-router-dom'
import { ethers } from "ethers"

export default function Hints({ yourLocalBalance, localProvider, mainnetProvider, price, address, readContracts }) {

  const { fightid } = useParams()


  const [fightInfo, setFightInfo] = useState();

  const checkFight = async ()=>{
    console.log("CHECKING IN ON FIGHT....",fightid)

    const fightInfo = await readContracts.YourCollectible.fights(fightid)

    console.log("fightInfo",fightInfo)

    const targetBlock = fightInfo.block.toNumber()

    console.log("targetBlock",targetBlock)

    const currentBlock = await localProvider.getBlockNumber()

    console.log("currentBlock",currentBlock)

    let blockInfo = {}
    if(currentBlock>=targetBlock){
      console.log("loading block info!")
      blockInfo = await localProvider.getBlock(targetBlock)
      console.log("block info:",blockInfo)

      let blockHash = blockInfo.hash

      let index = 2
      console.log("blockHash",blockHash)

      let coinflipHex = "0x"+blockHash[index++]+""+blockHash[index++]


      let coinflip = ethers.BigNumber.from( coinflipHex )
      console.log("coinflip",coinflip,coinflip.toNumber())

      let fightParts = []
    }

    setFightInfo({targetBlock, currentBlock, ...fightInfo,block: blockInfo})
  }

  usePoller(()=>{
    if(readContracts && readContracts.YourCollectible) checkFight()
  }, 5000)
  useEffect(()=>{
    if(readContracts && readContracts.YourCollectible) checkFight()
  },[readContracts])

  if(!fightInfo){
    return (
      <div>
        loading.....
      </div>
    );
  }

  let mode = "loading..."

  console.log("RENDER fightInfo",fightInfo)

  if(fightInfo.targetBlock>fightInfo.currentBlock){
    mode = "waiting for block "+fightInfo.targetBlock+" to get mined...";
  }else{
    mode = "fight!!"
  }



  return (
    <div>
      view a fightT {fightid}!!

      <div><b>{mode}</b></div>

    </div>
  );
}
