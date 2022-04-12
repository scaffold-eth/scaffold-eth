import React, { useState, useEffect } from 'react'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const ContractWindow = ({ isOpen }) => {
  const initWidth = window.innerWidth / 2
  const initHeight = window.innerHeight * 0.95

  const contentFileName = 'BecToken.sol'
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
      initLeft={(window.innerWidth / 2) - (window.innerWidth * 0.1)}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/items/window_large.png'
      dragAreaHeightPercent={8}
      windowTitle='BUGGY ERC20 CONTRACT'
      isOpen={isOpen}
      windowTiteleStyle={{ top: '3.5%', left: '56%' }}
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
