import React from 'react'

import { connectController as wrapGlobalGameData } from '../../../gameItems'
import { Button, WindowModal } from '../../../gameItems/components'

const ExampleGameActionsWindow = ({ actions, isOpen }) => {

  const backgrounds = ['intro', 'city', 'cityOutskirts', 'citySkylineInsideNight', 'workstation']

  return (
    <WindowModal
      initTop={
        "90%"
      }
      initLeft={0}
      initHeight={450}
      initWidth={312}
      backgroundPath='./assets/trimmed/window_trimmed.png'
      dragAreaHeightPercent={20}
      onRequestClose={() => console.log('onRequestClose')}
      isOpen={isOpen}
      contentContainerStyle={{ marginTop: '20%', paddingLeft: 20, paddingRight: 20 }}
    >
      <div style={{ color: 'white' }}>
        <p style={{ fontSize: 11, textAlign: 'center' }}>Available Game Actions</p>
        <Button block onClick={() => actions.dialog.continueDialog()}>
          Advance Dialog
        </Button>
        <Button block onClick={() => actions.wallet.showWallet()}>
          Show Wallet
        </Button>
        <Button block onClick={() => actions.wallet.hideWallet()}>
          Hide Wallet
        </Button>
        <Button block onClick={() => actions.wallet.toggleWalletVisibility()}>
          Toggle Wallet
        </Button>
        <Button block onClick={() => actions.terminal.showTerminal()}>
          Show Terminal
        </Button>
        <Button block onClick={() => actions.terminal.hideTerminal()}>
          Hide Terminal
        </Button>
        <Button block onClick={() => actions.terminal.toggleTerminalVisibility()}>
          Toggle Terminal
        </Button>
        <Button
          block
          onClick={() =>
            actions.background.setCurrentBackground({
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
