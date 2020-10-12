import React from "react";
import { Row, Divider } from "antd";

export default function Help() {
  return(
    <div>
    <h2 style={{fontWeight: "bold"}}>Connect with MetaMask</h2>
    <ul style={{ padding: 0 }}>
      <p>
        1- Open MetaMask, and select "Custom RPC" from the Network Dropdown.
      </p>
      <Row justify="center">
        <div style={{marginBottom: 20}}>
          <img
            width="300"
            src="https://gateway.pinata.cloud/ipfs/QmRnTpJuVDq1cTvWcfzEttpgysnnsbhCmmmR7QxXxBtyfz"
            alt="metamask"
          />
        </div>
      </Row>
      <p>
        2- In the "Custom RPC" Settings, add in the xDai network details and
        click Save:
      </p>
      <ul>
        <li>Network Name: <b>xDAI</b></li>
        <li>New RPC URL: <b>https://dai.poa.network</b></li>
        <li>ChainID (Optional): <b>100</b></li>
        <li>Symbol: <b>xDAI</b></li>
        <li>Block Explorer URL: <b>https://blockscout.com/poa/xdai</b></li>
      </ul>
      <Row justify="center">
        <div style={{margin: "20px 0"}}>
          <img
            width="300"
            src="https://gateway.pinata.cloud/ipfs/QmU8mstL7PzoPnCzJgwrJcn6C2UVgcgsFt1bTuM2aqZ5z3"
            alt="metamask-2"
          />
        </div>
      </Row>
    </ul>
    <Divider />
    <h2 style={{fontWeight: "bold"}}>Export burning wallet private key</h2>
    <p>If you are not using MetaMask, you can export your burning wallet private key: </p>
    <ul>
      <li>Click on "Wallet" button</li>
      <Row justify="center">
        <div>
          <img
            width="400"
            src="https://gateway.pinata.cloud/ipfs/QmbsYrJ8xyMpTnFZxb9WUewoDCn3Z2YXd9mu5nK5JrmTYN"
            alt="export-private-key-1"
          />
        </div>
      </Row>
      <li>Click on "Private Key" button</li>
      <Row justify="center">
        <div style={{margin: "20px 0"}}>
          <img
            width="400"
            src="https://gateway.pinata.cloud/ipfs/QmNrApV7hdKR7yCC6Dmhp7NfYXddNVGVTNsGhsL7r84vPV"
            alt="export-private-key-2"
          />
        </div>
      </Row>
    </ul>
    <Divider />
    <h2 style={{fontWeight: "bold"}}>Upgrade inks to Ethereum mainnet</h2>
    <p>You can upgrade your inks from xDai to the Ethereum mainnet via the <a href="https://docs.tokenbridge.net/amb-bridge/about-amb-bridge">Tokenbridge</a>. It will then be available to hold in your mainnet wallet or trade on mainnet NFT marketplaces.</p>
    <p>The cost to do this is based on the gas fee associated with minting your Nifty NFT on mainnet</p>
    <p><b>Note that this is a one-way door - it is not possible to bring your NFT back to xDai once it has been upgraded</b></p>
    </div>
  )
}
