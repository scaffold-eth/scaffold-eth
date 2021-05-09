import React from 'react'
import { Button, Typography } from 'antd'
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
import { getLocalProvider, getTargetNetwork, Transactor } from '../../../../../../../../helpers'
import { CodeContainer, WindowModal } from '../../../../../../../../sharedComponents'
import { connectController } from './controller'

const localProvider = getLocalProvider()
const targetNetwork = getTargetNetwork()

const { Title } = Typography

const TokenContractWindow = (props) => {
  // TODO: this is not working - mapStateToProps in controller is incorrect
  const { uniqueWindowId, actions } = props
  console.log('TokenContractWindow:')
  console.log({ props })

  const injectedProvider = null // TODO:
  const userProvider = useUserProvider(injectedProvider, localProvider)

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider)
  // If you want to make 🔐 write transactions to your contracts, use the userProvider:
  const writeContracts = useContractLoader(userProvider)

  const userAddress = useUserAddress(userProvider)

  const gasPrice = useGasPrice(targetNetwork, 'fast')
  const transactor = Transactor(userProvider, gasPrice)

  // keep track of a variable from the contract in the local React state:
  // const userClicks = useContractReader(readContracts, 'Clicker', 'clicks', [address])
  const claimableSupply = useContractReader(
    readContracts,
    'EthereumCityERC20TokenMinter',
    'claimableSupply'
  )
  console.log('💸 claimableSupply:', claimableSupply && claimableSupply.toString())

  const userERC20Balance = useContractReader(
    readContracts,
    'EthereumCityERC20TokenMinter',
    'balances',
    [userAddress]
  )
  // console.log('🤗 userERC20Balance:', userERC20Balance && userERC20Balance.toString())

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
            <Title level={4}>{userERC20Balance && userERC20Balance.toString()}</Title>
          </div>
          <Button
            block
            onClick={() => {
              // NOTE: we need to do this or otherwise the same underflow bug occures on the userSupply variable
              if (userFoundContractTrick) {
                let amountToClaim = claimableSupply
                if (userERC20Balance > 0 && userFoundContractTrick) {
                  amountToClaim = claimableSupply - userERC20Balance
                }
                transactor(writeContracts.EthereumCityERC20TokenMinter.claim(amountToClaim))
              } else {
                actions.continueDialog()
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

export default connectController(TokenContractWindow)
