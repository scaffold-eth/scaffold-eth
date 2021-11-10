import { List } from "antd";
<<<<<<< HEAD
import { useEventListener } from "../hooks";
=======
import { useEventListener } from "eth-hooks/events/useEventListener";
>>>>>>> f5810e940be29fcca5e360239fd82c759bd1c21d
import { Address } from "../components";

/*
  ~ What it does? ~

  Displays a lists of events

  ~ How can I use? ~

  <Events
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"
    localProvider={localProvider}
    mainnetProvider={mainnetProvider}
    startBlock={1}
  />
*/

export default function Events({ contracts, contractName, eventName, localProvider, mainnetProvider, startBlock }) {
  // 📟 Listen for broadcast events
  const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);

  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
<<<<<<< HEAD
      <h2>Bots minted:</h2>
=======
      <h2>Events:</h2>
>>>>>>> f5810e940be29fcca5e360239fd82c759bd1c21d
      <List
        bordered
        dataSource={events}
        renderItem={item => {
          return (
<<<<<<< HEAD
            <List.Item key={item.blockNumber + "_" + item.args.owner + "_" + item.args.tokenId}>
=======
            <List.Item key={item.blockNumber + "_" + item.args.sender + "_" + item.args.purpose}>
>>>>>>> f5810e940be29fcca5e360239fd82c759bd1c21d
              <Address address={item.args[0]} ensProvider={mainnetProvider} fontSize={16} />
              {item.args[1]}
            </List.Item>
          );
        }}
      />
    </div>
  );
}
