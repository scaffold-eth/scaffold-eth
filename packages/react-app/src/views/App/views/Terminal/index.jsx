import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Typist from 'react-typist'
import Typewriter from 'typewriter-effect/dist/core'
import $ from 'jquery'
import { mapStateToProps, mapDispatchToProps, reducer } from './controller'
import './styles.css'

const styles = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  // pointerEvents:'none',
  height: '600px',
  width: '302px',
  background: 'url(./assets/trimmed/terminal_trimmed.png)',
  backgroundSize: 'cover',
  cursor: 'url(https://unpkg.com/nes.css/assets/cursor-click.png), pointer',
  zIndex: 0
}

const Terminal = ({ ringing, visible, actions }) => {
  const toggleVisibility = () => {
    $('#terminal')
      .toggleClass('close')
      .promise()
      .done(() => {
        console.log('effect done')
      })
  }

  const activateRingingAnimation = () => {
    // eslint-disable-next-line no-new
    new Typewriter('#terminal > .nes-balloon', {
      strings: ['Incoming call ...'],
      cursor: '',
      autoStart: true,
      loop: true,
      delay: 90, // delay between each key when typing
      deleteSpeed: 10
    })
  }

  useEffect(() => {
    toggleVisibility()
  }, [visible])

  useEffect(() => {
    if (ringing) {
      activateRingingAnimation()
    }
  }, [ringing])

  return (
    <div
      id='terminal'
      className='background-image'
      onClick={() => {
        if (!ringing) {
          actions.toggleVisibility()
        }
        if (ringing) {
          actions.toggleRinging()
        }
        if (ringing && !visible) {
          actions.toggleVisibility()
        }
      }}
      style={{ ...styles }}
    >
      {ringing && (
        <div
          className='nes-balloon from-left'
          style={{
            width: '100%',
            marginLeft: '60px',
          }}
          onClick={() => {
            actions.setCurrentDialog({ name: 'welcomeCall' })
          }}
        >
          <Typist cursor={{ show: false }} avgTypingDelay={50} loop>
            Incoming transmission ...
          </Typist>
        </div>
      )}
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal)

export { reducer }
