import React, { useState } from "react";
import { useBalance } from "wagmi";

const { utils } = require("ethers");

/** 
  ~ What it does? ~

  Displays a balance of given address in ether & dollar

  ~ How can I use? ~

  <Balance
    address={address}
    provider={mainnetProvider}
    price={price}
  />

  ~ If you already have the balance as a bignumber ~
  <Balance
    balance={balance}
    price={price}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to given address
  - Provide provider={mainnetProvider} to access balance on mainnet or any other network (ex. localProvider)
  - Provide price={price} of ether and get your balance converted to dollars
**/

export default function Balance({ address, chainId, watch, size, price }) {
  const [dollarMode, setDollarMode] = useState(true);

  const { data, isError, error, isLoading } = useBalance({ address, chainId, watch });
  let displayBalance = data?.formatted;
  console.log("Display Balance:", data);

  if (dollarMode) {
    displayBalance = "$" + data?.formatted * price;
  }

  if (isError) return { error: error };
  if (isLoading) return <div>Loading...</div>;

  return (
    <span
      style={{
        verticalAlign: "middle",
        fontSize: size ? size : 24,
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
