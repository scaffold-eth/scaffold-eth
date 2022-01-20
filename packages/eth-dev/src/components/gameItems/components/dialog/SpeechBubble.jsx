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
        width: 'calc(100% - 15px)',
        padding: '6px',
        fontSize: '8px',
        lineHeight: '18px',
        color: '#212529'
      }}
    >
      {children}
    </div>
  )
}
