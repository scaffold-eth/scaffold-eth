import React, { useState, useEffect } from 'react'
import { WindowModal, CodeContainer, MarkdownContainer, Button } from '../../../gameItems/components'

const HistoryWindow = ({
  isOpen,
  setHistoryWindowVisibility,
  setContractWindowVisibility,
  setChallengeWindowVisibility
}) => {
  const [fileContentIntro, setFileContentIntro] = useState('')
  const [showStartButton, setShowStartButton] = useState(true)

  useEffect(() => {
    import(`./Introduction.md`)
      .then(res => {
        fetch(res.default)
          .then(res => res.text())
          .then(res => setFileContentIntro(res))
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <WindowModal
      initTop={20}
      initLeft={window.innerWidth * 0.2}
      initHeight={window.innerHeight * 0.9}
      initWidth={window.innerWidth * 0.5}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={12}
      windowTitle='Always on vending machines'
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
            marginBottom: '5%',
            color: '#16DC8C',
            fontFamily: 'Roboto, Arial, Helvetica Neue, Helvetica, sans-serif',
            fontSize: 16
          }}
        />

        <MarkdownContainer>{fileContentIntro}</MarkdownContainer>
        {showStartButton && (
          <Button
            className='is-warning'
            onClick={() => {
              setChallengeWindowVisibility(true)
              setShowStartButton(false)
            }}
          >
            Start Challenge
          </Button>
        )}
      </div>
    </WindowModal>
  )
}

export default HistoryWindow
