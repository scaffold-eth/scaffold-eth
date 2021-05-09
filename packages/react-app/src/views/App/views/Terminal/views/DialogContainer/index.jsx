import React, { useState } from 'react'
import ReactModal from 'react-modal-resizable-draggable'
import shortid from 'shortid'
import { UnderflowLevel, CityLevel } from './levelContents'
import { connectController } from '../../controller'
import './styles.css'

const DialogContainer = ({ terminalVisible, currentLevel }) => {
  // TODO: move this into redux
  const [uniqueWindowId, setUniqueWindowIdentifier] = useState(shortid.generate())

  // TODO: move this into own file
  const getCurrentLevelView = () => {
    if (currentLevel === 'city') {
      return <CityLevel />
    }
    // initial level
    return <UnderflowLevel />
  }

  const currentLevelView = getCurrentLevelView()

  return (
    <span id='terminalDialogContainer'>
      {terminalVisible && (
        <ReactModal
          className={uniqueWindowId}
          initWidth={359}
          initHeight={709}
          isOpen
          top={100}
          left={30}
        >
          <>
            <div
              className='background-image'
              style={{
                height: '100%',
                overflowY: 'scroll',
                background: 'url(./assets/trimmed/terminal_trimmed.png)',
                backgroundSize: '100% 100%'
              }}
            />
            <div
              className='content'
              style={{
                position: 'absolute',
                top: '33%',
                right: 0,
                height: '62%',
                marginLeft: '10%',
                marginRight: '20%',
                overflow: 'scroll'
              }}
            >
              {currentLevelView}
            </div>
          </>
        </ReactModal>
      )}
    </span>
  )
}

export default connectController(DialogContainer)
