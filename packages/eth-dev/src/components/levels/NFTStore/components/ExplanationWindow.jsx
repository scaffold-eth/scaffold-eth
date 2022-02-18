import React, { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const ExplanationWindow = ({
  isOpen,
  globalGameActions,
  setContractWindowVisibility,
  setExplanationWindowVisibility
}) => {
  /*
  const contentFileName = 'ExplanationWindow.md'
  const [fileContent, setFileContent] = useState('')

  useEffect(() => {
    import(`./${contentFileName}`)
        .then(res => {
            fetch(res.default)
                .then(res => res.text())
                .then(res => setFileContent(res))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
  })
  */

  return (
    <WindowModal
      initTop={window.innerHeight * 0.02}
      initLeft={10}
      initHeight={window.innerHeight * 0.5}
      initWidth={window.innerWidth / 4}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle={`NFT's`}
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
        <div
          style={{
            marginTop: '1%',
            marginBottom: '5%',
            color: '#16DC8C',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: 16
          }}
        >
          Anon Punk needs a way to make sure that each member of his DAO can be easily identified.
          We'll help him solve his problem by building an NFT contract, together with a react based
          NFT store.
          <br />
          <br />
          NFT's have been all the rage in 2021 and 2022. But they have been around for much longer.
          If you want, you can read up on the history of NFT's{' '}
          <a
            href='https://medium.com/@Andrew.Steinwold/the-history-of-non-fungible-tokens-nfts-f362ca57ae10'
            target='_blank'
            rel='noreferrer'
          >
            here
          </a>
          .
          <br />
          <br />
          Most of the NFT's on Ethereum follow the{' '}
          <a href='http://erc721.org' target='_blank' rel='noreferrer'>
            ERC721 standard
          </a>{' '}
          which was introduced and then continuously developed{' '}
          <a href='https://github.com/ethereum/EIPs/issues/721' target='_blank' rel='noreferrer'>
            here
          </a>
          .
          <br />
          <br />
          Scaffold-ETH has a boilerplate for building your own NFT.
          <br />
          Try it out:
          <CodeContainer language='bash'>
            {`# fetch code
$ git clone https://github.com/scaffold-eth/scaffold-eth.git
$ cd scaffold-eth

# switch branch
$ git checkout simple-nft-example

# install dependencies
$ yarn

# in second terminal:
# deploy contracts
$ yarn deploy`}
          </CodeContainer>
          <br />
          NOTE: There are a lot of different styles of NFT's. You can take a look at some of them
          over at{' '}
          <a
            href='https://docs.openzeppelin.com/contracts/2.x/api/token/erc721'
            target='_blank'
            rel='noreferrer'
          >
            OpenZeppelin
          </a>
          .
        </div>

        <Button
          onClick={() => {
            setContractWindowVisibility(true)
          }}
        >
          Show example contract
        </Button>
        <Button
          className='is-warning'
          onClick={() => {
            globalGameActions.dialog.continueDialog()
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

export default wrapGlobalGameData(ExplanationWindow)
