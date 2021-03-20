import React, { useState } from "react";
import { List, Card, Carousel, Divider, Tabs } from "antd";
import {MemCard} from "../zeitGeist"

// function onChange(a, b, c) {
//     console.log(a, b, c);
//   }
  
// const { TabPane } = Tabs;

// const contentStyle = {
//     height: '160px',
//     color: '#fff',
//     lineHeight: '160px',
//     textAlign: 'center',
//     background: '#364d79',
//   };

export default function MemCardList({address, as}) {
  return (
    <div>
        <List
          // bordered
          dataSource={as}
          itemLayout="vertical"
          renderItem={(item) => {
            return (
              <div>
              <List.Item key={item.desc+"_"} >
                <MemCard isWitness={item.player === address} name={item.desc}/>
              </List.Item>
              </div>
            )
        }}
        />
        {/* <p>this is just a dummy to have a witness-activity</p> */}
        <div>
        <MemCard isWitness={true} name={"Sample"}/>
      </div>
      </div>
      );
}
