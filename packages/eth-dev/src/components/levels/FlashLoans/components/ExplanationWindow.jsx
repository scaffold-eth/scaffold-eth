import React, { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { Button, MarkdownContainer, WindowModal } from '../../../gameItems/components'

const ExplanationWindow = ({
  isOpen,
  setContractWindowVisibility,
  setExplanationWindowVisibility,
  setEtherDeltaWindowVisibility
}) => {
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
      initTop={10}
      initLeft={10}
      initHeight={window.innerHeight * 0.7}
      initWidth={window.innerWidth * 0.4}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Flash Loans'
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
          backgroundColor: '#161B22'
        }}
      >
        <div
          style={{
            marginTop: '1%',
            marginBottom: '5%',
            // color: '#16DC8C',
            color: '#C9D1D9',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: '16px'
          }}
        >
          <MarkdownContainer>{fileContent}</MarkdownContainer>
        </div>
      </div>
    </WindowModal>
  )
}

export default ExplanationWindow
