import React from 'react'

const styles = {
  shared: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    pointerEvents: 'none'
  },
  nightSky0: {
    background: 'url(./assets/layers/night_sky_0.png) no-repeat center center fixed',
    backgroundSize: 'cover',
    zIndex: -100 + 1
  },
  nightSky1: {
    background: 'url(./assets/layers/night_sky_1.png) no-repeat center center fixed',
    backgroundSize: 'cover',
    zIndex: -100 + 2
  },
  fog: {
    background: 'url(./assets/layers/fog.png) no-repeat center center fixed',
    backgroundSize: 'cover',
    zIndex: -100 + 3
  },
  citySkyline0: {
    background: 'url(./assets/layers/city_0.png) no-repeat center center fixed',
    backgroundSize: 'cover',
    zIndex: -100 + 4
  },
  citySkyline1: {
    background: 'url(./assets/layers/city_1.png) no-repeat center center fixed',
    backgroundSize: 'cover',
    zIndex: -100 + 5
  },
  citySkyline2: {
    background: 'url(./assets/layers/city_2.png) no-repeat center center fixed',
    backgroundSize: 'cover',
    zIndex: -100 + 6
  },
  citySkyline3: {
    background: 'url(./assets/layers/city_3.png) no-repeat center center fixed',
    backgroundSize: 'cover',
    zIndex: -100 + 7
  },
  street: {
    background: 'url(./assets/layers/street.png) no-repeat center center fixed',
    backgroundSize: 'cover',
    zIndex: -100 + 8
  }
}

const BackgroundCity = () => {
  return (
    <>
      <div
        className='background-image'
        style={{
          ...styles.shared,
          ...styles.nightSky0
        }}
      />
      <div
        className='background-image'
        style={{
          ...styles.shared,
          ...styles.nightSky1
        }}
      />
      <div
        className='background-image'
        style={{
          ...styles.shared,
          ...styles.fog
        }}
      />
      <div
        className='background-image'
        style={{
          ...styles.shared,
          ...styles.citySkyline0
        }}
      />
      <div
        className='background-image'
        style={{
          ...styles.shared,
          ...styles.citySkyline1
        }}
      />
      <div
        className='background-image'
        style={{
          ...styles.shared,
          ...styles.citySkyline2
        }}
      />
      <div
        className='background-image'
        style={{
          ...styles.shared,
          ...styles.citySkyline3
        }}
      />
      <div
        className='background-image'
        style={{
          ...styles.shared,
          ...styles.street
        }}
      />
    </>
  )
}

export default BackgroundCity
