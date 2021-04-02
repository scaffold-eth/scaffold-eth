import React from 'react'
import { Tooltip } from 'antd'
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons'
/*
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
*/

export default function Account({
  address,
  userProvider,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer
}) {
  const modalButtons = []
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <span style={{ verticalAlign: 'middle', paddingLeft: 16, fontSize: 32 }}>
          <Tooltip title='Disconnect Wallet'>
            <LogoutOutlined key='logoutbutton' onClick={logoutOfWeb3Modal} />
          </Tooltip>
        </span>
      )
    } else {
      modalButtons.push(
        <span style={{ verticalAlign: 'middle', paddingLeft: 16, fontSize: 32 }}>
          <Tooltip title='Connect Wallet'>
            <LoginOutlined key='loginbutton' onClick={loadWeb3Modal} />
          </Tooltip>
        </span>
      )
    }
  }

  return <>{modalButtons}</>
}
