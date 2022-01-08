import React from 'react'

const styles = {
  float: 'left',
  width: '96%',
  marginLeft: '2%',
  marginRight: '5%',
  fontSize: '12px'
}

export default function Button({ className, id, onClick, styles: _styles, children }) {
  return (
    <button
      type='button'
      id={id || null}
      className={`nes-btn ${className}`}
      onClick={onClick || function () {}}
      style={{ ...styles, ..._styles }}
    >
      {children}
    </button>
  )
}
