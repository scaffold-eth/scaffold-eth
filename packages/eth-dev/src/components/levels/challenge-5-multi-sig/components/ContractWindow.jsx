import React, { useState, useEffect } from 'react'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const ContractWindow = ({ isOpen }) => {
  const contentFileName = 'Challenge5MultiSigWallet.sol'
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
      //initLeft={window.innerWidth / 2}
      initLeft={0}
      initHeight={window.innerHeight * 0.95}
      initWidth={window.innerWidth / 2}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle={contentFileName}
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
        <CodeContainer language='solidity'>
          {fileContent}
        </CodeContainer>
      </div>
    </WindowModal>
  )
}

export default ContractWindow
