import React from 'react'
import { connectController } from './controller'
import backgroundsMap from './backgroundsMap'

const style = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  pointerEvents: 'none',
  backgroundColor: '#221F34',
  // background: `url(${pathToCurrentBackground}) no-repeat center center fixed`,
  backgroundSize: 'cover'
}

const Background = ({ currentBackground, children }) => {
  return (
    <div className='background-image' style={style}>
      {backgroundsMap(currentBackground)}
      {children}
    </div>
  )
}

export default connectController(Background)
