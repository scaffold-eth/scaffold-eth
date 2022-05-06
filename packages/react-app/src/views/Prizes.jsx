import React, { useEffect, useState } from "react";
import { List, Card } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
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
  const withdraws = useEventListener(readContracts, "SailorLoogiesGame", "Withdraw", localProvider, startBlock - 100000);
  console.log("withdraws: ", withdraws);

  const [rewards, setRewards] = useState();
  const [loadingPrizes, setLoadingPrizes] = useState(true);

  useEffect(() => {
    const updateRewards = async () => {
      if (readContracts.SailorLoogiesGameAward && withdraws && withdraws.length > 0) {
        setLoadingPrizes(true);
        const rewardUpdate = [];
        const withdrawsOrdered = withdraws.sort((a, b) => b.args.week.toNumber() - a.args.week.toNumber());
        for (let i = 0; i < withdrawsOrdered.length; i++) {
          try {
            if (DEBUG) console.log("Getting award tokenId: ", withdrawsOrdered[i].args.rewardNftId.toString());
            const tokenURI = await readContracts.SailorLoogiesGameAward.tokenURI(withdrawsOrdered[i].args.rewardNftId);
            if (DEBUG) console.log("tokenURI: ", tokenURI);
            const jsonManifestString = atob(tokenURI.substring(29));

            try {
              const jsonManifest = JSON.parse(jsonManifestString);
              rewardUpdate.push({
                shipId: withdrawsOrdered[i].args.shipId.toNumber(),
                uri: tokenURI,
                winner: withdrawsOrdered[i].args.winner,
                week: withdrawsOrdered[i].args.week.toNumber(),
                rewardNftId: withdrawsOrdered[i].args.rewardNftId.toNumber(),
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
  }, [DEBUG, readContracts.SailorLoogiesGameAward, withdraws]);

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
            loading={loadingPrizes}
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
