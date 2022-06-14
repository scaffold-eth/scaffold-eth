import React, { useEffect, useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import Balance from "./Balance";
import Wallet from "./Wallet";
import { BlockinUIDisplay } from "blockin/dist/ui";
import { utils, constants } from "ethers";
import {
  getChallengeParams,
  getLoggedInStatus,
  logoutHandler,
  verifyChallengeHandler,
} from "../helpers/siweBackendHandlers";

const capitalizeFirstLetter = string => {
  if (!string || !string[0]) return "";
  return string[0].toUpperCase() + string.slice(1);
};

/**
 * Welcome to the Account UI! This is what is shown in the top right of the Scaffold-ETH template.
 *
 * If you have used the Scaffold-ETH repo before, you may have noticed that this looks a little different
 * than previously. This new UI uses Blockin, a library built by a fellow Scaffold buidler
 * @trevormil! Blockin is a library that supports a few really cool things:
 * 1) A convenient, all-in-one UI display for connecting and signing in
 * 2) Sign-In with Ethereum support for any blockchain (not limited to just Ethereum if you want to expand to different chains)
 * 3) Adding NFTs to sign-in requests, only granting the request if ownership of the NFT is verified
 *
 * Note that signing-in is different than connecting a wallet: (https://blog.spruceid.com/sign-in-with-ethereum-is-a-game-changer-part-1/)
 *
 * By default, the Sign-In with Ethereum functionalities are disabled and not displayed. Visit the Sign-In with Ethereum tab or 
 * views/SignIn.jsx to see how to activate it.
 *
 * This library is still in its early stages, so any feedback or new ideas would be greatly
 * appreciated. You can report issues on GitHub or message @trevormil23 on Twitter.
 *
 * Blockin Links:
 * Code Repositories: https://github.com/Blockin-Labs
 * Docs: https://blockin.gitbook.io/blockin/
 * Demo Site: https://blockin.vercel.app/
 *
 * If you would like to switch back to the old account UI which offers more customization, that code is provided
 * but commented out at the bottom of this file. You can also build your own UI easily for Blockin using the Blockin Library 
 * if desired. You don't have to use the Blockin UI to use Blockin.
 */
export default function Account({
  hideLogin,
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
  selectedNetwork,
  blockExplorer,
}) {
  const { currentTheme } = useThemeSwitcher();
  const [loggedIn, setLoggedIn] = useState(false);
  const [challengeParams, setChallengeParams] = useState({});

  useEffect(() => {
    const update = async () => {
      if (!hideLogin) {
        const loggedIn = await getLoggedInStatus();
        const challengeParams = await getChallengeParams(address);
        setLoggedIn(loggedIn);
        setChallengeParams(challengeParams);
        console.log(challengeParams);
      }
    };
    update();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const update = async () => {
      if (!hideLogin) {
        setLoggedIn(await getLoggedInStatus());
        setChallengeParams(await getChallengeParams(address));
      }
    };
    update();
  }, [hideLogin, address]);

  const walletDisplay = !minimized && (
    <span style={{ alignItems: "center", display: "flex" }}>
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

  return (
    <div style={{ display: "flex" }}>
      {/* https://blockin.gitbook.io/blockin/reference/library-documentation/react-ui-components/components */}
      <BlockinUIDisplay
        selectedChainName={"Ethereum " + capitalizeFirstLetter(selectedNetwork)}
        address={address}
        customDisplay={walletDisplay}
        buttonStyle={undefined}
        modalStyle={undefined}
        //Chain Select Options
        chainOptions={networkOptions.map((network, idx) => {
          return { name: "Ethereum " + capitalizeFirstLetter(network) };
        })}
        onChainUpdate={newChainProps => {
          const targetNetworkName = newChainProps.name.toLowerCase().split(" ")[1];
          const targetNetworkIdx = networkOptions.indexOf(targetNetworkName);
          if (targetNetworkIdx >= 0) {
            setSelectedNetwork(targetNetworkName);
          }
        }}
        //Connection Options
        hideConnect={false}
        connected={web3Modal?.cachedProvider}
        connect={() => {
          loadWeb3Modal();
        }}
        disconnect={() => {
          logoutOfWeb3Modal();
        }}
        //Sign-In with Ethereum Options
        hideLogin={hideLogin}
        loggedIn={loggedIn}
        logout={async () => {
          await logoutHandler();
          setLoggedIn(false);
        }}
        challengeParams={challengeParams}
        signAndVerifyChallenge={async msg => {
          const from = address;
          const message = `0x${Buffer.from(msg, "utf8").toString("hex")}`;
          const signature = await window.ethereum.request({
            method: "personal_sign",
            params: [message, from],
          });

          const verificationRes = await verifyChallengeHandler(message, signature);

          if (verificationRes && verificationRes.verified) {
            setLoggedIn(true);
            return { success: true, message: "Success!" };
          } else {
            return { success: false, message: `${verificationRes.data.message}` };
          }
        }}
        displayedResources={[]}
        canAddCustomAssets={undefined}
        canAddCustomUris={undefined}
        selectedChainInfo={{
          getNameForAddress: async address => {
            //Taken from the eth-hooks useLookupAddress()
            try {
              if (utils.isAddress(address)) {
                const reportedName = await mainnetProvider.lookupAddress(address);
                const resolvedAddress = await mainnetProvider.resolveName(reportedName ?? constants.AddressZero);
                if (address && utils.getAddress(address) === utils.getAddress(resolvedAddress ?? "")) {
                  return reportedName ?? undefined;
                }
              }
              return undefined;
            } catch (e) {
              return undefined;
            }
          },
        }}
      />
    </div>
  );
}

// import { Button } from "antd";
// import React from "react";
// import { useThemeSwitcher } from "react-css-theme-switcher";

// import Address from "./Address";
// import Balance from "./Balance";
// import Wallet from "./Wallet";

// /**
//   ~ What it does? ~
//   Displays an Address, Balance, and Wallet as one Account component,
//   also allows users to log in to existing accounts and log out
//   ~ How can I use? ~
//   <Account
//     address={address}
//     localProvider={localProvider}
//     userProvider={userProvider}
//     mainnetProvider={mainnetProvider}
//     price={price}
//     web3Modal={web3Modal}
//     loadWeb3Modal={loadWeb3Modal}
//     logoutOfWeb3Modal={logoutOfWeb3Modal}
//     blockExplorer={blockExplorer}
//     isContract={boolean}
//   />
//   ~ Features ~
//   - Provide address={address} and get balance corresponding to the given address
//   - Provide localProvider={localProvider} to access balance on local network
//   - Provide userProvider={userProvider} to display a wallet
//   - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
//               (ex. "0xa870" => "user.eth")
//   - Provide price={price} of ether and get your balance converted to dollars
//   - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
//               to be able to log in/log out to/from existing accounts
//   - Provide blockExplorer={blockExplorer}, click on address and get the link
//               (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
// **/

// export default function Account({
//   address,
//   userSigner,
//   localProvider,
//   mainnetProvider,
//   price,
//   minimized,
//   web3Modal,
//   loadWeb3Modal,
//   logoutOfWeb3Modal,
//   blockExplorer,
//   isContract,
// }) {
//   const { currentTheme } = useThemeSwitcher();

//   let accountButtonInfo;
//   if (web3Modal?.cachedProvider) {
//     accountButtonInfo = { name: 'Logout', action: logoutOfWeb3Modal };
//   } else {
//     accountButtonInfo = { name: 'Connect', action: loadWeb3Modal };
//   }

//   const display = !minimized && (
//     <span>
//       {address && (
//         <Address
//           address={address}
//           ensProvider={mainnetProvider}
//           blockExplorer={blockExplorer}
//           fontSize={20}
//         />
//       )}
//       <Balance address={address} provider={localProvider} price={price} size={20} />
//       {!isContract && (
//         <Wallet
//           address={address}
//           provider={localProvider}
//           signer={userSigner}
//           ensProvider={mainnetProvider}
//           price={price}
//           color={currentTheme === "light" ? "#1890ff" : "#2caad9"}
//           size={22}
//           padding={"0px"}
//         />
//       )}
//     </span>
//   );

//   return (
//     <div style={{ display: "flex" }}>
//       {display}
//       {web3Modal && (
//         <Button
//           style={{ marginLeft: 8 }}
//           shape="round"
//           onClick={accountButtonInfo.action}
//         >
//           {accountButtonInfo.name}
//         </Button>
//       )}
//     </div>
//   );
// }
