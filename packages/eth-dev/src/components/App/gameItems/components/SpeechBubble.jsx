import React from 'react'

export default function SpeechBubble({ children, direction }) {
  let alignmentClass = 'from-left'

  if (direction === 'right') {
    alignmentClass = 'from-right'
  }

  return (
    <div
      className={`nes-balloon ${alignmentClass}`}
      style={{
        width: 'calc(100% - 60px)',
        padding: '6px',
        fontSize: '12px',
        lineHeight: '25px',
        color: '#212529'
      }}
    >
      {children}
    </div>
  )
}
