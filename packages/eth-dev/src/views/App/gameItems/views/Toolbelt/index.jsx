import React, { useEffect } from 'react'
import $ from 'jquery'
import { connectController } from './controller'

const styles = {
  toolbelt: {
    display: 'none'
  },
  shared: {
    menu: {
      position: 'fixed',
      bottom: 0,
      right: 0,
      height: '100%',
      width: '100%',
      cursor: 'url(https://unpkg.com/nes.css/assets/cursor-click.png), pointer',
      zIndex: 1000
    },
    icon: {
      float: 'left',
      marginRight: '10px',
      cursor: 'url(https://unpkg.com/nes.css/assets/cursor-click.png), pointer',
      zIndex: 1000
    }
  },
  menuBottom: {
    background: 'url(./assets/layers/menu_bottom.png) no-repeat bottom right fixed',
    backgroundSize: 'contain'
  },
  menuRight: {
    background: 'url(./assets/layers/menu_right.png) no-repeat bottom right fixed',
    backgroundSize: 'contain'
  },
  iconContainer: {
    position: 'fixed',
    bottom: '5px',
    height: '75px',
    width: '100%',
    zIndex: 1000
  },
  iconContainerInner: {
    height: '70px',
    width: '500px',
    margin: '0 auto'
  },
  comIcon: {
    height: '68px',
    width: '60px',
    marginLeft: '20px',
    background: 'url(./assets/trimmed/icons/com_icon_trimmed.png) no-repeat bottom left',
    backgroundSize: 'cover'
  },
  terminalIcon: {
    height: '61px',
    width: '78px',
    background: 'url(./assets/trimmed/icons/terminal_icon_trimmed.png) no-repeat bottom left',
    backgroundSize: 'cover'
  },
  walletIcon: {
    height: '60px',
    width: '99px',
    background: 'url(./assets/trimmed/icons/wallet_icon_trimmed.png) no-repeat bottom left',
    backgroundSize: 'cover'
  },
  musicIcon: {
    height: '57px',
    width: '88px',
    background: 'url(./assets/trimmed/icons/music_icon_trimmed.png) no-repeat bottom left',
    backgroundSize: 'cover'
  },
  dishIcon: {
    height: '57px',
    width: '61px',
    background: 'url(./assets/trimmed/icons/dish_icon_trimmed.png) no-repeat bottom left',
    backgroundSize: 'cover'
  }
}

const Toolbelt = ({ visible, actions }) => {
  const setIconHoverEffect = () => {
    $('#toolbelt .iconContainer .icon').hover(
      function () {
        console.log('hover in')
      },
      function () {
        console.log('hover out')
      }
    )
  }

  useEffect(() => {
    setIconHoverEffect()
  }, [])

  useEffect(() => {
    if (visible) {
      console.log('now slide up')
      $('#toolbelt').slideUp('slow')
      $('#toolbelt').show()
    } else {
      console.log('now slide down')
      // $('#toolbelt').slideDown('slow')
    }
  }, [visible])

  return (
    <div id='toolbelt' style={{ ...styles.toolbelt }}>
      <div
        id='menuBottom'
        className='background-image'
        style={{
          ...styles.shared.menu,
          ...styles.menuBottom
        }}
      />
      <div
        id='menuRight'
        className='background-image'
        style={{
          ...styles.shared.menu,
          ...styles.menuRight
        }}
      />
      <div className='iconContainer' style={{ ...styles.iconContainer }}>
        <div style={{ ...styles.iconContainerInner }}>
          <div
            id='comIcon'
            className='icon'
            role='button'
            onClick={() => {
              actions.toggleTerminalVisibility()
            }}
            style={{
              ...styles.shared.icon,
              ...styles.comIcon
            }}
          />
          <div
            id='terminalIcon'
            className='icon'
            role='button'
            onClick={() => {
              console.log('click terminalIcon')
            }}
            style={{
              ...styles.shared.icon,
              ...styles.terminalIcon
            }}
          />
          <div
            id='walletIcon'
            className='icon'
            role='button'
            onClick={() => {
              console.log('click walletIcon')
            }}
            style={{
              ...styles.shared.icon,
              ...styles.walletIcon
            }}
          />
          <div
            id='musicIcon'
            className='icon'
            role='button'
            onClick={() => {
              console.log('click musicIcon')
            }}
            style={{
              ...styles.shared.icon,
              ...styles.musicIcon
            }}
          />
          <div
            id='dishIcon'
            className='icon'
            role='button'
            onClick={() => {
              actions.toggleDishVisibility()
            }}
            style={{
              ...styles.shared.icon,
              ...styles.dishIcon
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default connectController(Toolbelt)
