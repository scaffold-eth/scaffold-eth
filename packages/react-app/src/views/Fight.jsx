/* eslint-disable jsx-a11y/accessible-emoji */

import { formatEther } from "@ethersproject/units";
import { Select,Button } from "antd";
import React, { useState, useEffect } from "react";
import { Address, AddressInput } from "../components";
import { usePoller } from "../hooks";
import { useHistory, useParams } from 'react-router-dom'
import { ethers } from "ethers"

export default function Hints({ blockExplorer,tx, yourLocalBalance, writeContracts, localProvider, mainnetProvider, price, address, readContracts }) {

  const { fightid } = useParams()


  const [fightInfo, setFightInfo] = useState();
  const [fightScript, setFightScript] = useState();
  const [currentFightStep, setCurrentFightStep] = useState();
  const [owners, setOwners] = useState();
  const [ids, setIds] = useState();

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  console.log("windowDimensions",windowDimensions)

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(()=>{
    console.log("UPDATING THE FIGHT STEP!?!?!")
    if(setFightScript.length>0 && !currentFightStep){
      console.log("RESETTING FIGHT SCRIPT")
      setCurrentFightStep(1)
    }
  },[fightScript])

  usePoller(()=>{
    if(readContracts && readContracts.YourCollectible){
      //console.log
      if(currentFightStep && fightScript && fightScript.length){
        let nextStep = currentFightStep+1
        if(nextStep>=fightScript.length){
          console.log("DONE!!!")
          setCurrentFightStep(fightScript.length)
        }else{
          console.log("INCREMENTING FIGHT STEP TO",nextStep)
          setCurrentFightStep(nextStep)
        }
      }
    }
  }, 2000)

  const checkFight = async ()=>{
    console.log("CHECKING IN ON FIGHT....",fightid)

    const fightInfo = await readContracts.YourCollectible.fights(fightid)

    console.log("fightInfo",fightInfo)

    /*const dodoInfo = await readContracts.YourCollectible.dodos(tokenId)
    console.log("DODOINFO",dodoInfo)
    console.log("tokenId", tokenId);
    const tokenURI = await readContracts.YourCollectible.tokenURI(tokenId);
    const jsonManifestString = atob(tokenURI.substring(29))
    console.log("jsonManifestString", jsonManifestString);

    try {
      const jsonManifest = JSON.parse(jsonManifestString);
      console.log("jsonManifest", jsonManifest);
      collectibleUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest, ...dodoInfo });
    } catch (e) {
      console.log(e);
    }*/

    const targetBlock = fightInfo.block.toNumber()

    console.log("targetBlock",targetBlock)

    const currentBlock = await localProvider.getBlockNumber()

    console.log("currentBlock",currentBlock)

    let blockInfo = {}

    let newFightScript = []

    if(currentBlock>=targetBlock){
      console.log("loading block info!")
      blockInfo = await localProvider.getBlock(targetBlock)
      console.log("block info:",blockInfo)

      const owner1 = await readContracts.YourCollectible.ownerOf(fightInfo.id1)
      const owner2 = await readContracts.YourCollectible.ownerOf(fightInfo.id2)
      console.log("owner1:",owner1)
      console.log("owner2:",owner2)

      setOwners([owner1,owner2])
      setIds([fightInfo&&fightInfo.id1.toNumber(),fightInfo&&fightInfo.id2.toNumber()])



      let blockHash = blockInfo.hash

      let index = 2
      console.log("blockHash",blockHash)

      let coinflipHex = "0x"+blockHash[index++]+""+blockHash[index++]

      let coinflip = ethers.BigNumber.from( coinflipHex )
      console.log("coinflip",coinflip,coinflip.toNumber())

      let whosTurn = false

      if(coinflip.toNumber()>=128){
        whosTurn = true
      }

      let health1 = 100;
      let health2 = 100;
      let divider = 10;

      newFightScript.push({
        whosTurn: false,
        damage: 0,
        health1: health1,
        health2: health2
      })

      while(health1>0&&health2>0){

        if(index>=32){
          console.log("hashing",blockHash);
          blockHash = ethers.utils.keccak256(blockHash);
          console.log("new hash",blockHash);
          index=2;
        }

        let thisDamageHex = "0x"+blockHash[index++]+""+blockHash[index++]

        console.log("thisDamageHex",thisDamageHex)

        let thisDamage = ethers.BigNumber.from( thisDamageHex )

        console.log("thisDamage",thisDamage,thisDamage.toNumber())

        let damageInt = parseInt(thisDamage/divider)

        console.log("divided damage",damageInt)

        if(whosTurn){
          console.log("damaging bird 1",damageInt);
          if(health1<damageInt) {
            health1=0;
          }else{
            health1-=damageInt;
          }
          newFightScript.push({
            whosTurn: whosTurn,
            damage: damageInt,
            health1: health1,
            health2: health2
          })
        }else{
          console.log("damaging bird 2",damageInt);
          if(health2<damageInt) {
            health2=0;
          }else{
            health2-=damageInt;
          }
          newFightScript.push({
            whosTurn: whosTurn,
            damage: damageInt,
            health1: health1,
            health2: health2
          })
        }

        whosTurn=!whosTurn;
      }

    }

    setFightScript(newFightScript)
    targetBlock && currentBlock && fightInfo && blockInfo && setFightInfo({targetBlock, currentBlock, ...fightInfo,block: blockInfo})
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
    mode = ""
  }

  console.log("RENDER fightScript",fightScript)

  let processButton = ""

  let thisDisplay = fightScript && fightScript[currentFightStep]

  let leftClass;
  let rightClass;
  let leftZ;
  let rightZ;

  let leftHealth=""
  let rightHealth=""

  let leftDamage=""
  let rightDamage=""

  let leftDamageClass = ""
  let rightDamageClass = ""

  if(thisDisplay){
    console.log("thisDisplay",thisDisplay)
    leftHealth=thisDisplay.health1
    rightHealth=thisDisplay.health2
    if(thisDisplay.whosTurn){
      leftClass="dodo hit"
      rightClass="dodo kick"
      leftDamage=thisDisplay.damage
      leftDamageClass="damage"
      leftZ=1
      rightZ=2
    }else{
      rightClass="dodo hit"
      leftClass="dodo kick"
      rightDamage=thisDisplay.damage
      rightDamageClass="damage"
      leftZ=2
      rightZ=1
    }
  }else{
    let lastDisplay = fightScript && fightScript[currentFightStep-1]
    console.log("LAST FightStep",currentFightStep,"fightScript.length",fightScript.length)
    if(currentFightStep>=fightScript.length){
      if(lastDisplay){
        if(lastDisplay.whosTurn){
          leftClass="dodo defeat"
          rightClass="dodo victory"
        }else{
          rightClass="dodo defeat"
          leftClass="dodo victory"
        }
      }
    }
  }

  if(fightInfo.targetBlock<=fightInfo.currentBlock && currentFightStep>=fightScript.length){
    processButton = (
      <Button
        onClick={async () => {
          console.log("writeContracts", writeContracts);
          await tx(writeContracts.YourCollectible.process(fightid));
          setTimeout(()=>{
            window.location = "/";
          },250)

        }}
      >
        💾 Save
      </Button>
    )
  }



  const cls1 = { strokeMiterlimit: 10, stroke: "#0d0d0d" }
  const cls2 = { strokeMiterlimit: 10, fill: "#685c48" , stroke: "#231f20" }
  const cls3 = { strokeMiterlimit: 10, fill: "#e5d67f", stroke: "#231f20" }
  const cls4 = { strokeMiterlimit: 10, fill: "#fee78a", stroke:"#231f20" }
  const cls5 = { strokeMiterlimit: 10, fill: "#fff", stroke: "#0d0d0d" }

  const dodo1SVG = (<svg style={{zIndex:leftZ, position:'absolute',left:windowDimensions.width/2-390, overflow:"visible"}} xmlns="http://www.w3.org/2000/svg" width={550} height={650} id="dodo1" class={leftClass}>//"dodo kick"
    <g class="container">
    <g id="rightleg">
      <path style={cls3}
        d="M82.09,441.46v87.92l-42.75-7.99s-9.92,13.32,0,15.99,42.75,8.88,42.75,8.88l-42.75,35.52s-4.85,18.65,4.45,13.32c9.3-5.33,45.41-39.08,45.41-39.08l33.37,40.03s13.68,12.36,8.75-9.84-36.66-54.17-36.66-54.17l-1.64-121.67s-9.85-21.31-12.04-1.78,1.09,32.86,1.09,32.86Z" />
      <path style={cls2} d="M72.44,341.87s-21.69,82.63,11.23,109.82c0,0,24.31,30.59,59.12-78.37l-70.35-31.45Z" />
    </g>
    <g id="tailfeathers">
      <path style={cls2}
        d="M227.55,230.56s52.14-55.13,77.62-24.25c0,0-25.37-2.23-44.02,17.76,0,0,32.43-22.99,44.02-10.34,0,0-42.1,18.06-38.81,27.33,0,0,41.9-25.48,44.22-7.72,0,0-38.24,4.75-41.51,17.05,0,0,33.02-14.61,33.79,0,0,0-31.09,2.17-33.79,16.16s-16.4,10.81-16.4,10.81l-25.11-46.8h0" />
    </g>
    <g id="body">
      <path style={cls2} id="neck"
        d="M108.57,14.34s45.49-35.34,58.26,32.01c0,0-11.38,47.29-30.11,62.91,0,0-39.84,76.17-7.22,104.21,0,0,9.09,67.43-36.54,50.95,0,0-47.73-60.81,5.48-156.49L108.57,14.34Z" />
      <path style={cls2}
        d="M87.47,227.59s142.35-84.51,191.59,76.88c0,0,3.36,113.8-178.87,108.88,0,0-82.38-53.83-45.86-134.97,0,0,17.73-51.63,33.15-50.79Z" />
    </g>
    <g id="leftleg">
      <path style={cls3}
        d="M171.07,473.44v87.92l-42.75-7.99s-9.92,13.32,0,15.99,42.75,8.88,42.75,8.88l-42.75,35.52s-4.85,18.65,4.45,13.32c9.3-5.33,45.41-39.08,45.41-39.08l33.37,40.03s13.68,12.36,8.75-9.84-36.66-54.17-36.66-54.17l-1.64-121.67s-9.85-21.31-12.04-1.78,1.09,32.86,1.09,32.86Z" />
      <path style={cls2} d="M128.32,386.05s6.67,88.07,44.37,89.68c0,0,31.14,10.5,27.85-109.88l-72.22,20.2Z" />
    </g>
    <g id="righteye">
      <g>
        <circle style={cls5} cx="103.12" cy="21.31" r="20.81" />
        <circle style={cls1} cx="98.71" cy="22.1" r="1.49" />
      </g>
    </g>
    <g id="bottomjaw">
      <path style={cls4}
        d="M114.48,103.35s-69.13-.24-84.89-12.11c0,0-.88-6.71,8.7-6.6l54.93-14.06s36.52,20.16,22.34,29.64" />
    </g>
    <g id="beak">
      <circle style={cls4} cx="122.85" cy="59.64" r="35.42" />
      <path style={cls4}
        d="M96.69,35.76s-41.32,22.87-58.78,20.93c0,0-23.8-25.52-34.77-.81,0,0-6.67,20.44,1.18,29.55l4.79,.7s22.88-6.44,35.21-4.63c0,0,40.46-.57,45.1-10.11" />
    </g>
    <g id="lefteye">
      <g>
        <circle style={cls5} cx="123.67" cy="34.36" r="20.81" />
        <circle style={cls1} cx="119.26" cy="35.15" r="1.49" />
      </g>
    </g>
  </g>
  </svg>)

  const dodo2SVG = (
    <svg style={{zIndex:rightZ,position:"absolute",left:windowDimensions.width/2,overflow:"visible"}} xmlns="http://www.w3.org/2000/svg" width={550} height={650} id="dodo2" class={rightClass}>
    <g class="container">
    <g id="rightleg">
      <path style={cls3}
        d="M82.09,441.46v87.92l-42.75-7.99s-9.92,13.32,0,15.99,42.75,8.88,42.75,8.88l-42.75,35.52s-4.85,18.65,4.45,13.32c9.3-5.33,45.41-39.08,45.41-39.08l33.37,40.03s13.68,12.36,8.75-9.84-36.66-54.17-36.66-54.17l-1.64-121.67s-9.85-21.31-12.04-1.78,1.09,32.86,1.09,32.86Z" />
      <path style={cls2} d="M72.44,341.87s-21.69,82.63,11.23,109.82c0,0,24.31,30.59,59.12-78.37l-70.35-31.45Z" />
    </g>
    <g id="tailfeathers">
      <path style={cls2}
        d="M227.55,230.56s52.14-55.13,77.62-24.25c0,0-25.37-2.23-44.02,17.76,0,0,32.43-22.99,44.02-10.34,0,0-42.1,18.06-38.81,27.33,0,0,41.9-25.48,44.22-7.72,0,0-38.24,4.75-41.51,17.05,0,0,33.02-14.61,33.79,0,0,0-31.09,2.17-33.79,16.16s-16.4,10.81-16.4,10.81l-25.11-46.8h0" />
    </g>
    <g id="body">
      <path style={cls2} id="neck"
        d="M108.57,14.34s45.49-35.34,58.26,32.01c0,0-11.38,47.29-30.11,62.91,0,0-39.84,76.17-7.22,104.21,0,0,9.09,67.43-36.54,50.95,0,0-47.73-60.81,5.48-156.49L108.57,14.34Z" />
      <path style={cls2}
        d="M87.47,227.59s142.35-84.51,191.59,76.88c0,0,3.36,113.8-178.87,108.88,0,0-82.38-53.83-45.86-134.97,0,0,17.73-51.63,33.15-50.79Z" />
    </g>
    <g id="leftleg">
      <path style={cls3}
        d="M171.07,473.44v87.92l-42.75-7.99s-9.92,13.32,0,15.99,42.75,8.88,42.75,8.88l-42.75,35.52s-4.85,18.65,4.45,13.32c9.3-5.33,45.41-39.08,45.41-39.08l33.37,40.03s13.68,12.36,8.75-9.84-36.66-54.17-36.66-54.17l-1.64-121.67s-9.85-21.31-12.04-1.78,1.09,32.86,1.09,32.86Z" />
      <path style={cls2} d="M128.32,386.05s6.67,88.07,44.37,89.68c0,0,31.14,10.5,27.85-109.88l-72.22,20.2Z" />
    </g>
    <g id="righteye">
      <g>
        <circle style={cls5} cx="103.12" cy="21.31" r="20.81" />
        <circle style={cls1} cx="98.71" cy="22.1" r="1.49" />
      </g>
    </g>
    <g id="bottomjaw">
      <path style={cls4}
        d="M114.48,103.35s-69.13-.24-84.89-12.11c0,0-.88-6.71,8.7-6.6l54.93-14.06s36.52,20.16,22.34,29.64" />
    </g>
    <g id="beak">
      <circle style={cls4} cx="122.85" cy="59.64" r="35.42" />
      <path style={cls4}
        d="M96.69,35.76s-41.32,22.87-58.78,20.93c0,0-23.8-25.52-34.77-.81,0,0-6.67,20.44,1.18,29.55l4.79,.7s22.88-6.44,35.21-4.63c0,0,40.46-.57,45.1-10.11" />
    </g>
    <g id="lefteye">
      <g>
        <circle style={cls5} cx="123.67" cy="34.36" r="20.81" />
        <circle style={cls1} cx="119.26" cy="35.15" r="1.49" />
      </g>
    </g>
  </g>
  </svg>
  )

  return (
    <div>
      {/*view a fightT {fightid}!!

      <div> flight step: {currentFightStep} </div>

      <div><pre>{JSON.stringify(thisDisplay)}</pre></div>*/}

      <div style={{padding:32}}><b>{mode}</b></div>

      <div style={{fontSize:48,float:"left",marginLeft:"10%"}}>
        <div class={leftDamageClass} style={{fontSize:24}}>{leftDamage}</div>
        {leftHealth}
        <div>
          <div style={{opacity:0.5}}>#{ids && ids[0]}</div>
          <Address address={owners[0]} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={24}/>
        </div>
      </div>
      <div style={{fontSize:48,float:"right",marginRight:"10%"}}>
        <div class={rightDamageClass} style={{fontSize:24}}>{rightDamage}</div>
        {rightHealth}
        <div>
          <div style={{opacity:0.5}}>#{ids && ids[1]}</div>
          <Address address={owners[1]} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={22}/>
        </div>
      </div>


      <div>
        <div>{processButton}</div>
        {dodo1SVG}
        {dodo2SVG}
        {/*<img id="dodo1" class="dodo kick" src={DodoKick} width={550} height={650}/>
        <img id="dodo2" class="dodo hit" src={DodoKick2} width={550} height={650}/>
    */}
    </div>

    </div>
  );
}
