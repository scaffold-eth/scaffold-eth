import React, { useState } from "react";
import { formatEther } from "@ethersproject/units";
import { usePoller } from "eth-hooks";

/*
  ~ What it does? ~

  Displays a balance of given address in ether & dollar

  ~ How can I use? ~

  <Balance
    address={address}
    provider={mainnetProvider}
    price={price}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to given address
  - Provide provider={mainnetProvider} to access balance on mainnet or any other network (ex. localProvider)
  - Provide price={price} of ether and get your balance converted to dollars
*/


export default function Balance(props) {
  const [dollarMode, setDollarMode] = useState(true);
  const [balance, setBalance] = useState();

  const getBalance = async () => {
    if (props.address && props.provider) {
      try {
        const newBalance = await props.provider.getBalance(props.address);
        setBalance(newBalance);
      } catch (e) {
        console.log(e);
      }
    }
  };

  usePoller(
    () => {
      getBalance();
    },
    props.pollTime ? props.pollTime : 1999,
  );

  let floatBalance = parseFloat("0.00");

  let usingBalance = balance;

  if (typeof props.balance !== "undefined") {
    usingBalance = props.balance;
  }

  if (usingBalance) {
    const etherBalance = formatEther(usingBalance);
    parseFloat(etherBalance).toFixed(2);
    floatBalance = parseFloat(etherBalance);
  }

  let displayBalance = floatBalance.toFixed(4);

  if (props.price && dollarMode) {
    displayBalance = "$" + (floatBalance * props.price).toFixed(2);
  }

  return (
    <span
      style={{
        verticalAlign: "middle",
        fontSize: props.size ? props.size : 24,
        padding: 8,
        cursor: "pointer",
      }}
      onClick={() => {
        setDollarMode(!dollarMode);
      }}
    >
      {displayBalance}
    </span>
  );
}
