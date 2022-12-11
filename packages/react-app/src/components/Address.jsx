import { Skeleton, Typography } from "antd";
import React from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import Blockies from "react-blockies";
import { useLookupAddress } from "eth-hooks/dapps/ens";
import CopyIcon from "./Icons/CopyIcon";
import CopiedIcon from "./Icons/CopiedIcon";

// changed value={address} to address={address}

const { Text } = Typography;

/** 
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
**/

const blockExplorerLink = (address, blockExplorer) => `${blockExplorer || "https://etherscan.io/"}address/${address}`;

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
      <div
        style={{
          verticalAlign: "middle",
          display: "inline-block",
          borderRadius: "50%",
          overflow: "hidden",
          border: "1px solid black",
        }}
      >
        <a
          style={{ color: currentTheme === "light" ? "#222222" : "#ddd", fontSize: "16px" }}
          target="_blank"
          href={etherscanLink}
          rel="noopener noreferrer"
        >
          <Blockies seed={address.toLowerCase()} size={8} scale={2} />
        </a>
      </div>
    );
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      <div
        style={{
          verticalAlign: "middle",
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          width: 24,
          height: 24,
          border: "1px solid black",
        }}
      >
        <Blockies seed={address.toLowerCase()} size={10} scale={props.fontSize ? props.fontSize / 7 : 4} />
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          paddingLeft: 5,
          fontSize: props.fontSize ? props.fontSize : 28,
        }}
      >
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
          <Text
            copyable={{
              text: address,
              icon: [
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CopyIcon />
                </div>,
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CopiedIcon />
                </div>,
              ],
            }}
            style={{ display: "inline-flex", alignItems: "center" }}
          >
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
      </div>
    </div>
  );
}
