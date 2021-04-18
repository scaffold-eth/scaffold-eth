import React from 'react'
import { Button, Typography } from 'antd'
import { useContractLoader, useContractReader, useEventListener } from '../../../../../../../hooks'
import { CodeContainer, WindowModal } from '../../../../../../../sharedComponents'

const { Title } = Typography

const TokenContractWindow = ({
  localProvider,
  userProvider,
  transactor,
  address,
  contractCode
}) => {
  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)

  // keep track of a variable from the contract in the local React state:
  // const userClicks = useContractReader(readContracts, 'Clicker', 'clicks', [address])
  const claimableSupply = useContractReader(
    readContracts,
    'EthereumCityERC20TokenMinter',
    'claimableSupply'
  )
  console.log('💸 claimableSupply:', claimableSupply && claimableSupply.toString())

  const userBalance = useContractReader(readContracts, 'EthereumCityERC20TokenMinter', 'balances', [
    address
  ])
  console.log('🤗 userBalance:', userBalance && userBalance.toString())

  // 📟 Listen for broadcast events
  const mintEvents = useEventListener(
    readContracts,
    'EthereumCityERC20TokenMinter',
    'Mint',
    localProvider,
    1
  )
  console.log('📟 mintEvents:', mintEvents)

  return (
    <WindowModal
      initWidth={600}
      initHeight={600}
      initTop={130}
      initLeft={60}
      title='Interface Connection'
      onFocus={e => {
        console.log('Modal is clicked')
      }}
      isOpen
    >
      <div
        className='body'
        style={{
          // float: alignment,
          width: '100%',
          height: 600 - 30,
          overflowY: 'scroll',
          marginTop: 30,
          backgroundColor: '#fff'
        }}
      >
        <div style={{ margin: '-8px 0' }}>
          <CodeContainer language='bash'>{contractCode}</CodeContainer>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <p>Claimable Supply:</p>
            <Title level={4}>{claimableSupply && claimableSupply.toString()}</Title>
          </div>

          <Button
            block
            onClick={() => {
              transactor(writeContracts.EthereumCityERC20TokenMinter.incrementSupply())
            }}
            style={{ marginBottom: '15px' }}
          >
            increment
          </Button>
          <Button
            block
            onClick={() => {
              transactor(writeContracts.EthereumCityERC20TokenMinter.decrementSupply())
            }}
          >
            decrement
          </Button>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>Your balance:</p>
            <Title level={4}>{userBalance && userBalance.toString()}</Title>
          </div>
          <Button
            block
            onClick={() => {
              transactor(writeContracts.EthereumCityERC20TokenMinter.claim(claimableSupply))
            }}
          >
            claim supply
          </Button>
        </div>
      </div>
    </WindowModal>
  )
}

export default TokenContractWindow
