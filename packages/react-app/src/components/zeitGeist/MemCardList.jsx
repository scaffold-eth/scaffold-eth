import React, { useState } from "react";
import { Card, Carousel, Tabs } from "antd";

// function onChange(a, b, c) {
//     console.log(a, b, c);
//   }
  
// const { TabPane } = Tabs;

export default function MemCardList({name}) {
  return (
      <div>
        <list>
          <li><Card> MemCard 1</Card></li>
          <li><Card> MemCard 2</Card></li>
        </list>
      </div>
  );
}
 