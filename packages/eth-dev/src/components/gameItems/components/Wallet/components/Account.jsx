import { Tooltip } from 'antd'
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons'
import React from 'react'
import Address from './Address'
import Balance from './Balance'
import Button from '../../Button'

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
  const connectWalletButton = (
    <Button
      key='loginbutton'
      className='is-warning'
      style={{ width: '98%' }}
      onClick={() => {
        loadWeb3Modal()
      }}
    >
      connect wallet
    </Button>
  )

  /*
  <span style={{ verticalAlign: 'middle', paddingLeft: 16, fontSize: 32 }}>
    <Tooltip title='Disconnect Wallet'>
      <LogoutOutlined key='logoutbutton' onClick={logoutOfWeb3Modal} />
    </Tooltip>
  </span>
  <span style={{ verticalAlign: 'middle', paddingLeft: 16, fontSize: 32 }}>
    <Tooltip title='Connect Wallet'>
      <LoginOutlined key='loginbutton' onClick={loadWeb3Modal} />
    </Tooltip>
  </span>
  */

  const accountDisplay = (
    <div
      style={{
        height: 15,
        cursor: 'pointer',
        fontSize: 14
      }}
    >
      <Address
        size='short'
        address={address}
        ensProvider={mainnetProvider}
        blockExplorer={blockExplorer}
      />
      <span style={{ verticalAlign: 'middle', paddingLeft: 16, fontSize: 32 }}>
        <Tooltip title='Disconnect Wallet'>
          <LogoutOutlined key='logoutbutton' onClick={logoutOfWeb3Modal} />
        </Tooltip>
      </span>
    </div>
  )

  return <>{address ? accountDisplay : connectWalletButton}</>
}
