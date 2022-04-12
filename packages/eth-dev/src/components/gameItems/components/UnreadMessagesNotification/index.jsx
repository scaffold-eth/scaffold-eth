import React, { useEffect, useState } from 'react'
import Typist from 'react-typist'
import { MailOutlined } from '@ant-design/icons'

const UnreadMessagesNotification = ({ showTerminal }) => {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <>
      {isVisible && (
        <button
          className='nes-balloon'
          type='button'
          style={{
            position: 'fixed',
            bottom: 0,
            left: '20px',
            // height: '100px',
            width: '300px',
            cursor: 'url(https://unpkg.com/nes.css/assets/cursor-click.png), pointer',
            padding: '6px',
            fontSize: 12,
            lineHeight: '25px',
            color: '#212529',
            textAlign: 'left',

            '&:hover': {
              backgroundColor: '#e7e7e7'
            }
          }}
          onClick={() => {
            showTerminal()
            setIsVisible(false)
          }}
        >
          <div style={{ float: 'left', marginRight: '10px' }}>
            <MailOutlined style={{ color: '#212529', fontSize: 20 }} />
          </div>
          <div style={{ float: 'left', width: 'calc(100% - 35px)' }}>You have 1 new message</div>
        </button>
      )}
    </>
  )
}

export default UnreadMessagesNotification
