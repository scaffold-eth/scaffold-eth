import React, { useState, useEffect } from 'react'
import ReactModal from 'react-modal-resizable-draggable'
import $ from 'jquery'
import shortid from 'shortid'
import './styles.css'

const Monolog = ({ dialog, children }) => {
  // TODO: move this into redux
  const [uniqueWindowId, setUniqueWindowIdentifier] = useState(shortid.generate())

  const scrollToBottom = _elementSelector => {
    let elementSelector = `#monologWindowContainer .flexible-modal .content`
    if (_elementSelector) elementSelector = _elementSelector
    const { scrollHeight } = $(elementSelector)[0]
    $(elementSelector).animate({ scrollTop: scrollHeight }, 'slow')
  }

  useEffect(() => {
    scrollToBottom()
  }, [dialog.currentDialogIndex])

  return (
    <span id='monologWindowContainer'>
      <ReactModal
        className={uniqueWindowId}
        top={0}
        left={0}
        initHeight={300}
        initWidth={550}
        isOpen
      >
        <div
          className='background-image'
          style={{
            height: '100%',
            overflowY: 'scroll',
            // background: 'url(./assets/trimmed/terminal_trimmed.png)',
            backgroundSize: '100% 100%'
          }}
        />
        <div
          className='content'
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: '100%',
            overflow: 'scroll'
          }}
        >
          {children}
        </div>
      </ReactModal>
    </span>
  )
}

export default Monolog
