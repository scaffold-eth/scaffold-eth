/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import { formatEther } from "@ethersproject/units";
import { Address, AddressInput } from "./components";

export default function ChainlinkHints(props) {
  return (
    <div>
      <div style={{ margin: 32 }}>
        <span>
          {" "}
          <a href="https://docs.chain.link/docs/request-and-receive-data">Make any API call Chainlink docs</a>
        </span>
        <br />
        <span>
          {" "}
          <a href="https://docs.chain.link/docs/using-chainlink-reference-contracts">PriceFeeds documentation</a>
        </span>
        <br />
        <p>
          Right now this tutorial is hard-coded to rinkeby. Please swap to rinkeby. We will be testing working directly with <a href="https://chain.link">Chainlink</a> nodes! 
        </p>
        <span style={{ marginRight: 8 }}>Step 1: </span> 
        <br />
        You don't need to run a local chain for this tutorial as we are going to interact with real testnet - rinkeby! First, be sure to set your environment variables. You'll need a `MNEMONIC` and `RINKEBY_RPC_URL`. You can set them with `export MNEMONIC="cat dog car...". This comes from your metamask or other eth wallet's mnemonic. Your `RINKEBY_RPC_URL` comes from your Infura or Alchemy or other URL. You can <a href="https://www.twilio.com/blog/2017/01/how-to-set-environment-variables.html">learn more about setting environment variables here. </a>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>Step 2: </span> Get some rinkeby LINK and rinkeby ETH. You can get both by hitting the icon at
        the bottom, and proceeding to follow the instructions on the appropriate button. If they don't show up in your
        wallet, you can follow <a href="https://docs.chain.link/docs/acquire-link"> this tutorial </a>on how to add it
        to your wallet.
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>Step 3: </span> Deploy your contracts with `yarn deploy`
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>Step 4: </span> Copy your contract address and send them a few LINK tokens! You don't have to send the price feeds address any tokens. You'll need to do this to pay for the oracle gas. 
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>Step 5:</span>
        Enter a number for your "seed" to generate a random number. Hit `send` on your wallet, and a Chainlink VRF node will return a provably random number. Hit the refresh button on result (may take a few seconds).
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>Step 6:</span>
        After it's confirmed, using <b>"https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"</b> for your
        API, and
        <b>"USD"</b> for your path! At the moment, this contract will only work with APIs that return numbers,{" "}
        <b>not</b> strings. <br />
        <br />
        Then, hit the little money button at the bottom of `makeAPICall` and once the transaction completes hit the
        refresh!

        You can use any API and path. Try it out!
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>PriceFeeds</span>
        You can get data from on-chain decentralized contracts!{" "}
        <a href="https://docs.chain.link/docs/reference-contracts">This is a list</a> of all the decentralized data. To
        change it, update `PriceFeed.sol` with the address you wish.
      </div>
    </div>

    // <div>
    //   <div style={{ margin: 32 }}>
    //     <span style={{ marginRight: 8 }}>👷</span>
    //     Edit your <b>contract</b> in
    //     <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       packages/buidler/contracts
    //     </span>
    //   </div>

    //   <div style={{ margin: 32 }}>
    //     <span style={{ marginRight: 8 }}>🛰</span>
    //     <b>compile/deploy</b> with
    //     <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       yarn run deploy
    //     </span>
    //   </div>

    //   <div style={{ margin: 32 }}>
    //     <span style={{ marginRight: 8 }}>🚀</span>
    //     Your <b>contract artifacts</b> are automatically injected into your frontend at
    //     <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       packages/react-app/src/contracts/
    //     </span>
    //   </div>

    //   <div style={{ margin: 32 }}>
    //     <span style={{ marginRight: 8 }}>🎛</span>
    //     Edit your <b>frontend</b> in
    //     <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       packages/reactapp/src/App.js
    //     </span>
    //   </div>

    //   <div style={{ marginTop: 32 }}>
    //     <span style={{ marginRight: 8 }}>🔭</span>
    //     explore the
    //     <span
    //       style={{
    //         marginLeft: 4,
    //         marginRight: 4,
    //         backgroundColor: "#f9f9f9",
    //         padding: 4,
    //         borderRadius: 4,
    //         fontWeight: "bolder",
    //       }}
    //     >
    //       🖇 hooks
    //     </span>
    //     and
    //     <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       📦 components
    //     </span>
    //   </div>

    //   <div style={{ marginTop: 32 }}>
    //     for example, the
    //     <span style={{ margin: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       useBalance()
    //     </span>{" "}
    //     hook keeps track of your balance: <b>{formatEther(props.yourLocalBalance ? props.yourLocalBalance : 0)}</b>
    //   </div>

    //   <div style={{ marginTop: 32 }}>
    //     as you build your app you'll need web3 specific components like an
    //     <span style={{ margin: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       {"<AddressInput/>"}
    //     </span>
    //     component:
    //     <div style={{ width: 350, padding: 16, margin: "auto" }}>
    //       <AddressInput ensProvider={props.mainnetProvider} />
    //     </div>
    //     <div>(try putting in your address, an ens address, or scanning a QR code)</div>
    //   </div>

    //   <div style={{ marginTop: 32 }}>
    //     this balance could be multiplied by
    //     <span style={{ margin: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       price
    //     </span>{" "}
    //     that is loaded with the
    //     <span style={{ margin: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       usePrice
    //     </span>{" "}
    //     hook with the current value: <b>${props.price}</b>
    //   </div>

    //   <div style={{ marginTop: 32 }}>
    //     <span style={{ marginRight: 8 }}>💧</span>
    //     use the <b>faucet</b> to send funds to
    //     <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       <Address value={props.address} minimized /> {props.address}
    //     </span>
    //   </div>

    //   <div style={{ marginTop: 32 }}>
    //     <span style={{ marginRight: 8 }}>📡</span>
    //     deploy to a testnet or mainnet by editing
    //     <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       packages/buidler/buidler.config.js
    //     </span>
    //     and running
    //     <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       yarn run deploy
    //     </span>
    //   </div>

    //   <div style={{ marginTop: 32 }}>
    //     <span style={{ marginRight: 8 }}>⚙️</span>
    //     build your app with
    //     <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       yarn run build
    //     </span>
    //   </div>

    //   <div style={{ marginTop: 32 }}>
    //     <span style={{ marginRight: 8 }}>🚢</span>
    //     ship it!
    //     <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       yarn run surge
    //     </span>
    //     or
    //     <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       yarn run s3
    //     </span>
    //     or
    //     <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       yarn run ipfs
    //     </span>
    //   </div>

    //   <div style={{ marginTop: 32 }}>
    //     <span style={{ marginRight: 8 }}>💬</span>
    //     for support, join this
    //     <span style={{ marginLeft: 4, backgroundColor: "#f9f9f9", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
    //       <a target="_blank" rel="noopener noreferrer" href="https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA">
    //         Telegram Chat
    //       </a>
    //     </span>
    //   </div>
    //   <div style={{ padding: 128 }}>
    //     <a target="_blank" rel="noopener noreferrer" href="https://github.com/austintgriffith/scaffold-eth">
    //       🛠
    //     </a>
    //   </div>
    // </div>
  );
}
