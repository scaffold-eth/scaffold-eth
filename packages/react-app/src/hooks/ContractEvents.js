import React, { useMemo, useState } from "react";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { Card, List } from "antd";

export default function useContractEvents(contract, show) {
    const displayedContractEvents = useMemo(() => {
        const eventsList = contract
          ? Object.entries(contract.interface.events).filter(
              fn => fn[1]["type"] === "event" && !(show && show.indexOf(fn[1]["name"]) < 0),
            )
          : [];
        return eventsList;
    }, [contract, show]);

    console.log("===> useContractEvents ---> displayedContractEvents: ", displayedContractEvents);

        return (
          <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
            <h2>Events:</h2>
            <List
              bordered
              dataSource={displayedContractEvents}
              renderItem={item => {
                return (
                  <List.Item key={item[0]}>
                    {item[0]}
                    <List 
                        dataSource={item[1].inputs}
                        renderItem = {paramItem => {
                            return (
                                <List.Item key={paramItem.name}>
                                    {paramItem.name}
                                </List.Item>
                            );
                        }}>
                    </List>
                  </List.Item>
                );
              }}
            />
          </div>
        );
}