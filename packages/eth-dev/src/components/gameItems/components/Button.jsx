import React from 'react'

// className = [ is-primary is-warning is-success is-error is-disabled ]
export default function Button({ className, id, onClick, style, children }) {
  return (
    <button
      type='button'
      id={id || null}
      className={`nes-btn ${className}`}
      onClick={onClick || function () {}}
      style={{
        float: 'left',
        width: '100%',
        fontSize: '12px',
        ...style
      }}
    >
      {children}
    </button>
  )
}
