import { List } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";

function Withdraws({
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
  const withdraws = useEventListener(readContracts, "SailorLoogiesGame", "Withdraw", localProvider, startBlock - 9000);
  console.log("withdraws: ", withdraws);

  return (
    <div style={{ margin: "auto", paddingBottom: 32 }}>
      <h2>Current Week {currentWeek} - Day {currentWeekDay} ({currentDay})</h2>
      <List
        size="large"
        locale={{ emptyText: `waiting for withdraws...` }}
        dataSource={withdraws.sort((a, b) => b.blockNumber - a.blockNumber)}
        renderItem={item => {
          return (
            <List.Item key={item.blockNumber + "_" + item.args.week} style={{ justifyContent: "center" }}>
              LoogieShip #{item.args.shipId.toString()} - Owner #{item.args.winner} - Week #{item.args.week.toString()} - Reward NFT ID {item.args.rewardNftId.toString()}
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default Withdraws;
