import React from 'react'
import { backgroundsMap } from './backgroundsMap'

const styles = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  pointerEvents: 'none',
  // background: `url(${pathToCurrentBackground}) no-repeat center center fixed`,
  backgroundSize: 'cover',
  zIndex: -1
}

const Background = ({ backgroundId }) => {
  console.log({ backgroundsMap })
  console.log({ backgroundId })

  return (
    <div
      id='Background'
      className='background-image'
      style={{
        ...styles
      }}
    >
      {backgroundsMap[backgroundId]}
    </div>
  )
}

export default Background
