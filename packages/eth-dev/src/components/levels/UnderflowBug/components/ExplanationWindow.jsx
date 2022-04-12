import React, { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { WindowModal, MarkdownContainer, Button } from '../../../gameItems/components'

const ExplanationWindow = ({
  isOpen,
  continueDialog,
  setContractWindowVisibility,
  setExplanationWindowVisibility
}) => {
  const initWidth = window.innerWidth / 2
  const initHeight = window.innerHeight * 0.95

  const contentFileName = 'ExplanationWindow.md'
  const [fileContent, setFileContent] = useState('')

  useEffect(() => {
    import(`./${contentFileName}`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(res => setFileContent(res))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <WindowModal
      initTop={window.innerHeight * 0.02}
      initLeft={window.innerWidth * 0.1}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='ERC20 EXPLOIT'
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
          overflowX: 'hidden'
        }}
      >
        <h1 style={{ marginTop: 15 }}>Welcome</h1>
        <div
          style={{
            marginTop: '1%',
            marginBottom: '5%',
            color: '#16DC8C',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: 16
          }}
        >
          <MarkdownContainer>{fileContent}</MarkdownContainer>

          <div style={{ marginTop: 25 }}>
            Read about the hack{' '}
            <a
              href='https://medium.com/@blockchain101/beautychain-erc20-integer-overflow-bug-explained-c583adcd847e'
              target='_blank'
              rel='noreferrer'
            >
              here
            </a>{' '}
            and see if you can apply the information to help Anon Punk.
            <br />
            <br />
            Further reading:
            <br />
            <br />
            <ul>
              <li>
                <a
                  href='https://etherscan.io/tx/0xad89ff16fd1ebe3a0a7cf4ed282302c06626c1af33221ebe0d3a470aba4a660f'
                  target='_blank'
                  rel='noreferrer'
                >
                  Actual Exploit Transaction
                </a>
              </li>
              <li>
                <a
                  href='https://medium.com/secbit-media/a-disastrous-vulnerability-found-in-smart-contracts-of-beautychain-bec-dbf24ddbc30e'
                  target='_blank'
                  rel='noreferrer'
                >
                  A disastrous vulnerability found in smart contracts of BeautyChain (BEC)
                </a>
              </li>

              <li>
                <a
                  href='https://cryptoslate.com/batchoverflow-exploit-creates-trillions-of-ethereum-tokens/'
                  target='_blank'
                  rel='noreferrer'
                >
                  BatchOverflow Exploit Creates Trillions of Ethereum Tokens, Major Exchanges Halt ERC20 Deposits
                </a>
              </li>
              <li>
                <a
                  href='https://github.com/sec-bit/awesome-buggy-erc20-tokens'
                  target='_blank'
                  rel='noreferrer'
                >
                  Awesome buggy ERC20 Tokens
                </a>
              </li>
            </ul>
          </div>
        </div>
        <Button
          className='is-warning'
          onClick={() => {
            continueDialog()
            setContractWindowVisibility(false)
            setExplanationWindowVisibility(false)
          }}
        >
          Done
        </Button>
      </div>
    </WindowModal>
  )
}

export default ExplanationWindow
