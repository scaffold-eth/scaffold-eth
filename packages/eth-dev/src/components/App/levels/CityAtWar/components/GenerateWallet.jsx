import React, { useState } from 'react'
import { useUserAddress } from 'eth-hooks'
import { ethers } from 'ethers'
import { Button, WindowModal, WalletBare, QRPunkBlockie } from '../../../gameItems/components'
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
} from '../../../../../hooks'
import {
  getLocalProvider,
  getMainnetProvider,
  getTargetNetwork,
  Transactor
} from '../../../../../helpers'

const localProvider = getLocalProvider()
const targetNetwork = getTargetNetwork()

const GenerateWallet = ({ dialog, actions, isOpen }) => {
  const injectedProvider = null // TODO:
  const userProvider = useUserProvider(injectedProvider, localProvider)
  const mainnetProvider = getMainnetProvider()

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)

  const userAddress = useUserAddress(userProvider)

  const gasPrice = useGasPrice(targetNetwork, 'fast')
  const transactor = Transactor(userProvider, gasPrice)

  const [generatedWallet, setGeneratedWallet] = useState()
  const [generatedMnemonic, setGeneratedMnemonic] = useState()
  const [generatedAddress, setGeneratedAddress] = useState()

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

  let walletDisplay

  if (generatedWallet) {
    walletDisplay = (
      <div>
        <div style={{ margin: 'auto', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -340, left: -80 }}>
            <QRPunkBlockie withQr={false} address={generatedAddress} scale={1.5} />
          </div>
        </div>

        <div style={{ padding: 32, marginTop: 150 }}>
          <b>Address</b>
          <div>{generatedAddress}</div>
        </div>

        <div style={{ padding: 32, float: 'left' }}>
          <b>Seed Phrase</b>
          <div>{generatedMnemonic}</div>
        </div>
      </div>
    )
  }

  return (
    <WindowModal
      initTop={50}
      initLeft={500}
      initHeight={700}
      initWidth={730}
      backgroundPath='./assets/trimmed/window_trimmed.png'
      dragAreaHeightPercent={10}
      onRequestClose={() => console.log('onRequestClose')}
      isOpen={isOpen}
      contentContainerStyle={{ marginTop: 0, paddingLeft: 20, paddingRight: 20 }}
    >
      <div
        className='windowTitle'
        style={{
          position: 'absolute',
          top: '7.2%',
          left: '58%',
          width: '31%',
          height: '3%',
          fontSize: '61%',
          color: '#16DC8C'
        }}
      >
        wallet generator
      </div>
      <div
        className='content'
        style={{
          position: 'absolute',
          top: '12%',
          left: '4%',
          width: '92%',
          height: '85%',
          overflow: 'scroll'
        }}
      >
        <div
          style={{
            padding: '20px',
            color: '#16DC8C'
            // backgroundColor: 'rgb(16, 59, 51, 0.6)'
          }}
        >
          {walletDisplay || 'Generate an indentity:'}
          <div style={{ position: 'absolute', width: '90%', bottom: generatedAddress ? 50 : 100 }}>
            <Button
              block
              style={{ ...styles.button }}
              onClick={() => {
                const newWallet = ethers.Wallet.createRandom()
                setGeneratedWallet(newWallet)

                window.localStorage.setItem('mnemonic', newWallet._mnemonic().phrase)

                // eslint-disable-next-line no-underscore-dangle
                setGeneratedMnemonic(newWallet._mnemonic().phrase)
                setGeneratedAddress(newWallet.address)
              }}
            >
              Generate
            </Button>

            {generatedAddress ? (
              <Button
                type='primary'
                onClick={() => {
                  actions.setWalletGeneratorVisibility(false)

                  actions.dialog.jumpToDialogPath({
                    currentDialog: dialog.currentDialog,
                    dialogPathId: 'setup-local-network/beginner-dev'
                  })

                  // dialog.dialogPathsVisibleToUser
                  // actions.level.setCurrentLevel({ levelId: 'create-wallet' })
                  // actions.dialog.continueDialog()
                }}
              >
                Save & Continue
              </Button>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </WindowModal>
  )
}

export default GenerateWallet
