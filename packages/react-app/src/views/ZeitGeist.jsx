
/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";
import { Main } from "../components/zeitGeist"

export default function ZeitGeist({address, setNewActivityEvent}) {

  let new_activities = setNewActivityEvent.map((x) => {return {a_id: x.a_id, player: x.player, desc: x.description}})
  let activities = {
    ready: new_activities
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
