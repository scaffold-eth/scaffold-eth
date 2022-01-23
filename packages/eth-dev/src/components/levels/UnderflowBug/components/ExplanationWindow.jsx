import React, { useState, useEffect } from 'react'
import Markdown from 'markdown-to-jsx'
import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { Button, CodeContainer, WindowModal } from '../../../gameItems/components'

const ExplanationWindow = ({ dialog, actions, isOpen }) => {
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
      initLeft={0}
      initHeight={initHeight}
      initWidth={initWidth}
      backgroundPath='./assets/trimmed/window_trimmed.png'
      dragAreaHeightPercent={12}
      isOpen={isOpen}
      contentContainerStyle={{ paddingTop: 0 }}
    >
      <div
        className='windowTitle'
        style={{
          position: 'absolute',
          top: '8%',
          left: '54%',
          width: '31%',
          height: '3%',
          fontSize: '61%',
          color: '#16DC8C'
        }}
      >
        XXX
      </div>
      <div
        className='content'
        style={{
          float: 'left',
          width: '100%',
          height: '100%',
          overflowY: 'scroll'
        }}
      >
        <Markdown>{fileContent}</Markdown>
        <Button>Done</Button>
      </div>
    </WindowModal>
  )
}

export default wrapGlobalGameData(ExplanationWindow)
