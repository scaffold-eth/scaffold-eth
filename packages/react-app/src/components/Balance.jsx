import React, { useState } from "react";
import { useBalance } from "wagmi";

/** 
  ~ What it does? ~

  Displays a balance of given address in ether & dollar

  ~ How can I use? ~

  <Balance
    address={address}
    chainId={chainId}
    watch={true/false}
    size={the size you want the balance}
    price={price}
  />

**/

export default function Balance({ address, chainId, watch, size, price }) {
  const [dollarMode, setDollarMode] = useState(true);

  const { data: balance, isError, error, isLoading } = useBalance({ addressOrName: address, chainId, watch });
  let displayBalance = balance?.formatted;
  console.log("Display Balance:", balance);

  if (dollarMode) {
    displayBalance = "$" + balance?.formatted * price;
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
