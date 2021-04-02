/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react'
import { Button, Alert } from 'antd'
import { formatEther, parseEther } from '@ethersproject/units'
import { Transactor } from '../../../helpers'
import { useBalance } from '../../../hooks'

const FaucetHint = ({ localProvider, gasPrice, address }) => {
  const [faucetClicked, setFaucetClicked] = useState(false)
  const faucetTx = Transactor(localProvider, gasPrice)

  const yourLocalBalance = useBalance(localProvider, address)

  if (
    !faucetClicked &&
    localProvider &&
    localProvider._network &&
    localProvider._network.chainId === 31337 &&
    yourLocalBalance &&
    formatEther(yourLocalBalance) <= 0
  ) {
    return (
      <div style={{ padding: 16 }}>
        <Button
          type='primary'
          onClick={() => {
            faucetTx({
              to: address,
              value: parseEther('0.01')
            })
            setFaucetClicked(true)
          }}
        >
          💰 Grab funds from the faucet ⛽️
        </Button>
      </div>
    )
  }
  return <></>
}

export default FaucetHint
