import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { List, Card } from "antd";
import { Address } from "../components";

function Prizes({
  DEBUG,
  readContracts,
  mainnetProvider,
  blockExplorer,
  localProvider,
  startBlock,
  currentWeek,
  currentDay,
  currentWeekDay,
}) {
  const PRIZES_GRAPHQL = `
  {
    prizes(first: 30, orderBy: week, orderDirection: desc) {
      id
      week
      shipId
      rewardNftId
      winner
    }
  }
  `;
  const PRIZES_GQL = gql(PRIZES_GRAPHQL);
  const { loading, data } = useQuery(PRIZES_GQL, { pollInterval: 10000 });

  const [rewards, setRewards] = useState();
  const [loadingPrizes, setLoadingPrizes] = useState(true);

  useEffect(() => {
    const updateRewards = async () => {
      if (readContracts.SailorLoogiesGameAward && data && data.prizes.length > 0) {
        setLoadingPrizes(true);
        const rewardUpdate = [];
        for (let i = 0; i < data.prizes.length; i++) {
          try {
            if (DEBUG) console.log("Getting award tokenId: ", data.prizes[i].rewardNftId.toString());
            const tokenURI = await readContracts.SailorLoogiesGameAward.tokenURI(data.prizes[i].rewardNftId);
            if (DEBUG) console.log("tokenURI: ", tokenURI);
            const jsonManifestString = atob(tokenURI.substring(29));

            try {
              const jsonManifest = JSON.parse(jsonManifestString);
              rewardUpdate.push({
                shipId: data.prizes[i].shipId,
                uri: tokenURI,
                winner: data.prizes[i].winner,
                week: data.prizes[i].week,
                rewardNftId: data.prizes[i].rewardNftId,
                ...jsonManifest,
              });
            } catch (e) {
              console.log(e);
            }
          } catch (e) {
            console.log(e);
          }
        }
        setLoadingPrizes(false);
        setRewards(rewardUpdate);
      }
    };
    updateRewards();
  }, [DEBUG, readContracts.SailorLoogiesGameAward, data]);

  return (
    <div style={{ backgroundColor: "#29aae1" }}>
      <div id="ranking" class="ranking" style={{ width: 1280, margin: "auto", padding: 25, minHeight: 800 }}>
        <div>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 3,
              xxl: 3,
            }}
            loading={loading || loadingPrizes}
            dataSource={rewards}
            renderItem={item => {
              return (
                <List.Item key={item.week}>
                  <Card
                    style={{ backgroundColor: "#b3e2f4", border: "1px solid #0071bb", borderRadius: 10 }}
                    title={
                      <div>
                        <span style={{ fontSize: 18, marginRight: 8, fontWeight: "bold" }}>Week {item.week} - Winner: LoogieShip #{item.shipId}</span>
                      </div>
                    }
                  >
                    <img src={item.image} alt={"Reward Week #" + item.week} height="215" />
                    <div>
                      <Address
                        address={item.winner}
                        ensProvider={mainnetProvider}
                        blockExplorer={blockExplorer}
                        fontSize={16}
                      />
                    </div>
                  </Card>
                </List.Item>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Prizes;
