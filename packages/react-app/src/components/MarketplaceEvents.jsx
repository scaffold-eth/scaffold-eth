import { Col, List, Space } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { ethers } from "ethers";
import { Address } from ".";

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

export default function MarketplaceEvents({
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
      <h3>Marketplace Events</h3>
      <List
        bordered
        dataSource={events}
        renderItem={item => {
          return (
            <List.Item key={item.blockNumber + "_" + item.args.sender + "_" + item.args.purpose}>
              <Col>ListingId:{ethers.utils.formatUnits(item.args[0], 0)}</Col>
              <Col>
                Auction:{" "}
                {item.args["isAuction"]
                  ? "  TRUE, Price " + ethers.utils.formatEther(item.args["price"])
                  : "  FALSE, Price " + ethers.utils.formatEther(item.args["price"])}
                {item.args["acceptEMAX"] ? "EMAX" : "ETH"}
              </Col>
              <Col>
                Seller: <Address address={item.args["seller"]} ensProvider={mainnetProvider} fontSize={14} />
              </Col>
            </List.Item>
          );
        }}
      />
    </div>
  );
}
