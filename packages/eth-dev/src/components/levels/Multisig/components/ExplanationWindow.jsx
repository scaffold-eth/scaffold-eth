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
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
  })

  return (
    <WindowModal
      initTop={window.innerHeight * 0.02}
      initLeft={window.innerWidth / 2}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Gambling Contracts'
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
          <Markdown>{fileContent}</Markdown>
        </div>
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
