import React from 'react'

const SpeakerRight = ({ text, pathToAvatar }) => {
  return (
    <div>
      <div
        style={{
          float: 'left',
          width: '100%',
          marginTop: '15px'
        }}
      >
        <img
          src='./assets/punk5950.png'
          alt='avatar'
          className='background-image'
          style={{
            minWidth: '40px',
            transform: 'scaleX(1)'
          }}
        />
        <div
          className='nes-balloon from-left'
          style={{
            width: 'calc(100% - 60px)',
            padding: '6px',
            fontSize: '8px',
            lineHeight: '15px'
          }}
        >
          <p>{text}</p>
        </div>
      </div>
    </div>
  )
}

export default SpeakerRight
