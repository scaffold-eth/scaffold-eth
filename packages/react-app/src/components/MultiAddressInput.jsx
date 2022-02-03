import { Select } from "antd";
import { useLookupAddress } from "eth-hooks/dapps/ens";
import React, { useCallback, useState } from "react";
import QrReader from "react-qr-reader";
import Blockie from "./Blockie";
import { ethers } from "ethers";
import { useMemo } from "react";

// probably we need to change value={toAddress} to address={toAddress}

/*
  ~ What it does? ~

  Displays an address input with QR scan option

  ~ How can I use? ~

  <MultiAddressInput
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
*/

const isENS = (address = "") => address.endsWith(".eth") || address.endsWith(".xyz");

export default function MultiAddressInput(props) {
  const { ensProvider, onChange } = props;
  const [value, setValue] = useState(props.value || []);
  const [searchResults, setSearchResults] = useState([]);

  const children = useMemo(() => {
    if (searchResults.length < 1) {
      return [];
    }

    // use search result to format children
    return searchResults.map(i => (
      <Select.Option key={i.address} value={i.address}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ marginRight: "3px" }}>
            <Blockie address={i.address} size={5} scale={3} />
          </div>
          {i.ens ? i.ens : i.address?.substr(0, 5) + "..." + i.address?.substr(-4)}
        </div>
      </Select.Option>
    ));
  }, [searchResults.length]);

  // const currentValue = typeof props.value !== "undefined" ? props.value : value;
  // const ens = useLookupAddress(props.ensProvider, currentValue);

  const manageSearch = useCallback(
    async newValue => {
      if (typeof newValue !== "undefined") {
        let address = newValue;
        let isResolvedAddress = true;
        if (isENS(address)) {
          try {
            const possibleAddress = await ensProvider.resolveName(address);

            if (possibleAddress) {
              isResolvedAddress = true;
              address = possibleAddress;
            }
            // eslint-disable-next-line no-empty
          } catch (e) {}
        } else if (ethers.utils.isAddress(address)) {
          try {
            const possibleENS = await ensProvider.lookupAddress(address);

            address = possibleENS;
            isResolvedAddress = false;
          } catch (e) {}
        }
        return { resolvedTo: address, isResolvedAddress };
      }
    },
    [ensProvider, onChange],
  );

  const handleSearch = async val => {
    console.log(`Searching: `, val);
    const formattedVal = val.toLowerCase();
    const resolution = await manageSearch(formattedVal);

    console.log(resolution);

    const [address, ens] = resolution.isResolvedAddress ? [resolution.resolvedTo, val] : [val, resolution.resolvedTo];

    if (resolution.resolvedTo !== val) {
      setSearchResults([{ address, isResolvedAddress: resolution.isResolvedAddress, ens }]);
    }
  };

  const handleOnChange = e => {
    console.log(e);
    setSearchResults([]);
    setValue(e);

    if (typeof onChange === "function") {
      onChange(e.map(i => i.value));
    }
  };

  // <Blockie address={currentValue} size={8} scale={3} />

  return (
    <div>
      <Select
        showSearch
        showArrow={false}
        defaultActiveFirstOption={false}
        onSearch={handleSearch}
        filterOption={false}
        labelInValue={true}
        mode="multiple"
        id="0xMultiAddresses" // name it something other than address for auto fill doxxing
        name="0xMultiAddresses" // name it something other than address for auto fill doxxing
        placeholder={props.placeholder ? props.placeholder : "address"}
        value={value}
        onChange={handleOnChange}
        notFoundContent={null}
        style={{ width: "100%" }}
      >
        {children}
      </Select>
    </div>
  );
}
