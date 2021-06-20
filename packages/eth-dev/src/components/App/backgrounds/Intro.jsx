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
  background: {
    backgroundColor: '#221F34',
    backgroundSize: 'cover'
  },
  logo: {
    container: {
      width: '25%',
      margin: '10px auto 0 auto',
      zIndex: 100
    },
    img: {
      width: '100%'
    }
  }
}

const BackgroundIntro = () => {
  return (
    <>
      <div
        className='background-image'
        style={{
          ...styles.shared,
          ...styles.background
        }}
      >
        <div style={{ ...styles.logo.container }}>
          <img alt='eth.dev' style={{ ...styles.logo.img }} src='./assets/logo.png' />
        </div>
      </div>
    </>
  )
}

export default BackgroundIntro
