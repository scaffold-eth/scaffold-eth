import React, { useEffect, useState } from "react";
import { List, Table, Button, Modal } from "antd";
import { useDebounce } from "../hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { ethers } from "ethers";

function Games({
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rewardId, setRewardId] = useState(0);
  const [rewardImage, setRewardImage] = useState();

  const handleOk = () => {
    setIsModalVisible(false);
  };

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
      key: "ship",
    },
    {
      title: "LoogieCoins",
      dataIndex: "reward",
      key: "loogieCoins",
    },
  ];

  const currentWeekFishing = rawFishing.filter(fishing => fishing.args.week.toNumber() === currentWeek);
  let currentWeekRewardsByShip = {};

  currentWeekFishing.forEach(fishing => {
    if (!(fishing.args.id.toNumber() in currentWeekRewardsByShip)) {
      currentWeekRewardsByShip[fishing.args.id.toNumber()] = 0;
    }
    currentWeekRewardsByShip[fishing.args.id.toNumber()] += fishing.args.reward.toNumber();
  });

  const currentWeekRewardsByShipSorted = Object.entries(currentWeekRewardsByShip).sort((a, b) => b[1] - a[1]);

  const lastWeekFishing = rawFishing.filter(fishing => fishing.args.week.toNumber() === currentWeek - 7);
  let lastWeekRewardsByShip = {};

  lastWeekFishing.forEach(fishing => {
    if (!(fishing.args.id.toNumber() in lastWeekRewardsByShip)) {
      lastWeekRewardsByShip[fishing.args.id.toNumber()] = 0;
    }
    lastWeekRewardsByShip[fishing.args.id.toNumber()] += fishing.args.reward.toNumber();
  });

  const lastWeekRewardsByShipSorted = Object.entries(lastWeekRewardsByShip)
    .sort((a, b) => b[1] - a[1])
    .map(item => {
      return {
        shipId: item[0],
        reward: item[1],
      };
    });

  return (
    <div style={{ margin: "auto", paddingBottom: 32 }}>
      <h2>Current Week {currentWeek} - Day {currentWeekDay} ({currentDay})</h2>
      <h2>Ranking Week {currentWeek}</h2>
      <Table dataSource={currentWeekRewardsByShipSorted} columns={columns} />
      <List
        locale={{ emptyText: `No fishing` }}
        dataSource={currentWeekRewardsByShipSorted}
        renderItem={item => {
          return (
            <List.Item key={item.shipId}>
              LoogieShip #{item.shipId}: {item.reward} LoogieCoins
            </List.Item>
          );
        }}
      />
      <h2>
        Ranking Week {currentWeek - 1}
        <Button
          type="primary"
          onClick={async () => {
            try {
              const result = tx(
                writeContracts.SailorLoogiesGame.withdrawReward(currentWeek - 7),
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
          Claim Reward
        </Button>
      </h2>
      <Table dataSource={lastWeekRewardsByShipSorted} columns={columns} />
      <Modal title="" visible={isModalVisible} onOk={handleOk} width={1000} cancelButtonProps={{ style: { display: 'none' } }}>
        <img src={rewardImage} alt={`Reward Week #{currentWeek - 1}`} />
      </Modal>
      <List
        locale={{ emptyText: `No fishing` }}
        dataSource={lastWeekRewardsByShipSorted}
        renderItem={item => {
          return (
            <List.Item key={item.shipId}>
              LoogieShip #{item.shipId}: {item.reward} LoogieCoins
            </List.Item>
          );
        }}
      />
      <List
        size="large"
        locale={{ emptyText: `waiting for fishing...` }}
        dataSource={rawFishing.sort((a, b) => b.blockNumber - a.blockNumber)}
        renderItem={item => {
          return (
            <List.Item key={item.blockNumber + "_" + item.args.id} style={{ justifyContent: "center" }}>
              LoogieShip #{item.args.id.toString()} - Week #{item.args.week.toString()} - Day #{item.args.day.toNumber() % 7 + 1} - Reward {item.args.reward.toString()} LoogieCoins
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default Games;