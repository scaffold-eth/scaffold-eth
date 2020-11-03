import React from "react";
import Blockies from "react-blockies";
import { Typography, Skeleton } from "antd";
import { useLookupAddress } from "../hooks";

/*

  Displays an address with a blockie, links to a block explorer, and can resolve ENS

  <Address
    value={address}
    ensProvider={mainnetProvider}
    blockExplorer={optional_blockExplorer}
    fontSize={optional_fontSize}
  />

*/

const { Text } = Typography;

const blockExplorerLink = (address, blockExplorer) => `${blockExplorer || "https://etherscan.io/"}${"address/"}${address}`;

export default function Address(props) {
  const ens = useLookupAddress(props.ensProvider, props.value);

  if (!props.value) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    );
  }

  let displayAddress = props.value.substr(0, 6);

  if (ens && ens.indexOf("0x")<0) {
    displayAddress = ens;
  } else if (props.size === "short") {
    displayAddress += "..." + props.value.substr(-4);
  } else if (props.size === "long") {
    displayAddress = props.value;
  }

  const etherscanLink = blockExplorerLink(props.value, props.blockExplorer);
  if (props.minimized) {
    return (
      <span style={{ verticalAlign: "middle" }}>
        <a style={{ color: "#222222" }} target={"_blank"} href={etherscanLink}>
          <Blockies seed={props.value.toLowerCase()} size={8} scale={2} />
        </a>
      </span>
    );
  }

  let text;
  if (props.onChange) {
    text = (
      <Text editable={{ onChange: props.onChange }} copyable={{ text: props.value }}>
        <a style={{ color: "#222222" }} target={"_blank"} href={etherscanLink}>
          {displayAddress}
        </a>
      </Text>
    );
  } else {
    text = (
      <Text copyable={{ text: props.value }}>
        <a style={{ color: "#222222" }} target={"_blank"} href={etherscanLink}>
          {displayAddress}
        </a>
      </Text>
    );
  }

  return (
    <span>
      <span style={{ verticalAlign: "middle" }}>
        <Blockies seed={props.value.toLowerCase()} size={8} scale={props.fontSize?props.fontSize/7:4} />
      </span>
      <span style={{ verticalAlign: "middle", paddingLeft: 5, fontSize: props.fontSize?props.fontSize:28 }}>{text}</span>
    </span>
  );
}
