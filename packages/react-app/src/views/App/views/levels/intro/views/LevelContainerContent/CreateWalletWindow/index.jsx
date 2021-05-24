import React from 'react'
import ReactModal from 'react-modal-resizable-draggable'
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
  useBalance,
  useExternalContractLoader
} from '../../../../../../../../hooks'
import {
  getLocalProvider,
  getMainnetProvider,
  getTargetNetwork,
  Transactor
} from '../../../../../../../../helpers'
import { Wallet } from '../../../../../sharedComponents'
import { connectController } from './controller'
import './styles.css'

const localProvider = getLocalProvider()
const targetNetwork = getTargetNetwork()

const CreateWalletWindow = props => {
  const { uniqueWindowId } = props
  console.log('CreateWalletWindow:')
  console.log({ props })

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
    <div id='createWalletWindow'>
      <ReactModal
        className={uniqueWindowId}
        initWidth={600}
        initHeight={600}
        isOpen
        top={160}
        left={430}
      >
        <div
          className='background-image'
          style={{
            height: '100%',
            overflowY: 'scroll',
            background: 'url(./assets/trimmed/window_trimmed.png)',
            backgroundSize: '100% 100%'
          }}
        />
        <div
          className='windowTitle'
          style={{
            position: 'absolute',
            top: '7%',
            left: '54%',
            width: '31%',
            height: '3%',
            fontSize: '61%',
            color: '#16DC8C'
          }}
        >
          GENERATE WALLET
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
              color: '#16DC8C',
              backgroundColor: 'rgb(16, 59, 51, 0.6)'
            }}
          >
            <Wallet
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
      </ReactModal>
    </div>
  )
}

export default connectController(CreateWalletWindow)
