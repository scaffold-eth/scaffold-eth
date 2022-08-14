import { Button } from "antd";
import React from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { useAccount, useConnect, useDisconnect, useNetwork, useSigner } from "wagmi";

import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";

/** 
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    address={address}
  />

**/

const Account = ({ localProvider, mainnetProvider, price, minimized, blockExplorer, isContract }) => {
  const { currentTheme } = useThemeSwitcher();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount({
    onError(error) {
      console.error(error);
    },
  });
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();
  const { data: signer } = useSigner();

  let accountButtonInfo;
  if (isConnected) {
    accountButtonInfo = { name: "Logout", action: disconnect };
  } else {
    accountButtonInfo = { name: "Connect", action: connect };
  }

  const display = !minimized && (
    <span>
      {address && <Address blockExplorer={blockExplorer} fontSize={20} />}
      <Balance address={address} chainId={chain?.id} price={price} watch={true} size={20} />
      {!isContract && (
        <Wallet
          address={address}
          provider={localProvider}
          signer={signer}
          ensProvider={mainnetProvider}
          price={price}
          color={currentTheme === "light" ? "#1890ff" : "#2caad9"}
          size={22}
          padding={"0px"}
        />
      )}
    </span>
  );

  return (
    <div style={{ display: "flex" }}>
      {display}
      {isConnected && (
        <Button style={{ marginLeft: 8 }} shape="round" onClick={accountButtonInfo.action}>
          {accountButtonInfo.name}
        </Button>
      )}
    </div>
  );
};

export default Account;
