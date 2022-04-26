import React, { useState } from "react";
import Blockies from "react-blockies";
import { useLookupAddress } from "eth-hooks/dapps/ens";
import { DocumentDuplicateIcon, CheckCircleIcon } from "@heroicons/react/outline";
import { blockExplorerLink } from "../helpers";

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

export default function Address(props) {
  const address = props.value || props.address;
  const ens = useLookupAddress(props.ensProvider, address);
  const ensSplit = ens && ens.split(".");
  const validEnsCheck = ensSplit && ensSplit[ensSplit.length - 1] === "eth";
  const etherscanLink = blockExplorerLink(address, props.blockExplorer);
  let displayAddress = address?.substr(0, 5) + "..." + address?.substr(-4);

  const [addressCopied, setAddressCopied] = useState(false);

  const copyAddress = e => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setAddressCopied(true);
    setTimeout(() => {
      setAddressCopied(false);
    }, 800);
  };

  if (validEnsCheck) {
    displayAddress = ens;
  } else if (props.size === "short") {
    displayAddress += "..." + address.substr(-4);
  } else if (props.size === "long") {
    displayAddress = address;
  }

  // Skeleton UI
  if (!address) {
    return (
      <div class="animate-pulse flex space-x-4">
        <div class="rounded-md bg-slate-300 h-6 w-6"></div>
        <div class="flex items-center space-y-6">
          <div class="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (props.minimized) {
    return (
      <a target="_blank" href={etherscanLink} rel="noopener noreferrer">
        <Blockies className="inline rounded-md" size={8} scale={2} seed={address.toLowerCase()} />
      </a>
    );
  }

  return (
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <Blockies
          className="mx-auto rounded-md"
          size={5}
          seed={address.toLowerCase()}
          scale={props.fontSize ? props.fontSize / 7 : 4}
        />
      </div>
      {props.disableAddressLink ? (
        <span className="ml-1.5 text-lg font-normal text-gray-900 dark:text-white">{displayAddress}</span>
      ) : (
        <a
          className="ml-1.5 text-lg font-normal text-gray-900 dark:text-white"
          target="_blank"
          href={etherscanLink}
          rel="noopener noreferrer"
        >
          {displayAddress}
        </a>
      )}
      {addressCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <DocumentDuplicateIcon
          className="ml-1.5 text-xl font-normal text-sky-600 h-5 w-5 cursor-pointer"
          aria-hidden="true"
          onClick={copyAddress}
        />
      )}
    </div>
  );
}
