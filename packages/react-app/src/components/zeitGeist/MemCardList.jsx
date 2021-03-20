import React, { useState } from "react";
import { Card, Carousel, Divider, Tabs } from "antd";
import {MemCard} from "../zeitGeist"

// function onChange(a, b, c) {
//     console.log(a, b, c);
//   }
  
// const { TabPane } = Tabs;

const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

export default function MemCardList({name}) {
  return (
      <div>
        <list>
          <li> <MemCard /> </li>
          <li> <MemCard /> </li>
        </list>
      </div>
  );
}
