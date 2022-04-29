import { Col, List, Space } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { ethers } from "ethers";
import { Address } from "../components";

/*
  ~ What it does? ~

  Displays a lists of events

  ~ How can I use? ~

  <TokenEvents
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"
    localProvider={localProvider}
    mainnetProvider={mainnetProvider}
    startBlock={1}
  />

  <Address address={item.args[2]} ensProvider={mainnetProvider} fontSize={16} />
*/

export default function TokenEvents({
  contracts,
  contractName,
  eventName,
  localProvider,
  mainnetProvider,
  startBlock,
}) {
  // 📟 Listen for broadcast events
  const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);

  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h3>Transfer Events</h3>
      <List
        bordered
        dataSource={events}
        renderItem={item => {
          console.log(item);
          return (
            <List.Item key={item.blockNumber + "_" + item.args.sender + "_" + item.args.purpose}>
              <Col>Block:{parseInt(item.blockNumber)} </Col>
              <Col>TokenId:{parseInt(item.args[2])} </Col>
              <Space>
                Owner: <Address address={item.args[1]} ensProvider={mainnetProvider} fontSize={14} />
              </Space>
            </List.Item>
          );
        }}
      />
    </div>
  );
}
