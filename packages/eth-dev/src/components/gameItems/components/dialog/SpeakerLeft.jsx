import React from 'react'
import ReactMarkdown from 'react-markdown'
import SpeechBubble from './SpeechBubble'

const SpeakerLeft = ({ pathToAvatar, children }) => {
  return (
    <div
      style={{
        float: 'left',
        width: '100%',
        marginTop: '15px',
        paddingLeft: '60px',
        position: 'relative'
      }}
    >
      <img
        src={pathToAvatar}
        alt='avatar'
        className='background-image'
        style={{
          position: 'absolute',
          left: 0,
          bottom: 8,
          minWidth: 60,
          transform: 'scaleX(1)'
        }}
      />
      <SpeechBubble direction='left'>
        <div style={{ paddingLeft: 8, overflowWrap: 'break-word' }}>{children}</div>
      </SpeechBubble>
    </div>
  )
}

export default SpeakerLeft
