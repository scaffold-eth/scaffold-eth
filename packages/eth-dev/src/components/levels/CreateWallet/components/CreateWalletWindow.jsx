import React from 'react'
import { Button } from 'antd'
import { useUserAddress } from 'eth-hooks'
import {
  usePoller,
  useExchangePrice,
  useGasPrice,
  useUserProvider,
  useContractLoader,
  useContractReader,
  useEventListener,
  // useBalance,
  useExternalContractLoader
} from '../../../../hooks'
import {
  getLocalProvider,
  getMainnetProvider,
  getTargetNetwork,
  Transactor
} from '../../../../helpers'
import { WindowModal, WalletBare } from '../../../gameItems/components'

const localProvider = getLocalProvider()
const targetNetwork = getTargetNetwork()

const CreateWalletWindow = ({ dialog, actions, isOpen }) => {
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

  return (
    <WindowModal
      initTop={50}
      initLeft={500}
      initHeight={700}
      initWidth={730}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      onRequestClose={() => console.log('onRequestClose')}
      onFocus={() => console.log('Modal is clicked')}
      windowTitle='GENERATE WALLET'
      isOpen={isOpen}
      contentContainerStyle={{ marginTop: 0, paddingLeft: 20, paddingRight: 20 }}
    >
      <div
        className='content'
        style={{
          float: 'left',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <div
          style={{
            padding: '20px',
            color: '#16DC8C'
            // backgroundColor: 'rgb(16, 59, 51, 0.6)'
          }}
        >
          <WalletBare
            provider={userProvider}
            address={userAddress}
            ensProvider={mainnetProvider}
            price={gasPrice}
            color='red'
          />
          <Button
            block
            style={{ ...styles.button }}
            onClick={() => {
              console.log('clicked done!')
            }}
          >
            Done
          </Button>
        </div>
      </div>
    </WindowModal>
  )
}

export default CreateWalletWindow
