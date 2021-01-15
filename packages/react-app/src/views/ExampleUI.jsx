/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import { Button, List, Divider, Input, Card, DatePicker, Slider, Switch, Progress, Spin } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { Address, Balance } from "../components";
import { parseEther, formatEther } from "@ethersproject/units";

export default function ExampleUI({buyGridEvents, address, mainnetProvider, userProvider, localProvider, yourLocalBalance, price, tx, readContracts, writeContracts }) {

  return (
    <div>
        <div style={{ width:600, margin: "auto", marginTop:32, paddingBottom:32 }}>
          <h2>Grid Events:</h2>
          Owner | X | Y | Color | Amount
          <List
            bordered
            dataSource={buyGridEvents}
            renderItem={(item) => {
              console.log('item', item)
              return (
                <List.Item key={item.id}>
                  <Address
                      value={item.owner}
                      ensProvider={mainnetProvider}
                      fontSize={16}
                    />
                    {item.x.toNumber()} | {item.y.toNumber()} | {item.color} | {formatEther(item.amount)}
                  
                </List.Item>
              )
            }}
          />
        </div>
    </div>
  );
}
