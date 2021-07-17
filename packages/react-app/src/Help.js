import React from "react";
import { Row, Divider, Table, Button, message } from "antd";

const addXDAItoMetamask = async (props) => {
  if (props.injectedProvider.connection && props.injectedProvider.connection.url === "metamask") {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{ 
        chainId: '0x64',
        chainName: 'xDAI Chain',
        rpcUrls: ["https://rpc.xdaichain.com"],
        iconUrls:["https://gblobscdn.gitbook.com/spaces%2F-Lpi9AHj62wscNlQjI-l%2Favatar.png"],
        nativeCurrency: {
          "name": "xDAI",
          "symbol": "xDAI",
          "decimals": 18
        },
        blockExplorerUrls: ["https://blockscout.com/xdai/mainnet"]
      }],
    });
    } catch (error) {
      throw error
    }
  } else {
    message.error("MetaMask was not detected. Make sure MetaMask is installed and connected!")
  }
} 

export default function Help(props) {
  return(
    <div>
    <h2 style={{fontWeight: "bold"}}>Connect with MetaMask</h2>
    <div style={{display: "flex", justifyContent: "center", flexFlow: "column"}}>
      <p>If you prefer to use <a href="https://metamask.io">MetaMask</a> instead of burner wallet, simply click on the button below to add xDAI chain as custom network in MetaMask.</p>
      <p>To add xDAI chain manually to MetaMask instead, please follow <a href="https://www.xdaichain.com/for-users/wallets/metamask/metamask-setup">manual instuctions</a> on xDAI chain official website.</p>
      <p><b>Note: </b>Make sure MetaMask is installed and connected first.</p>
      <Button 
        type="primary" 
        size="large"
        style={{backgroundColor: "#48A9A6", fontWeight: "bold", borderRadius: "5px", borderColor: "#43a5a1", alignSelf: "center", width:"250px", marginTop: "5px"}} 
        onClick={() => addXDAItoMetamask(props)}
      >
        <img 
          src="https://ipfs.io/ipfs/Qmd293VDX7ak7krTfsMphvJzjfRfKBwUxYuF1fT7d639Mc" 
          alt="xdai" 
          width="25px" 
          style={{marginRight: "8px", verticalAlign: "bottom"}}
        />
        Add xDAI to MetaMask
      </Button>
    </div>
    <Divider />
    <h2 style={{fontWeight: "bold"}}>Export burner wallet private key</h2>
    <p>If you are not using MetaMask, you can export your burner wallet private key: </p>
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
    <Divider />
    <Row>
      <h2 style={{fontWeight: "bold"}}>Keyboard shortcuts</h2>
      <p>The following keyboard shortcuts are available while drawing on canvas:</p>
      <Table
        columns={[
          {title: 'Hotkey', dataIndex: 'shortcut'},
          {title: 'Action', dataIndex: 'action'}
        ]}
        dataSource={[
          {key: '1', shortcut: 'Ctrl+z', action: "Undo"},
          {key: '2', shortcut: ']', action: "Increase brush size by 1"},
          {key: '3', shortcut: 'Shift+]', action: "Increase brush size by 10"},
          {key: '4', shortcut: '[', action: "Decrease brush size by 1"},
          {key: '5', shortcut: 'Shift+[', action: "Decrease brush size by 10"},
          {key: '6', shortcut: '> ', action: "Increase current color opacity by 1%"},
          {key: '7', shortcut: 'Shift+> ', action: "Increase current color opacity by 10%"},
          {key: '8', shortcut: '<', action: "Decrease current color opacity by 1%"},
          {key: '9', shortcut: 'Shift+< ', action: "Decrease current color opacity by 10%"}
        ]}
        size="small"
        pagination={false}
        style={{flexGrow: "1"}}
      />
    </Row>
    </div>
  )
}
