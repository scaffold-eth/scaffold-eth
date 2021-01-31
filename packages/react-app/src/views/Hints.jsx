/* eslint-disable jsx-a11y/accessible-emoji */

import React from "react";
import { formatEther } from "@ethersproject/units";
import { Address, AddressInput } from "../components";


export default function Hints({yourLocalBalance, mainnetProvider, price, address }) {

  return (
    <div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>👷</span>

        Edit your <b>contract</b> in
        <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          packages/hardhat/contracts
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🛰</span>
        <b>compile/deploy</b> with
        <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run deploy
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🚀</span>
        Your <b>contract artifacts</b> are automatically injected into your frontend at
        <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          packages/react-app/src/contracts/
        </span>
      </div>

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🎛</span>
        Edit your <b>frontend</b> in
        <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          packages/reactapp/src/App.js
        </span>
      </div>
        Open 3 terminals in root folder<br />
        yarn run chain<br />
        yarn run deploy<br />
        yarn start<br />
        Copy packages/react-app/CopyToNoun.abi.js content into '../react-app/src/contracts/Noun.abi.js'<br />
        You should now have in YourContract frontpage 4 contracts with its functions <br />
        You can mint the Stoodges tokens from there and send it to your accounts<br />
        Open an incongnito window to interact with different burner wallets<br />
        Feed yourself freely from the faucet<br />
        Ok! start creating wills with the functions, you can fund them with raw ETH<br/>
        If you interact from components in /YourContract, remember to convert amounts to Hex<br/>
        In Create there are elements for wills creation, also reference of timestamp (for a new will you need a timestamp > now)<br/>
        In Manage you can see a simple event catcher (only for creation) with simple interaction<br />
        Index in /Manage start from 1, if you need to interact with the will just index-1<br />
        --------------------------------------------------------------------------------------<br/>
        TODO<br/>
        Any reload on /Create will have a problem reading Stoodges coins addresses (this wont happen in the wild) go to any other and come back<br />
        Stoodges tokens not working (compiled ERC20 with pragma 8 required to modify transfer and approval functions(error is in those fn))<br />
        Weirdly claim and withdraw not working from /Manage, yes from root(check out signature for onlyOwner & onlyBeneficiary) <br />
        DrHongo

      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>🔭</span>
        explore the
        <span
          style={{
            marginLeft: 4,
            marginRight: 4,
            backgroundColor: "#f9f9f9",
            padding: 4,
            borderRadius: 4,
            fontWeight: "bolder",
          }}
        >
          🖇 hooks
        </span>
        and
        <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          📦 components
        </span>
      </div>

      <div style={{ marginTop: 32 }}>
        for example, the
        <span style={{ margin: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          useBalance()
        </span>{" "}
        hook keeps track of your balance: <b>{formatEther(yourLocalBalance?yourLocalBalance:0)}</b>
      </div>

      <div style={{ marginTop: 32 }}>
        as you build your app you'll need web3 specific components like an
        <span style={{ margin: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
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
        <span style={{ margin: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          price
        </span>{" "}
        that is loaded with the
        <span style={{ margin: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          usePrice
        </span>{" "}
        hook with the current value: <b>${price}</b>
      </div>

      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>💧</span>
        use the <b>faucet</b> to send funds to
        <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          <Address value={address} minimized /> {address}
        </span>
      </div>

      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>📡</span>
        deploy to a testnet or mainnet by editing
        <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          packages/hardhat/hardhat.config.js
        </span>
        and running
        <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run deploy
        </span>
      </div>


      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>🔑</span>
        <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run generate
        </span>
        will create a deployer account in
        <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          packages/hardhat
        </span>
        <div style={{marginTop:8}}>(use <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
            yarn run account
          </span> to display deployer address and balance)</div>
      </div>


      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>⚙️</span>
        build your app with
        <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run build
        </span>
      </div>

      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>🚢</span>
        ship it!
        <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run surge
        </span>
        or
        <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run s3
        </span>
        or
        <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
          yarn run ipfs
        </span>
      </div>

      <div style={{ marginTop: 32 }}>
        <span style={{ marginRight: 8 }}>💬</span>
        for support, join this
        <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
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
