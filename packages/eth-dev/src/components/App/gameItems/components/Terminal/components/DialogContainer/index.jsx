import React, { useState, useEffect } from 'react'
import ReactModal from 'react-modal-resizable-draggable'
import $ from 'jquery'
import shortid from 'shortid'
import { connectController } from '../../controller'
import './styles.css'

const DialogContainer = ({ terminalVisible, currentLevel, dialog, children }) => {
  // TODO: move this into redux
  const [uniqueWindowId, setUniqueWindowIdentifier] = useState(shortid.generate())

  const scrollToBottom = _elementSelector => {
    let elementSelector = `#terminalDialogContainer .flexible-modal .content`
    if (_elementSelector) elementSelector = _elementSelector
    const { scrollHeight } = $(elementSelector)[0]
    $(elementSelector).animate({ scrollTop: scrollHeight }, 'slow')
  }

  useEffect(() => {
    scrollToBottom()
  }, [dialog.currentDialogIndex])

  return (
    <span id='terminalDialogContainer'>
      {terminalVisible && (
        <ReactModal
          className={uniqueWindowId}
          top={100}
          left='30%'
          initHeight={929}
          initWidth={938}
          isOpen
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
              {children}
            </div>
          </>
        </ReactModal>
      )}
    </span>
  )
}

export default connectController(DialogContainer)
