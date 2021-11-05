import { SendOutlined } from "@ant-design/icons";
import { Button, Input, Tooltip } from "antd";
// import { useLookupAddress } from "eth-hooks/dapps/ens";
import React, { useCallback, useState, useEffect } from "react";
import Blockies from "react-blockies";
import { Transactor } from "../helpers";
import Wallet from "./Wallet";

const { utils } = require("ethers");

// improved a bit by converting address to ens if it exists
// added option to directly input ens name
// added placeholder option

/*
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
*/

export default function Faucet(props) {
  const [address, setAddress] = useState();
  const [faucetAddress, setFaucetAddress] = useState();

  const { price, placeholder, localProvider, ensProvider, onChange } = props;

  useEffect(() => {
    const getFaucetAddress = async () => {
      if (localProvider) {
        const _faucetAddress = await localProvider.listAccounts();
        setFaucetAddress(_faucetAddress[0]);
        //console.log(_faucetAddress);
      }
    };
    getFaucetAddress();
  }, [localProvider]);

  let blockie;
  if (address && typeof address.toLowerCase === "function") {
    blockie = <Blockies seed={address.toLowerCase()} size={8} scale={4} />;
  } else {
    blockie = <div />;
  }

  // const ens = useLookupAddress(ensProvider, address);

  const updateAddress = useCallback(
    async newValue => {
      if (typeof newValue !== "undefined" && utils.isAddress(newValue)) {
        let newAddress = newValue;
        // if (newAddress.indexOf(".eth") > 0 || newAddress.indexOf(".xyz") > 0) {
        //   try {
        //     const possibleAddress = await ensProvider.resolveName(newAddress);
        //     if (possibleAddress) {
        //       newAddress = possibleAddress;
        //     }
        //     // eslint-disable-next-line no-empty
        //   } catch (e) { }
        // }
        setAddress(newAddress);
      }
    },
    [ensProvider, onChange],
  );

  const tx = Transactor(localProvider);

  return (
    <span>
      <Input
        size="large"
        placeholder={placeholder ? placeholder : "local faucet"}
        prefix={blockie}
        value={address}
        // value={ens || address}
        onChange={e => {
          // setAddress(e.target.value);
          updateAddress(e.target.value);
        }}
        suffix={
          <Tooltip title="Faucet: Send local ether to an address.">
            <Button
              onClick={() => {
                tx({
                  to: address,
                  value: parseEther("0.01")
                });
                setAddress("");
              }}
              shape="circle"
              icon={<SendOutlined />}
            />
            <Wallet
              color="#888888"
              provider={props.localProvider}
              ensProvider={props.ensProvider}
              price={props.price}
            />
          </Tooltip>
        }
      />
    </span>
  );
}
