import React, { useEffect, useState } from "react";
import { List, Table, Button, Modal, Card } from "antd";
import { useDebounce } from "../hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
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
  const rawFishing = useEventListener(readContracts, "SailorLoogiesGame", "Fishing", localProvider, startBlock - 100000);
  console.log("rawFishing: ", rawFishing);
  //const fishing = useDebounce(rawFishing, 1000);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rewardId, setRewardId] = useState(0);
  const [rewardImage, setRewardImage] = useState();
  const [fishingByWeek, setFishingByWeek] = useState();
  const [last12weeks, setLast12weeks] = useState();

  const handleOk = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const updateLast12weeks = async () => {
      if (currentWeek) {
        let last12WeeksUpdate = [];
        for (let i = currentWeek; i > 0 && i > currentWeek - 12; i--) {
          last12WeeksUpdate.push(i);
        }
        console.log("last12WeeksUpdate: ", last12WeeksUpdate);
        setLast12weeks(last12WeeksUpdate);
      }
    };
    updateLast12weeks();
  }, [DEBUG, currentWeek]);

  useEffect(() => {
    const updateFishingByWeek = async () => {
      if (rawFishing && rawFishing.length > 0) {
        let byWeek = {};
        rawFishing
          .sort((a, b) => b.blockNumber - a.blockNumber)
          .forEach(function (fishing) {
            if (!(fishing.args.week.toNumber() in byWeek)) {
              byWeek[fishing.args.week.toNumber()] = {};
            }
            if (!(fishing.args.id.toNumber() in byWeek[fishing.args.week.toNumber()])) {
              byWeek[fishing.args.week.toNumber()][fishing.args.id.toNumber()] = {
                rewards: 0,
                owner: fishing.args.owner,
              };
            }
            byWeek[fishing.args.week.toNumber()][fishing.args.id.toNumber()].rewards += fishing.args.reward.toNumber();
          });
        setFishingByWeek(byWeek);
      }
    };
    updateFishingByWeek();
  }, [DEBUG, rawFishing]);

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
          dataSource={last12weeks}
          renderItem={week => {
            let rewardsByShipSorted = [];
            if (fishingByWeek && fishingByWeek[week]) {
              rewardsByShipSorted = Object.entries(fishingByWeek[week])
                .sort((a, b) => b[1].rewards - a[1].rewards)
                .map(item => {
                  return {
                    shipId: item[0],
                    owner: item[1].owner,
                    reward: item[1].rewards,
                  };
                });
            }

            return (
              <List.Item key={"ranking_" + week}>
                <Card
                  style={{ backgroundColor: "#b3e2f4", border: "1px solid #0071bb", borderRadius: 10 }}
                  bodyStyle={{ padding: 10 }}
                  headStyle={{ height: 65, fontWeight: "bold" }}
                  title={
                    <div>
                      Ranking Week {week}
                      {week < currentWeek &&
                        rewardsByShipSorted &&
                        rewardsByShipSorted.length > 0 &&
                        rewardsByShipSorted[0].owner === address && (
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
                  <Table dataSource={rewardsByShipSorted} columns={columns} pagination={false} />
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
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          <img src={rewardImage} alt={`Reward Week #{currentWeek - 1}`} width="950" />
        </Modal>
      </div>
    </div>
  );
}

export default Ranking;