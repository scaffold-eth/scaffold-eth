import React, { useState } from "react";
import { Card, Carousel, Tabs } from "antd";
import MemCardList from "./MemCardList"
import StartMemory from "./StartMemory"

function onChange(a, b, c) {
    console.log(a, b, c);
  }
const { TabPane } = Tabs;

export default function Main({name}) {
  return (
    <Tabs defaultActiveKey="1" centered>
    <TabPane tab="Ready" key="1">
      <MemCardList name="ougaguga" /> 
    </TabPane>
    <TabPane tab="Create" key="2">
      <StartMemory />
    </TabPane>
    <TabPane tab="Live" key="3">
      <MemCardList name="ougaguga" /> 
    </TabPane>
  </Tabs>
  );
}

// TODO
// beispiehlaufgabe 1, alle zusammen
// hier gibts alle components:
// https://ant.design/components/

// cheat sheet:
// ctrl + / -> kommentiert etwas aus