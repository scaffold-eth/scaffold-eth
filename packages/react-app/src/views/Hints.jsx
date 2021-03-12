/* eslint-disable jsx-a11y/accessible-emoji */

import React, { useState } from "react";
import { formatEther } from "@ethersproject/units";
import { Address, AddressInput } from "../components";
import { Select } from "antd";
import { useTokenList } from "../hooks";

const { Option } = Select;

export default function Hints({yourLocalBalance, mainnetProvider, price, address }) {

  // Get a list of tokens from a tokenlist -> see tokenlists.org!
  const [selectedToken, setSelectedToken] = useState("Pick a token!");
  let listOfTokens = useTokenList("https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json")

  return (
    <div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>👷</span>
        Edit your <b>contract</b> in
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f9f9f9",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          packages/hardhat/contracts
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🛰</span>
        <b>compile/deploy</b> with
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f1f1f1",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run deploy
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🚀</span>
        Your <b>contract artifacts</b> are automatically injected into your frontend at
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f9f9f9",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          packages/react-app/src/contracts/
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🎛</span>
        Edit your <b>frontend</b> in
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f9f9f9",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          packages/reactapp/src/App.js
        </span>
      </div>

      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>🔭</span>
        explore the
        <span
          class="highlight"
          style={{
            marginLeft: 4,
            marginRight: 4,
            /*backgroundColor: "#f9f9f9",*/
            padding: 4,
            borderRadius: 4,
            fontWeight: "bolder",
          }}
        >
          🖇 hooks
        </span>
        and
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f9f9f9",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          📦 components
        </span>
      </div>

      <div style={{ marginTop: 32 }}>
        for example, the
        <span class="highlight" style={{ margin: 4, /*backgroundColor: "#f9f9f9",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          useBalance()
        </span>{" "}
        hook keeps track of your balance: <b>{formatEther(yourLocalBalance?yourLocalBalance:0)}</b>
      </div>

      <div style={{margin:8}}>
      <div><b>useTokenList()</b> can get you an array of tokens from <a href="https://tokenlists.org" target="_blank">tokenlists.org!</a></div>
      <Select showSearch value={selectedToken}
        onChange={(value) => {
          console.log(`selected ${value}`)
          setSelectedToken(value)
          }}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        optionFilterProp="children">
        {listOfTokens.map(token => (
        <Option key={token.symbol} value={token.symbol}>{token.symbol}</Option>
        ))}
        </Select>
      </div>

      <div style={{ marginTop: 32 }}>
        as you build your app you'll need web3 specific components like an
        <span class="highlight" style={{ margin: 4, /*backgroundColor: "#f9f9f9",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          {"<AddressInput/>"}
        </span>
        component:
        <div style={{ width: 350, padding: 16, margin: "auto" }}>
          <AddressInput ensProvider={mainnetProvider} />
        </div>
        <div>(try putting in your address, an ens address, or scanning a QR code)</div>
      </div>

      <div style={{ marginTop: 32 }}>
        this balance could be multiplied by
        <span class="highlight" style={{ margin: 4, /*backgroundColor: "#f9f9f9",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          price
        </span>{" "}
        that is loaded with the
        <span class="highlight" style={{ margin: 4, /*backgroundColor: "#f9f9f9",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          usePrice
        </span>{" "}
        hook with the current value: <b>${price}</b>
      </div>

      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>💧</span>
        use the <b>faucet</b> to send funds to
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f9f9f9",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          <Address address={address} minimized /> {address}
        </span>
      </div>

      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>📡</span>
        deploy to a testnet or mainnet by editing
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f9f9f9",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          packages/hardhat/hardhat.config.js
        </span>
        and running
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f1f1f1",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run deploy
        </span>
      </div>


      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>🔑</span>
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f1f1f1",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run generate
        </span>
        will create a deployer account in
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f9f9f9",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          packages/hardhat
        </span>
        <div class="highlight" style={{marginTop:8}}>(use <span style={{ marginLeft: 4, /*backgroundColor: "#f1f1f1",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            yarn run account
          </span> to display deployer address and balance)</div>
      </div>


      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>⚙️</span>
        build your app with
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f1f1f1",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run build
        </span>
      </div>

      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>🚢</span>
        ship it!
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f1f1f1",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run surge
        </span>
        or
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f1f1f1",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run s3
        </span>
        or
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f1f1f1",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run ipfs
        </span>
      </div>

      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>💬</span>
        for support, join this
        <span class="highlight" style={{ marginLeft: 4, /*backgroundColor: "#f9f9f9",*/ padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          <a target="_blank" rel="noopener noreferrer" href="https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA">
            Telegram Chat
          </a>
        </span>
      </div>
      <div style={{ padding: 128 }}>
        🛠 Check out your browser's developer console for more... (inpect -> console) 🚀
      </div>
    </div>
  );
}
