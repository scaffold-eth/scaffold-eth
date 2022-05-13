import React from "react";
import { gql, useQuery } from "@apollo/client";
import { List, Card } from "antd";
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
  const FISHING_GRAPHQL = `
  {
    fishingLogs(first: 50, orderBy: createdAt, orderDirection: desc) {
      id
      week
      day
      round
      shipId
      reward
      owner
    }
  }
  `;
  const FISHING_GQL = gql(FISHING_GRAPHQL);
  const { loading, data } = useQuery(FISHING_GQL, { pollInterval: 10000 });

  return (
    <div style={{ backgroundColor: "#29aae1" }}>
      <div
        id="ranking"
        className="ranking"
        style={{ width: 1280, minHeight: 800, margin: "auto", padding: 25, display: "flex" }}
      >
        <Card
          style={{
            backgroundColor: "#b3e2f4",
            border: "1px solid #0071bb",
            borderRadius: 10,
            margin: "0 auto",
            textAlign: "left",
          }}
        >
          <List
            style={{ margin: "0 auto" }}
            size="large"
            locale={{ emptyText: `waiting for fishing...` }}
            dataSource={data && data.fishingLogs}
            loading={loading}
            renderItem={item => {
              return (
                <List.Item key={item.id} style={{ justifyContent: "center" }}>
                  Week #{item.week} - Day #{(item.day % 7) + 1} - Round #{item.round} - LoogieShip #{item.shipId} -
                  Owner:
                  <Address
                    address={item.owner}
                    ensProvider={mainnetProvider}
                    blockExplorer={blockExplorer}
                    fontSize="16"
                  />
                  - Reward: {item.reward} LOOC
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
