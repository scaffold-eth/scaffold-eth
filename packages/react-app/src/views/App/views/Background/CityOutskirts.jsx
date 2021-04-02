import React from 'react'

const styles = {
  shared: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    pointerEvents: 'none',
    imageRendering: 'pixelated'
  },
  city: {
    background: 'url(./assets/layers/city_outskirts.png) no-repeat center center fixed',
    backgroundSize: 'cover',
    zIndex: -10
  }
}

const BackgroundCityOutskirts = () => {
  return (
    <>
      <div
        style={{
          ...styles.shared,
          ...styles.city
        }}
      />
    </>
  )
}

export default BackgroundCityOutskirts
