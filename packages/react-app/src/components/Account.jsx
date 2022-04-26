import React, { Fragment, useState } from "react";

import { Menu, Transition } from "@headlessui/react";

import { classNames, blockExplorerLink } from "../helpers";
import Address from "./Address";
import Balance from "./Balance";
import WalletModal from "./WalletModal";

/**
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    useBurner={boolean}
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
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
  useBurner,
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
}) {
  const [walletOpen, setWalletOpen] = useState();
  const etherscanLink = blockExplorerLink(address, blockExplorer);

  const accountNavigation = [
    { name: "Wallet", action: () => setWalletOpen(true) },
    { name: "View on Explorer", action: () => window.open(etherscanLink, "_blank").focus() },
  ];

  if (web3Modal?.cachedProvider) {
    accountNavigation.push({ name: "Logout", action: logoutOfWeb3Modal });
  } else {
    accountNavigation.push({ name: "Connect", action: loadWeb3Modal });
  }

  return (
    <div className="flex items-center">
      <Menu as="div" className="ml-3 relative">
        <div className="flex items-center inline-flex items-center pl-3.5 border border-transparent select-none text-sm text-gray-900 leading-4 font-normal rounded-full shadow-sm bg-slate-200 dark:bg-neutral-900 dark:text-white">
          <Balance address={address} provider={localProvider} price={price} textSize="text-lg" />
          <Menu.Button className="inline-flex items-center px-3.5 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm bg-slate-100 hover:border-slate-400 focus:outline-none focus:border-slate-400 dark:bg-neutral-800 dark:hover:border-gray-700 dark:focus:border-gray-700">
            <span className="sr-only">Open user menu</span>
            <Address
              address={address}
              disableAddressLink={true}
              ensProvider={mainnetProvider}
              blockExplorer={blockExplorer}
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
            {accountNavigation.map(item => (
              <Menu.Item key={item.name}>
                {({ active }) => (
                  <span
                    onClick={item.action}
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "cursor-pointer block px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-800",
                    )}
                  >
                    {item.name}
                  </span>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
      <WalletModal
        address={address}
        provider={localProvider}
        signer={userSigner}
        ensProvider={mainnetProvider}
        price={price}
        open={walletOpen}
        setOpen={setWalletOpen}
      />
    </div>
  );
}
