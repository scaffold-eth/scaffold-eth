import React, { useEffect } from 'react'
import { Button } from 'antd'
import shortid from 'shortid'
import { Terminal, Wallet as WalletView } from '../gameItems/components'
import WindowModal from '../gameItems/components/WindowModal'
import { connectController as wrapGlobalGameData } from '../gameItems'
import Dialog from './Dialog'

const NewLevel = props => {
  console.log('NewLevel:')
  console.log({ props })
  const { dialog, actions } = props
  console.log({ currentDialogIndex: dialog.currentDialogIndex })

  return (
    <div id='newLevel'>
      <Terminal>
        <Dialog dialog={dialog} actions={actions} />
      </Terminal>

      <WindowModal
        uniqueWindowId={shortid()}
        initWidth={400}
        initHeight={600}
        initTop={100}
        initLeft={100}
        backgroundPath='./assets/trimmed/window_trimmed.png'
        dragAreaHeightPercent={20}
        onRequestClose={() => console.log('onRequestClose')}
        isOpen
        contentContainerStyle={{ marginTop: '20%', paddingLeft: 20, paddingRight: 20 }}
      >
        <div style={{ color: 'white' }}>
          <p>Lorem Ipsum</p>
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
          <Button block onClick={() => console.log('set background')}>
            Set Background
          </Button>
        </div>
      </WindowModal>
    </div>
  )
}

export default wrapGlobalGameData(NewLevel)
