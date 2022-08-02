import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { List, Table, Button, Modal, Card } from "antd";
import { ethers } from "ethers";
import { Address } from "../components";

function Ranking({
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
  address,
}) {
  const last3weeks = [currentWeek, currentWeek - 1, currentWeek - 2];

  const RANKING_GRAPHQL = `
    query($weeks: [BigInt]) {
      rankings(
        orderBy: reward,
        orderDirection: desc,
        where: {
          week_in: $weeks
        }) {
            id
            week
            shipId
            reward
            owner
      }
    }
  `;

  const RANKING_GQL = gql(RANKING_GRAPHQL);
  const { loading, data } = useQuery(RANKING_GQL, { variables: { weeks: last3weeks }, pollInterval: 10000 });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rewardId, setRewardId] = useState(0);
  const [rewardImage, setRewardImage] = useState();
  const [fishingByWeek, setFishingByWeek] = useState();
  const [loadingRanking, setLoadingRanking] = useState(true);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const updateFishingByWeek = async () => {
      if (data && data.rankings.length > 0) {
        let byWeek = {};
        last3weeks.forEach(function (week) {
          byWeek[week] = [];
        });
        data.rankings.forEach(function (ranking) {
          byWeek[ranking.week].push({
            shipId: ranking.shipId,
            reward: ranking.reward,
            owner: ranking.owner,
          });
        });
        setFishingByWeek(byWeek);
        setLoadingRanking(false);
      }
    };
    updateFishingByWeek();
  }, [DEBUG, data, last3weeks]);

  useEffect(() => {
    const updateRewardImage = async () => {
      if (readContracts.SailorLoogiesGameAward && rewardId > 0) {
        const tokenURI = await readContracts.SailorLoogiesGameAward.tokenURI(rewardId);
        if (DEBUG) console.log("tokenURI: ", tokenURI);
        const jsonManifestString = atob(tokenURI.substring(29));
        try {
          const jsonManifest = JSON.parse(jsonManifestString);
          setRewardImage(jsonManifest.image);
          setIsModalVisible(true);
        } catch (e) {
          console.log(e);
        }
      }
    };
    updateRewardImage();
  }, [DEBUG, readContracts.SailorLoogiesGameAward, rewardId]);

  const columns = [
    {
      title: "Ship",
      dataIndex: "shipId",
      align: "right",
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (text, record) => {
        return <Address address={text} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />;
      },
    },
    {
      title: "Reward",
      dataIndex: "reward",
      align: "right",
    },
  ];

  return (
    <div style={{ backgroundColor: "#29aae1" }}>
      <div id="ranking" class="ranking" style={{ width: 1280, margin: "auto", padding: 25, minHeight: 800 }}>
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
          dataSource={last3weeks}
          loading={loadingRanking}
          renderItem={week => {
            return fishingByWeek && fishingByWeek[week] && (
                <List.Item key={"ranking_" + week}>
                  <Card
                    style={{ backgroundColor: "#b3e2f4", border: "1px solid #0071bb", borderRadius: 10 }}
                    bodyStyle={{ padding: 10 }}
                    headStyle={{ height: 65, fontWeight: "bold" }}
                    title={
                      <div>
                        Ranking Week {week}
                        {week < currentWeek && fishingByWeek[week][0].owner.toLowerCase() === address.toLowerCase() && (
                          <Button
                            type="primary"
                            style={{ marginLeft: 10 }}
                            onClick={async () => {
                              try {
                                const result = tx(
                                  writeContracts.SailorLoogiesGame.claimReward(week),
                                  function (transaction) {
                                    if (transaction.status) {
                                      console.log("TX: ", transaction);
                                      console.log("logs: ", transaction.logs);
                                      const newRewardId = ethers.BigNumber.from(transaction.logs[1].data).toNumber();
                                      console.log("newRewardId: ", newRewardId);
                                      setRewardId(newRewardId);
                                    } else {
                                      alert(transaction.data.message);
                                    }
                                  },
                                );
                                console.log("awaiting metamask/web3 confirm result...", result);
                                const result2 = await result;
                                console.log("result2: ", result2);
                              } catch (e) {
                                console.log("claim reward failed", e);
                              }
                            }}
                          >
                            Claim Prize
                          </Button>
                        )}
                      </div>
                    }
                  >
                    <Table dataSource={fishingByWeek[week]} columns={columns} pagination={false} />
                  </Card>
                </List.Item>
            );
          }}
        />

        <Modal
          title=""
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleOk}
          width={1000}
          cancelButtonProps={{ style: { display: "none" } }}
        >
          <img src={rewardImage} alt={`Reward Week #{currentWeek - 1}`} width="950" />
        </Modal>
      </div>
    </div>
  );
}

export default Ranking;
