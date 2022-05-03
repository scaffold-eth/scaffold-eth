import React, { useEffect, useState } from "react";
import { List, Table, Button, Modal, Card } from "antd";
import { useDebounce } from "../hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { ethers } from "ethers";
import { Address } from "../components";

function Fishing({
  DEBUG,
  writeContracts,
  readContracts,
  tx,
  mainnetProvider,
  blockExplorer,
  localProvider,
  startBlock,
  currentWeek,
  currentDay,
  currentWeekDay,
}) {
  const rawFishing = useEventListener(readContracts, "SailorLoogiesGame", "Fishing", localProvider, startBlock - 9000);
  console.log("rawFishing: ", rawFishing);
  //const fishing = useDebounce(rawFishing, 1000);

  return (
    <div style={{ backgroundColor: "#29aae1" }}>
      <div id="ranking" class="ranking" style={{ width: 1280, minHeight: 800, margin: "auto", padding: 25, display: "flex" }}>
        <Card
          style={{ backgroundColor: "#b3e2f4", border: "1px solid #0071bb", borderRadius: 10, margin: "0 auto", textAlign: "left" }}
        >
          <List
            style={{ margin: "0 auto" }}
            size="large"
            locale={{ emptyText: `waiting for fishing...` }}
            dataSource={rawFishing.sort((a, b) => b.blockNumber - a.blockNumber)}
            renderItem={item => {
              return (
                <List.Item key={item.blockNumber + "_" + item.args.id} style={{ justifyContent: "center" }}>
                  Week #{item.args.week.toString()} - Day #{item.args.day.toNumber() % 7 + 1} - Round #{item.args.round} - LoogieShip #{item.args.id.toString()} - Owner: <Address address={item.args.owner} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize="16" /> - Reward: {item.args.reward.toString()} LOOC
                </List.Item>
              );
            }}
          />
        </Card>
      </div>
    </div>
  );
}

export default Fishing;
