import React from 'react'
import { SpeechBubble } from '../../../../gameItems/components'

const SpeakerLeft = ({ text, pathToAvatar }) => {
  return (
    <div
      style={{
        float: 'left',
        width: '100%',
        marginTop: '15px'
      }}
    >
      <img
        src={pathToAvatar || './assets/punk5950.png'}
        alt='avatar'
        className='background-image'
        style={{
          minWidth: '40px',
          transform: 'scaleX(1)'
        }}
      />
      <SpeechBubble direction='left'>
        <p>{text}</p>
      </SpeechBubble>
    </div>
  )
}

export default SpeakerLeft
