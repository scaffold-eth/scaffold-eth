import React from 'react'
import $ from 'jquery'
import { useUserAddress } from 'eth-hooks'
import { connectController } from './controller'
import {
  usePoller,
  useExchangePrice,
  useGasPrice,
  useUserProvider,
  useContractLoader,
  useContractReader,
  useEventListener,
  useBalance,
  useExternalContractLoader
} from '../../../../../../../hooks'
import { getLocalProvider, getTargetNetwork, Transactor } from '../../../../../../../helpers'

const localProvider = getLocalProvider()
const targetNetwork = getTargetNetwork()

const styles = {
  button: {
    float: 'left',
    width: '96%',
    marginTop: '30px',
    marginLeft: '2%',
    marginRight: '5%',
    fontSize: '8px'
  }
}

const TerminalContent = ({ dialogs: { currentDialog, currentDialogIndex }, actions }) => {
  const injectedProvider = null // TODO:
  const userProvider = useUserProvider(injectedProvider, localProvider)

  const readContracts = useContractLoader(localProvider)

  const userAddress = useUserAddress(userProvider)

  const userERC20Balance = useContractReader(readContracts, 'ExampleContract', 'balances', [
    userAddress
  ])
  // console.log('🤗 userERC20Balance:', userERC20Balance && userERC20Balance.toString())
  return (
    <>
      {currentDialog.map((dialogStep, index) => {
        const { visibleToUser, anchorId, avatar, alignment, text, choices } = dialogStep

        const isLastVisibleDialog = index === currentDialogIndex
        const isFinalDialog = index === currentDialog.length - 1

        if (index <= currentDialogIndex && visibleToUser) {
          return (
            <div
              style={{
                float: alignment,
                width: '100%',
                marginTop: '15px'
              }}
            >
              {alignment === 'left' && (
                <img
                  src={`./assets/${avatar}`}
                  alt='avatar'
                  className='background-image'
                  style={{
                    minWidth: '40px',
                    transform: 'scaleX(1)'
                  }}
                />
              )}
              <div
                className={`nes-balloon from-${alignment}`}
                style={{
                  width: 'calc(100% - 60px)',
                  padding: '6px',
                  fontSize: '8px',
                  lineHeight: '15px'
                }}
              >
                <p>{text}</p>
              </div>
              {alignment === 'right' && (
                <img
                  src={`./assets/${avatar}`}
                  alt='avatar'
                  className='background-image'
                  style={{
                    minWidth: '40px',
                    transform: 'scaleX(-1)'
                  }}
                />
              )}
            </div>
          )
        }
      })}
    </>
  )
}

export default connectController(TerminalContent)
