import React, { useState } from 'react'
import { Button, Typography } from 'antd'
import shortid from 'shortid'
import {
  useContractLoader,
  useContractReader,
  useEventListener
} from '../../../../../../../../hooks'
import { CodeContainer, WindowModal } from '../../../../../../../../sharedComponents'

const { Title } = Typography

// TODO: pass correct props
const TokenContractWindow = ({ localProvider, userProvider, transactor, address, actions }) => {
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

  const userFoundContractTrick =
    parseInt(claimableSupply, 10) >
    115792089237316195423570985008687907853269984665640564039457584007913129639

  const [uniqueWindowId, setUniqueWindowIdentifier] = useState(shortid.generate())

  // TODO: move this into redux initial state
  const contractCode = `
    contract EthereumCityERC20TokenMinter {
      event Mint(address sender);
      event Burn(address sender);
      event Transfer(address sender, uint256 amount);
      uint256 internal totalSupply;
      uint256 internal claimableSupply;
      mapping(address => uint256) public balanceOf;
      function incrementSupply() public {
        totalSupply++;
        claimableSupply++;
        emit Mint(msg.sender);
      }
      function decrementSupply() public {
        balanceOf[msg.sender]--;
        totalSupply--;
        emit Burn(msg.sender);
      }
      function transfer(uint256 amount) public {
        assert amount <= claimableSupply;
        claimableSupply = 0;
        balanceOf[msg.sender] += claimableSupply;
        emit Transfer(msg.sender, amount);
      }
    }
  `

  return (
    <WindowModal
      uniqueWindowId={uniqueWindowId}
      initWidth={600}
      initHeight={600}
      initTop={130}
      initLeft={60}
      title='Interface Connection'
      onFocus={e => {
        console.log('Modal is clicked')
      }}
      isOpen
      containerStyle={{
        background: '#fff'
      }}
    >
      <div>
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
              // NOTE: we need to do this or otherwise the same overflow bug occures in the userSupply variable
              if (userFoundContractTrick) {
                let amountToClaim = claimableSupply
                if (userBalance > 0 && userFoundContractTrick) {
                  amountToClaim = claimableSupply - userBalance
                }
                transactor(writeContracts.EthereumCityERC20TokenMinter.claim(amountToClaim))
              } else {
                actions.continueCurrentDialog()
              }
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
