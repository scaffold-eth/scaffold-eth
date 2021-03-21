
/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import { Carousel, Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin, Image } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { Main } from "../components/zeitGeist"
import Logo from './logo.png';
import LogoAndLetters from './logo_mit.png';
import LogoPure from './logoOhne.png';

export default function ZeitGeist({address, setNewActivityEvent, setActivityLiveEvent,tx, setActivityCompletedEvent, readContracts, writeContracts, localProvider, userProvider}) {

  let new_activities = setNewActivityEvent.map((x) => {return {a_id: x.a_id.toString(), player: x.player, description: x.description, status: "ready"}})
  let live_activities = setActivityLiveEvent.map((x) => {return {a_id: x.a_id.toString(), player: x.player, witness: x.witness}})
  let completed_activities = setActivityCompletedEvent.map((x) => {return {a_id: x.a_id.toString(), player: x.player, witness: x.witness}})
  let live_ids_only = new_activities.map(x => x.a_id)
  let as = {}
  for (var a of new_activities) {
    console.log('looking at', a)
    if (!(a.a_id in as)) {
      as[a.a_id] = a
    } else {
      as[a.a_id] = {
        ...as[a.a_id],
        description: a.description
      }
    }
  }
  for (var a of live_activities) {
    as[a.a_id] = {
      ...as[a.a_id],
      status : "live",
      witness : a.witness
    }
  }
  for (var a of completed_activities) {
    as[a.a_id] = {
      ...as[a.a_id],
      status : "completed",
    }
  }

  console.log('all', as)

  const activities = {
    ready: Object.values(as).filter(x => x.status == "ready"),
    live: Object.values(as).filter(x => x.status == "live"),
    completed: Object.values(as).filter(x => x.status == "completed"),
  }

  const logoLane = [
    // <div>
    // <div style={{margin:"auto"}}>
    <div style={{padding:16, width:300, margin:"auto",marginTop:64}}>
      <img src={LogoPure} width={300}/>
    </div>
  ]

  let memoryLane = activities.completed.map((a) => 
    <div>
      test {a.description}
    </div>
    )
  memoryLane = logoLane.concat(memoryLane)


  return (
      // use this divider to draw a box around everything
    <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto",marginTop:64}}>
    <div>
      {/* <img src={LogoAndLetters} width={200}/> */}
        <h2>ZeitGeist</h2>
        {/* <Carousel autoplay> */}
          {/* {memoryLane} */}
        {/* </Carousel> */}


        <img src={LogoPure} width={200}/>
        <h4>Mint memories with friends!</h4>
        {/* <Divider/> */}
        <Main 
        address={address}
        as={activities} 
        userProvider={userProvider}
        tx={tx}
        localProvider={localProvider}
        writeContracts={writeContracts}
        readContracts={readContracts}
        />
        {/* <Divider/> */}
      </div>
    </div>
  );
}

// TODO
// - add nft
// - mint nft with hash
// - adjust metadata to match nft standard
// - display memoryLane component
// - pull all memories from 
// - deploy to a testnet (ideally)