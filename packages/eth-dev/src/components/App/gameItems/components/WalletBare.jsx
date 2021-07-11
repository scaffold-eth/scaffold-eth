/* eslint-disable no-restricted-syntax */
import { WalletOutlined } from '@ant-design/icons'
import { Button, message, Spin, Tooltip, Typography } from 'antd'
import { useUserAddress } from 'eth-hooks'
import { ethers } from 'ethers'
import QR from 'qrcode.react'
import React, { useState } from 'react'
import { Blockie, Address, Balance } from '.'

const { Text } = Typography

/*
  ~ What it does? ~

  Displays a wallet where you can specify address and send USD/ETH, with options to
  scan address, to convert between USD and ETH, to see and generate private keys,
  to send, receive and extract the burner wallet

  ~ How can I use? ~

  <WalletBare
    provider={userProvider}
    address={address}
    ensProvider={mainnetProvider}
    price={price}
    color='red'
  />

  ~ Features ~

  - Provide provider={userProvider} to display a wallet
  - Provide address={address} if you want to specify address, otherwise
                                                    your default address will be used
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
  - Provide price={price} of ether and easily convert between USD and ETH
  - Provide color to specify the color of wallet icon
*/

export default function WalletBare(props) {
  const signerAddress = useUserAddress(props.provider)
  const selectedAddress = props.address || signerAddress

  const [open, setOpen] = useState()
  const [qr, setQr] = useState()
  const [amount, setAmount] = useState()
  const [toAddress, setToAddress] = useState()

  const [showPrivate, setShowPrivate] = useState()

  const styles = {
    button: {
      background: 'transparent',
      border: '2px solid #16DC8C',
      borderRadius: 0,
      marginBottom: '15px',
      color: '#16DC8C',
      fontSize: 10
    }
  }

  let display
  let receiveButton
  let privateKeyButton
  /*
  if (qr) {
    display = (
      <div>
        <div>
          <Text copyable>{selectedAddress}</Text>
        </div>
        <QR
          value={selectedAddress}
          size="450"
          level="H"
          includeMargin
          renderAs="svg"
          imageSettings={{ excavate: false }}
        />
      </div>
    );
    receiveButton = ""
    privateKeyButton = (
     <Button key="hide" onClick={()=>{setPK(selectedAddress);setQr("")}}>
       <KeyOutlined /> Private Key
     </Button>
   )
  } else if (pk) {
  }
  */

  const punkSize = 45

  const pk = localStorage.getItem('metaPrivateKey')
  const wallet = new ethers.Wallet(pk)

  if (wallet.address !== selectedAddress) {
    display = (
      <div style={{ color: '#16DC8C' }}>
        <b>*injected account*, private key unknown</b>
      </div>
    )
  } else {
    const extraPkDisplayAdded = {}
    const extraPkDisplay = []
    const mypart1 = wallet.address && wallet.address.substr(2, 20)
    const mypart2 = wallet.address && wallet.address.substr(22)
    const myx = parseInt(mypart1, 16) % 100
    const myy = parseInt(mypart2, 16) % 100
    extraPkDisplayAdded[wallet.address] = true
    extraPkDisplay.push(
      <div
        style={{
          float: 'left',
          width: '100%',
          fontSize: 16,
          fontWeight: 'bolder',
          padding: 2
        }}
      >
        <div
          style={{
            float: 'left',
            position: 'relative',
            width: punkSize,
            height: punkSize,
            overflow: 'hidden'
          }}
        >
          <img
            src='/punks.png'
            alt='walletPunk'
            style={{
              position: 'absolute',
              left: -punkSize * myx,
              top: -punkSize * myy,
              width: punkSize * 100,
              height: punkSize * 100,
              imageRendering: 'pixelated'
            }}
          />
        </div>
        <a href={'/pk#' + pk} style={{ color: '#89e789' }}>
          <Blockie address={wallet.address} scale={4} /> {wallet.address.substr(0, 6)}
        </a>
      </div>
    )
    for (const key in localStorage) {
      if (key.indexOf('metaPrivateKey_backup') >= 0) {
        // console.log(key)
        const pastpk = localStorage.getItem(key)
        const pastwallet = new ethers.Wallet(pastpk)
        if (!extraPkDisplayAdded[pastwallet.address] /* && selectedAddress!=pastwallet.address */) {
          extraPkDisplayAdded[pastwallet.address] = true
          const part1 = pastwallet.address && pastwallet.address.substr(2, 20)
          const part2 = pastwallet.address && pastwallet.address.substr(22)
          const x = parseInt(part1, 16) % 100
          const y = parseInt(part2, 16) % 100
          extraPkDisplay.push(
            <div style={{ float: 'left', width: '100%', fontSize: 16 }}>
              <a href={'/pk#' + pastpk} style={{ color: '#89e789' }}>
                <div
                  style={{
                    float: 'left',
                    position: 'relative',
                    width: punkSize,
                    height: punkSize,
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src='/punks.png'
                    alt='walletPunk'
                    style={{
                      position: 'absolute',
                      left: -punkSize * x,
                      top: -punkSize * y,
                      width: punkSize * 100,
                      height: punkSize * 100,
                      imageRendering: 'pixelated'
                    }}
                  />
                </div>
                <Blockie address={pastwallet.address} scale={3.8} />{' '}
                {pastwallet.address.substr(0, 6)}
              </a>
            </div>
          )
        }
      }
    }

    let currentButton = (
      <span style={{ marginRight: 4 }}>
        <span style={{ marginRight: 8 }}>⛔️</span> Reveal{' '}
      </span>
    )
    let privateKeyDisplay = ''
    if (showPrivate) {
      currentButton = (
        <span style={{ marginRight: 4 }}>
          <span style={{ marginRight: 8 }}>😅</span> Hide{' '}
        </span>
      )
      privateKeyDisplay = (
        <div style={{ color: '#16DC8C' }}>
          <b>Private Key:</b>
          <div>
            <Text style={{ fontSize: 11 }} copyable>
              {pk}
            </Text>
          </div>
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const el = document.createElement('textarea')
              el.value = window.origin + '/pk#' + pk
              document.body.appendChild(el)
              el.select()
              document.execCommand('copy')
              document.body.removeChild(el)
              message.success(<span style={{ position: 'relative' }}>Copied Private Key Link</span>)
            }}
          >
            <QR
              value={window.origin + '/pk#' + pk}
              size='450'
              level='H'
              includeMargin
              renderAs='svg'
              imageSettings={{ excavate: false }}
            />
          </div>
        </div>
      )
    }

    display = (
      <div>
        {privateKeyDisplay}
        <div style={{ marginBottom: 32, paddingBottom: 32, color: '#16DC8C' }}>
          <Button
            style={{ ...styles.button, marginTop: 16 }}
            onClick={() => {
              setShowPrivate(!showPrivate)
            }}
          >
            {' '}
            {currentButton} Private Key
          </Button>
        </div>
        {extraPkDisplay ? (
          <div style={{ paddingBottom: 32 }}>
            <p style={{ fontSize: 16, color: '#16DC8C' }}>Known Private Keys:</p>
            {extraPkDisplay}
            <Button
              style={{ ...styles.button, marginTop: 16 }}
              onClick={() => {
                const currentPrivateKey = window.localStorage.getItem('metaPrivateKey')
                if (currentPrivateKey) {
                  window.localStorage.setItem(
                    'metaPrivateKey_backup' + Date.now(),
                    currentPrivateKey
                  )
                }
                const randomWallet = ethers.Wallet.createRandom()
                // eslint-disable-next-line no-underscore-dangle
                const privateKey = randomWallet._signingKey().privateKey
                window.localStorage.setItem('metaPrivateKey', privateKey)
                window.location.reload()
              }}
            >
              <span style={{ marginRight: 8 }}>⚙️</span>Generate
            </Button>
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }

  /*
  } else {
    const inputStyle = {
      padding: 10,
    };

    display = (
      <div>
        <div style={inputStyle}>
          <AddressInput
            autoFocus
            ensProvider={props.ensProvider}
            placeholder="to address"
            address={toAddress}
            onChange={setToAddress}
          />
        </div>
        <div style={inputStyle}>
          <EtherInput
            price={props.price}
            value={amount}
            onChange={value => {
              setAmount(value);
            }}
          />
        </div>
      </div>
    );
    receiveButton = (
      <Button
        key="receive"
        onClick={() => {
          setQr(selectedAddress);
          setPK("");
        }}
      >
        <QrcodeOutlined /> Receive
      </Button>
    );
    privateKeyButton = (
      <Button key="hide" onClick={()=>{setPK(selectedAddress);setQr("")}}>
        <KeyOutlined /> Private Key
      </Button>
    );
  }
  */

  return (
    <div style={{ verticalAlign: 'middle', paddingLeft: 16, fontSize: 22 }}>
      {selectedAddress ? (
        <Address address={selectedAddress} ensProvider={props.ensProvider} />
      ) : (
        <Spin />
      )}
      <div style={{ float: 'right', paddingRight: 25 }}>
        <Balance
          address={selectedAddress}
          provider={props.provider}
          dollarMultiplier={props.price}
        />
      </div>
      {display}
    </div>
  )
}
