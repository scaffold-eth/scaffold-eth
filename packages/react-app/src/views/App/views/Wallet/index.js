import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Typist from 'react-typist'
import Typewriter from 'typewriter-effect/dist/core'
import $ from 'jquery'
import { mapStateToProps, mapDispatchToProps, reducer } from './controller'
import './styles.css'

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    right: '10px',
    //pointerEvents:'none',
    height: '450px',
    width: '303px',
    background: 'url(./assets/trimmed/wallet_trimmed.png)',
    backgroundSize: 'cover',
    cursor: 'url(https://unpkg.com/nes.css/assets/cursor-click.png), pointer',
    imageRendering: 'pixelated',
    zIndex: 1050
  },
  message: {
    paddingTop: '80px',
    paddingLeft: '35px',
    color: 'white'
  }
}

const Wallet = ({ visible, actions }) => {
  const toggleVisibility = () => {
    $('#wallet')
      .toggleClass('close')
      .promise()
      .done(() => {
        console.log('effect done')
      })
  }

  const activateConnectionSearchAnimation = () => {
    // eslint-disable-next-line no-new
    new Typewriter('#wallet > .message', {
      strings: ['Searching for network ...'],
      cursor: '',
      autoStart: true,
      loop: true,
      delay: 90, // delay between each key when typing
      deleteSpeed: 10
    })
  }

  useEffect(() => {
    activateConnectionSearchAnimation()
  }, [])

  useEffect(() => {
    toggleVisibility()
  }, [visible])

  return (
    <div
      id='wallet'
      onClick={() => {
        actions.toggleVisibility()
      }}
      style={{ ...styles.container }}
    >
      <div className='message' style={{ ...styles.message }}>
        <Typist cursor={{ show: false }} avgTypingDelay={50} loop={true}></Typist>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)

export { reducer }
