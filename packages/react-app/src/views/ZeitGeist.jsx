
/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { Main } from "../components/zeitGeist"
// import {  useContractReader, useEventListener, useExternalContractLoader } from "../hooks"

export default function ZeitGeist({address, setNewActivityEvent, setActivityLiveEvent, setActivityCompletedEvent}) {

  let new_activities = setNewActivityEvent.map((x) => {return {a_id: x.a_id.toString(), player: x.player, description: x.description, status: "ready"}})
  let live_activities = setActivityLiveEvent.map((x) => {return {a_id: x.a_id.toString(), player: x.player, witness: x.witness}})
  let live_ids_only = new_activities.map(x => x.a_id)
  let as = {}
  for (var a of new_activities) {
    console.log('looking at', a)
    if (!(a.a_id in as)) {
      as[a.a_id] = a
    }
  }
  for (var a of live_activities) {
    as[a.a_id] = {
      ...as[a.a_id],
      status : "live",
    witness : a.witness
    }
  }
  console.log('all', as)

  const activities = {
    ready: Object.values(as).filter(x => x.status == "ready"),
    live: Object.values(as).filter(x => x.status == "live"),
  }

  return (
      // use this divider to draw a box around everything
    <div style={{border:"1px solid #cccccc", padding:16, width:400, margin:"auto",marginTop:64}}>
    <div>
        <h2>ZeitGeist</h2>
        <h4>Mint memories with friends!</h4>
        {/* <Divider/> */}
        <Main as={activities} />
        {/* <Divider/> */}
      </div>
    </div>

  );
}
