import React from 'react'
import ReactMarkdown from 'react-markdown'
import { SpeechBubble } from '../../../../gameItems/components'

const SpeakerLeft = ({ text, pathToAvatar }) => {
  return (
    <div
      style={{
        float: 'left',
        width: '100%',
        marginTop: '15px',
        paddingLeft: '80px',
        position: 'relative'
      }}
    >
      <img
        src={pathToAvatar || './assets/punk5950.png'}
        alt='avatar'
        className='background-image'
        style={{
          position: 'absolute',
          left: 0,
          bottom: 8,
          minWidth: '80px',
          transform: 'scaleX(1)'
        }}
      />
      <SpeechBubble direction='left'>
        <div style={{ paddingLeft: 8 }}>
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </SpeechBubble>
    </div>
  )
}

export default SpeakerLeft
