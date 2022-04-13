import React from 'react'

import { WindowModal, SpeakerLeft, SpeakerRight, Button } from '../gameItems/components'

const ProgressTrackerWindow = ({ isOpen }) => {
  const initHeight = 600
  const initWidth = 600

  const progresSstyles = {
    color: '#fff'
  }
  return (
    <WindowModal
      initTop={(window.innerHeight * 0.05) / 2}
      initLeft={(window.innerWidth * 0.05) / 2}
      initHeight={window.innerHeight * 0.95}
      initWidth={window.innerWidth * 0.95}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Progress Tracker'
      isOpen={isOpen}
      contentContainerStyle={{ paddingTop: 0 }}
    >
      <div
        className='content'
        style={{
          float: 'left',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
          fontSize: 16,
          color: '#16DC8C'
        }}
      >
        <div style={{ float: 'left', width: '100%', fontSize: '20px' }}>
          <SpeakerLeft pathToAvatar='./assets/punk_anon.png' style={{ fontSize: '20px' }}>
            We'll make a fine web3 hacker out of you! You'll see!
          </SpeakerLeft>
        </div>

        <div style={{ float: 'left', width: '50%' }}>
          <div>
            <h1>Overview</h1>
            Basic Ethereum Concepts
            <ol>
              <li>Blockchains</li>
              <li>Hashing</li>
              <li>Wallets</li>
              <ol>
                <li>Understanding Wallets</li>
                <li>pubk vs. pk</li>
              </ol>
              <li>MetaMask</li>
              <ol>
                <li>What is</li>
                <li>Install</li>
                <li>Setup</li>
              </ol>
              <li>Solidity vs. Vyper</li>
              <li>EIP</li>
              <li>ENS</li>
            </ol>
          </div>
          <div>
            Introduction to Solidity
            <ol>
              <li>Solidity</li>
              <li>
                <a href='https://docs.openzeppelin.com/'>openzeppelin</a>
              </li>
              <li>
                <a href='https://www.smartcontract.engineer/'>Learn Solidity</a>
              </li>
            </ol>
          </div>
          <div>
            Advanced Solidity Concepts
            <ol>
              <li>address vs. address payable</li>
              <li>bytes vs. memory vs. calldata</li>
              <li>Assembly</li>
              <li>evm opcodes</li>
              <li>memory vs. calldata</li>
            </ol>
          </div>
          <div>
            Full Stack Ethereum Development
            <ol>
              <li>Scaffold-Eth</li>
              <li>Hardhat</li>
              <li>Infura</li>
              <li>Gnosis Safe</li>
            </ol>
          </div>
          <div>
            DEFI
            <ol>
              <li>DAOs</li>
              <li>Uniswap</li>
              <li>Uniswap vs. Sushiswap</li>
              <li>Flash Loans</li>
              <li>Aave Lend</li>
              <li>Compound</li>
              <li>Bonding Curves</li>
              <li>Curve.fi</li>
            </ol>
          </div>
          <div>
            Advanced Ethereum Concepts
            <ol>
              <li>MEV</li>
            </ol>
          </div>
          <div>
            Smart Contract Security
            <ol>
              <li>Underflow Bug</li>
              <li>TheDAO Hack</li>
              <li>Insecure Gambling Contract</li>
              <li>
                <a href='https://ethernaut.openzeppelin.com/'>ethernaut (Hacking game)</a>
              </li>
            </ol>
          </div>
          <div>
            Tokenomics
            <ol>
              <li>Bonding Curves</li>
              <li>
                <a href=' https://twitter.com/0xSong/status/1514155500258017283'>
                  Twitter Thread - 10 must-reads
                </a>
              </li>
            </ol>
          </div>
        </div>
        <div style={{ float: 'left', width: '50%' }}>
          <h1>Your Progress</h1>
        </div>
      </div>
    </WindowModal>
  )
}

export default ProgressTrackerWindow
