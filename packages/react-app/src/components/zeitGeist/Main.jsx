import React, { useState } from "react";
import { Card, Carousel, Tabs } from "antd";
import MemCardList from "./MemCardList"

function onChange(a, b, c) {
    console.log(a, b, c);
  }
  
const { TabPane } = Tabs;

export default function Main({name}) {
  return (
    <Tabs defaultActiveKey="1" centered>
    <TabPane tab="Your Memories" key="1">
      <MemCardList name="ougaguga" /> 
    </TabPane>
    <TabPane tab="Ready?" key="2">
      Content of Tab Pane 2
    </TabPane>
    <TabPane tab="Live!" key="3">
      Content of Tab Pane 3
    </TabPane>
  </Tabs>
  );
}