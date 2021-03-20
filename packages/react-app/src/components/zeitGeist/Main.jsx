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
  const [activeTab, setActiveTab] = useState("1")
  return (
    <div>
    {/* <Tabs defaultActiveKey="1" centered activeKey={activeTab}> */}
    <Tabs 
    centered activeKey={activeTab}
    onChange={(activeKey)=>setActiveTab(activeKey)}
    >
    <TabPane tab="New" key="2">
      <StartMemory 
        userProvider={userProvider}
        localProvider={localProvider}
        writeContracts={writeContracts}
        tx={tx}
        readContracts={readContracts}
        afterCreated={() => setActiveTab("1")}
      />
    </TabPane>
    <TabPane tab="Ready" key="1">
      <MemCardList 
      as={as.ready} address={address}
      writeContracts={writeContracts}
      tx={tx}
      userProvider={userProvider}
      localProvider={localProvider}
      afterWitnessed={() => setActiveTab("3")}
    /> 
    </TabPane>
    <TabPane tab="Live" key="3">
      <MemCardList 
      as={as.live} address={address} 
      writeContracts={writeContracts}
      tx={tx}
      userProvider={userProvider}
      localProvider={localProvider}
      afterMinted={() => setActiveTab("2")}
      /> 
    </TabPane>
  </Tabs>
  </div>
  );
}