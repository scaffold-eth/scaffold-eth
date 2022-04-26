import React, { useCallback, useState } from "react";
import { ethers } from "ethers";
import { useLookupAddress } from "eth-hooks/dapps/ens";
import { QrReader } from "react-qr-reader";

import { QrcodeIcon, IdentificationIcon } from "@heroicons/react/outline";

import Blockie from "./Blockie";

const isENS = (address = "") => address.endsWith(".eth") || address.endsWith(".xyz");

// probably we need to change value={toAddress} to address={toAddress}

/**
  ~ What it does? ~

  Displays an address input with QR scan option

  ~ How can I use? ~

  <AddressInput
    autoFocus
    ensProvider={mainnetProvider}
    placeholder="Enter address"
    value={toAddress}
    onChange={setToAddress}
  />

  ~ Features ~

  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
  - Provide placeholder="Enter address" value for the input
  - Value of the address input is stored in value={toAddress}
  - Control input change by onChange={setToAddress}
                          or onChange={address => { setToAddress(address);}}
**/
export default function AddressInput(props) {
  const { ensProvider, onChange } = props;
  const [value, setValue] = useState(props.value);
  const [scan, setScan] = useState(false);

  const currentValue = typeof props.value !== "undefined" ? props.value : value;
  const ens = useLookupAddress(props.ensProvider, currentValue);

  const updateAddress = useCallback(
    async newValue => {
      if (typeof newValue !== "undefined") {
        let address = newValue;
        if (isENS(address)) {
          try {
            const possibleAddress = await ensProvider.resolveName(address);
            if (possibleAddress) {
              address = possibleAddress;
            }
            // eslint-disable-next-line no-empty
          } catch (e) {}
        }
        setValue(address);
        if (typeof onChange === "function") {
          onChange(address);
        }
      }
    },
    [ensProvider, onChange],
  );

  let blockie;
  if (currentValue && typeof currentValue.toLowerCase === "function") {
    blockie = <Blockie className="rounded" address={currentValue} size={4} scale={4} />;
  } else {
    blockie = <IdentificationIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />;
  }

  const input = (
    <div className="mt-1 flex rounded-md shadow-sm">
      <div className="relative flex items-stretch flex-grow focus-within:z-10">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{blockie}</div>
        <input
          id="0xAddress" // name it something other than address for auto fill doxxing
          name="0xAddress" // name it something other than address for auto fill doxxing
          autoComplete="off"
          autoFocus={props.autoFocus}
          placeholder={props.placeholder ? props.placeholder : "Send to Address"}
          className="block w-full rounded-none rounded-l-md pl-8 sm:text-sm border border-gray-300 focus:outline-none dark:text-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none"
          value={ethers.utils.isAddress(currentValue) && !isENS(currentValue) && isENS(ens) ? ens : currentValue}
          onChange={e => updateAddress(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="-ml-px relative inline-flex items-center px-2.5 py-2 border border-gray-300 rounded-r-md text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800"
        onClick={() => setScan(!scan)}
      >
        <QrcodeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <>
      {input}
      {scan && (
        <div className="cursor-pointer absolute inset-0 w-full z-10" onClick={() => setScan(false)}>
          <QrReader
            style={{ width: "100%" }}
            videoStyle={{ height: "auto", borderRadius: "0.5rem" }}
            constraints={{ facingMode: "environment" }}
            onResult={(result, error) => {
              if (!!result) {
                const newValue = result?.text;
                console.log("SCAN VALUE", newValue);

                let possibleNewValue = newValue;
                if (possibleNewValue.indexOf("/") >= 0) {
                  possibleNewValue = possibleNewValue.substr(possibleNewValue.lastIndexOf("0x"));
                  console.log("CLEANED VALUE", possibleNewValue);
                }

                setScan(false);
                updateAddress(possibleNewValue);
              }

              if (!!error) {
                console.log("SCAN ERROR", error);
              }
            }}
          />
        </div>
      )}
    </>
  );
}
