import React from 'react'

import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { Button, WindowModal } from '../../../gameItems/components'

const ExampleGameActionsWindow = ({ globalGameActions, isOpen }) => {
  const backgrounds = ['Intro', 'City', 'CityOutskirts', 'CitySkylineInsideNight', 'Workstation']

  return (
    <WindowModal
      initTop={50}
      initLeft={0}
      initHeight={250}
      initWidth={312}
      backgroundPath='./assets/items/window.png'
      dragAreaHeightPercent={20}
      onRequestClose={() => console.log('onRequestClose')}
      isOpen={isOpen}
      contentContainerStyle={{ marginTop: '20%', paddingLeft: 20, paddingRight: 20 }}
    >
      <div style={{ color: 'white' }}>
        <p style={{ fontSize: 11, textAlign: 'center' }}>Global Game Actions</p>
        <Button block onClick={() => globalGameActions.dialog.continueDialog()}>
          Advance Dialog
        </Button>
        <Button block onClick={() => globalGameActions.wallet.showWallet()}>
          Show Wallet
        </Button>
        <Button block onClick={() => globalGameActions.wallet.hideWallet()}>
          Hide Wallet
        </Button>
        <Button block onClick={() => globalGameActions.wallet.toggleWalletVisibility()}>
          Toggle Wallet
        </Button>
        <Button block onClick={() => globalGameActions.terminal.showTerminal()}>
          Show Terminal
        </Button>
        <Button block onClick={() => globalGameActions.terminal.hideTerminal()}>
          Hide Terminal
        </Button>
        <Button block onClick={() => globalGameActions.terminal.toggleTerminalVisibility()}>
          Toggle Terminal
        </Button>
        <Button
          block
          onClick={() =>
            globalGameActions.background.setCurrentBackground({
              background: backgrounds[Math.floor(Math.random() * backgrounds.length)]
            })
          }
        >
          Change Background
        </Button>
      </div>
    </WindowModal>
  )
}

export default wrapGlobalGameData(ExampleGameActionsWindow)
