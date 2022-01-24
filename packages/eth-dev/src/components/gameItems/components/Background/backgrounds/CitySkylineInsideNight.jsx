import React from 'react'

const styles = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  pointerEvents: 'none',
  background:
    'url(./assets/backgrounds/city_skyline_inisde_night.png) no-repeat center center fixed',
  backgroundSize: 'cover'
}

const CitySkylineInsideNight = () => {
  return (
    <div
      className='background-image'
      style={{
        ...styles
      }}
    />
  )
}

export default CitySkylineInsideNight
