import { Button } from "antd";
import React from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";

import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import WalletIcon from "./Icons/WalletIcon";

import "./Account.css";

/** 
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
    isContract={boolean}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
**/

export default function Account({
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  isContract,
  connectButtonStyles,
}) {
  const { currentTheme } = useThemeSwitcher();

  let accountButtonInfo;
  if (web3Modal?.cachedProvider) {
    accountButtonInfo = { name: "Logout", action: logoutOfWeb3Modal, color: "#fff" };
  } else {
    accountButtonInfo = { name: "Connect", action: loadWeb3Modal, showWallet: true, color: "#A056FF" };
  }

  const display = !minimized && (
    <div className="account__display">
      {address && (
        <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={16} />
      )}
      <Balance address={address} provider={localProvider} price={price} size={16} />
      {!isContract && (
        <Wallet
          address={address}
          provider={localProvider}
          signer={userSigner}
          ensProvider={mainnetProvider}
          price={price}
          color={currentTheme === "light" ? "#1890ff" : "#2caad9"}
          size={22}
          padding={"0px"}
        />
      )}
    </div>
  );

  return (
    <div className="account">
      {display}
      {web3Modal && (
        <Button
          className={`account__connect-button ${connectButtonStyles === "lg" ? "account__connect-button--lg" : ""}`}
          shape="round"
          onClick={accountButtonInfo.action}
        >
          {accountButtonInfo.name}
          {connectButtonStyles === "lg" && accountButtonInfo.showWallet && (
            <WalletIcon style={{ color: accountButtonInfo.color }} className="account__connect-button-icon" />
          )}
        </Button>
      )}
    </div>
  );
}
