import { utils } from "ethers";
import { Select } from "antd";
import React, { useState } from "react";
import { Address, AddressInput } from "../components";
import { useTokenList } from "eth-hooks/dapps/dex";

const { Option } = Select;

export default function Hints({ yourLocalBalance, mainnetProvider, price, address }) {
  // Get a list of tokens from a tokenlist -> see tokenlists.org!
  const [selectedToken, setSelectedToken] = useState("Pick a token!");
  const listOfTokens = useTokenList(
    "https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json",
  );

  return (
    <div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>👷</span>
        Edit your <b>contract</b> in
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          packages/hardhat/contracts
        </span>
      </div>



      <div style={{ marginTop: 32 }}>
        as you build your app you&apos;ll need web3 specific components like an
        <span
          className="highlight"
          style={{ margin: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          {"<AddressInput/>"}
        </span>
        component:
        <div style={{ width: 350, padding: 16, margin: "auto" }}>
          <AddressInput ensProvider={mainnetProvider} />
        </div>
        <div>(try putting in your address, an ens address, or scanning a QR code)</div>
      </div>


      <div style={{ padding: 128 }}>
        🛠 Check out your browser&apos;s developer console for more... (inspect console) 🚀
      </div>
    </div>
  );
}
