import React, { useState, useEffect } from "react";
import Blockies from "react-blockies";
import { Transactor } from "../helpers";
import WalletModal from "./WalletModal";

import { PaperAirplaneIcon, ArrowsExpandIcon, IdentificationIcon } from "@heroicons/react/solid";

const { utils } = require("ethers");

// improved a bit by converting address to ens if it exists
// added option to directly input ens name
// added placeholder option

/**
  ~ What it does? ~

  Displays a local faucet to send ETH to given address, also wallet is provided

  ~ How can I use? ~

  <Faucet
    price={price}
    localProvider={localProvider}
    ensProvider={mainnetProvider}
    placeholder={"Send local faucet"}
  />

  ~ Features ~

  - Provide price={price} of ether and convert between USD and ETH in a wallet
  - Provide localProvider={localProvider} to be able to send ETH to given address
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
              works both in input field & wallet
  - Provide placeholder="Send local faucet" value for the input
**/

export default function Faucet(props) {
  const [address, setAddress] = useState();
  const [faucetAddress, setFaucetAddress] = useState();
  const [walletOpen, setWalletOpen] = useState();

  const { price, placeholder, localProvider, ensProvider } = props;

  useEffect(() => {
    const getFaucetAddress = async () => {
      if (localProvider) {
        const _faucetAddress = await localProvider.listAccounts();
        setFaucetAddress(_faucetAddress[0]);
      }
    };
    getFaucetAddress();
  }, [localProvider]);

  let blockie;
  if (address && typeof address.toLowerCase === "function") {
    blockie = <Blockies className="rounded" seed={address.toLowerCase()} size={4} scale={4} />;
  } else {
    blockie = <IdentificationIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />;
  }

  const tx = Transactor(localProvider);

  return (
    <div className="mt-1 flex rounded-md shadow-sm">
      <div className="relative flex items-stretch flex-grow focus-within:z-10">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{blockie}</div>
        <input
          className="block w-full rounded-none rounded-l-md pl-8 sm:text-sm border border-gray-300 focus:outline-none dark:text-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none"
          placeholder={placeholder ? placeholder : "Local Faucet"}
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="-ml-px relative inline-flex items-center px-2.5 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800"
        onClick={() => {
          tx({
            to: address,
            value: utils.parseEther("0.01"),
          });
          setAddress("");
        }}
      >
        <PaperAirplaneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="-ml-px relative inline-flex items-center px-2.5 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800"
        onClick={() => setWalletOpen(true)}
      >
        <ArrowsExpandIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>
      <WalletModal
        provider={localProvider}
        ensProvider={ensProvider}
        price={price}
        address={faucetAddress}
        open={walletOpen}
        setOpen={setWalletOpen}
      />
    </div>
  );
}
