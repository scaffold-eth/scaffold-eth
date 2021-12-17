import { Skeleton, Typography } from "antd";
import React from "react";
import Blockies from "react-blockies";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { useLookupAddress } from "eth-hooks/dapps/ens";

// changed value={address} to address={address}

/*
  ~ What it does? ~

  Displays an address with a blockie image and option to copy address

  ~ How can I use? ~

  <Address
    address={address}
    ensProvider={mainnetProvider}
    blockExplorer={blockExplorer}
    fontSize={fontSize}
  />

  ~ Features ~

  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
  - Provide fontSize={fontSize} to change the size of address text
*/

const { Text } = Typography;

const blockExplorerLink = (address, blockExplorer) => blockExplorer || `https://etherscan.io/address/${address}`;

export default function Address(props) {
  const { currentTheme } = useThemeSwitcher();
  const address = props.value || props.address;
  const ens = useLookupAddress(props.ensProvider, address);
  const ensSplit = ens && ens.split(".");
  const validEnsCheck = ensSplit && ensSplit[ensSplit.length - 1] === "eth";
  const etherscanLink = blockExplorerLink(address, props.blockExplorer);
  let displayAddress = address?.substr(0, 5) + "..." + address?.substr(-4);

  if (validEnsCheck) {
    displayAddress = ens;
  } else if (props.size === "short") {
    displayAddress += "..." + address.substr(-4);
  } else if (props.size === "long") {
    displayAddress = address;
  }

  if (!address) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    );
  }

  if (props.minimized) {
    return (
      <span style={{ verticalAlign: "middle" }}>
        <a
          style={{ color: currentTheme === "light" ? "#222222" : "#ddd" }}
          target="_blank"
          href={etherscanLink}
          rel="noopener noreferrer"
        >
          <Blockies seed={address.toLowerCase()} size={8} scale={2} />
        </a>
      </span>
    );
  }

  return (
    <span>
      <span style={{ verticalAlign: "middle" }}>
        <Blockies seed={address.toLowerCase()} size={8} scale={props.fontSize ? props.fontSize / 7 : 4} />
      </span>
      <span style={{ verticalAlign: "middle", paddingLeft: 5, fontSize: props.fontSize ? props.fontSize : 28 }}>
        {props.onChange ? (
          <Text editable={{ onChange: props.onChange }} copyable={{ text: address }}>
            <a
              style={{ color: currentTheme === "light" ? "#222222" : "#ddd" }}
              target="_blank"
              href={etherscanLink}
              rel="noopener noreferrer"
            >
              {displayAddress}
            </a>
          </Text>
        ) : (
          <Text copyable={{ text: address }}>
            <a
              style={{ color: currentTheme === "light" ? "#222222" : "#ddd" }}
              target="_blank"
              href={etherscanLink}
              rel="noopener noreferrer"
            >
              {displayAddress}
            </a>
          </Text>
        )}
      </span>
    </span>
  );
}
