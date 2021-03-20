import React, { useState } from "react";
import { Card, Carousel, Divider, Tabs } from "antd";
import MemCardList from "./MemCardList"
import StartMemory from "./StartMemory"

function onChange(a, b, c) {
    console.log(a, b, c);
  }
const { TabPane } = Tabs;

export default function Main({
  address, as, readContracts, writeContracts, localProvider, userProvider, tx
}) {
  return (
    <div>
    <Tabs defaultActiveKey="1" centered>
    <TabPane tab="Ready" key="1">
      <MemCardList 
      as={as.ready} address={address}
      writeContracts={writeContracts}
      tx={tx}
    /> 
    </TabPane>
    <TabPane tab="Create" key="2">
      <StartMemory 
        userProvider={userProvider}
        localProvider={localProvider}
        writeContracts={writeContracts}
        tx={tx}
        readContracts={readContracts}
      />
    </TabPane>
    <TabPane tab="Live" key="3">
      <MemCardList as={as.live} address={address} /> 
    </TabPane>
  </Tabs>
  </div>
  );
}