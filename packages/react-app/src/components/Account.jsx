import { Button } from "antd";
import React, { useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";

import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import { BlockinUIDisplay } from "blockin/dist/ui";
import { utils, constants } from 'ethers';

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
  isContract,
  networkOptions,
  setSelectedNetwork,
  selectedNetwork
}) {
  const { currentTheme } = useThemeSwitcher();
  const [loggedIn, setLoggedIn] = useState(false);

  const display = !minimized && (
    <span style={{ alignItems: 'center', display: 'flex' }}>
      <Balance address={address} provider={localProvider} price={price} size={20} />
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
    </span>
  );

  const capitalizeFirstLetter = (string) => {
    return string[0].toUpperCase() + string.slice(1);
  }

  return (
    <div style={{ display: "flex" }}>
      <BlockinUIDisplay
        selectedChainName={'Ethereum ' + capitalizeFirstLetter(selectedNetwork)}
        chainOptions={
          networkOptions.map((network, idx) => {
            return { name: 'Ethereum ' + capitalizeFirstLetter(network) }
          })
        }
        loggedIn={loggedIn}
        logout={() => {
          setLoggedIn(false);
        }}
        onChainUpdate={(newChainProps) => {
          const targetNetworkName = newChainProps.name.toLowerCase().split(' ')[1];
          const targetNetworkIdx = networkOptions.indexOf(targetNetworkName);
          if (targetNetworkIdx >= 0) {
            console.log(newChainProps);
            setSelectedNetwork(targetNetworkName);
          }
        }}
        signAndVerifyChallenge={async (message) => {
          setLoggedIn(true);
          const from = address;
          const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
          const sign = await window.ethereum.request({
            method: 'personal_sign',
            params: [msg, from],
          });

          return { success: true, message: 'Success!' }
        }}
        customDisplay={display}
        selectedChainInfo={{
          getNameForAddress: async (address) => {
            if (utils.isAddress(address)) {
              try {
                // Accuracy of reverse resolution is not enforced.
                // We then manually ensure that the reported ens name resolves to address
                const reportedName = await mainnetProvider.lookupAddress(address);
                const resolvedAddress = await mainnetProvider.resolveName(reportedName ?? constants.AddressZero);
                if (address && utils.getAddress(address) === utils.getAddress(resolvedAddress ?? '')) {
                  return reportedName ?? undefined;
                } else {
                  return undefined;
                }
              } catch (e) {
                return undefined;
              }
            }
            return undefined;
          }
        }}
        connected={web3Modal?.cachedProvider}
        connect={() => {
          loadWeb3Modal();
        }}
        disconnect={() => {
          logoutOfWeb3Modal();
        }}
        address={address}
        buttonStyle={undefined}
        modalStyle={undefined}
        hideLogin={false}
        challengeParams={{
          address: address,
          domain: 'http://localhost:3000',
          uri: 'http://localhost:3000',
          nonce: 'abc123',
          statement: 'Sign In using Blockin! To see a multi-chain example using Blockin, check out https://blockin.vercel.app. For documentation, see https://blockin.gitbook.io/blockin/.'
        }}
      />

    </div>

  );
}
