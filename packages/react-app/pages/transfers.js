import React from "react";
import { Address } from "../components";
import { List } from "antd";
import { useEventListener } from "eth-hooks/events";
import { Web3Consumer } from "../helpers/Web3Context";

function Transfers({ web3 }) {
  const { readContracts, localProvider, mainnetProvider } = web3;

  // 📟 Listen for broadcast events
  const transferEvents = useEventListener(readContracts, "NextJSTicket", "Transfer", localProvider, 1);

  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <List
        bordered
        dataSource={transferEvents}
        renderItem={item => {
          return (
            <List.Item key={item[0] + "_" + item[1] + "_" + item.blockNumber + "_" + item.args[2].toNumber()}>
              <span style={{ fontSize: 16, marginRight: 8 }}>#{item.args[2].toNumber()}</span>
              <Address address={item.args[0]} ensProvider={mainnetProvider} fontSize={16} /> =&gt;
              <Address address={item.args[1]} ensProvider={mainnetProvider} fontSize={16} />
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default Web3Consumer(Transfers);
