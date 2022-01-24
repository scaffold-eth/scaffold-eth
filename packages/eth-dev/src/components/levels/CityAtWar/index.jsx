import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { ExampleGameActionsWindow, GenerateWallet } from './components'
import levelDialog from './dialog'

export const LEVEL_ID = 'CityAtWar'

const CityAtWar = ({ dialog, globalGameActions }) => {
  useEffect(() => {
    // set initial level background
    globalGameActions.background.setCurrentBackground({ background: 'CityChaos' })
    // set dialog
    globalGameActions.dialog.initDialog({
      initialDialogPathId: `${LEVEL_ID}/Start`,
      currentDialog: levelDialog
    })
  }, [])

  const [walletGeneratorVisibility, setWalletGeneratorVisibility] = useState(false)

  return (
    <div id='cityAtWar'>
      <Terminal
        isOpen
        globalGameActions={globalGameActions}
        setWalletGeneratorVisibility={setWalletGeneratorVisibility}
      />

      <ExampleGameActionsWindow isOpen={false} />

      <GenerateWallet isOpen={walletGeneratorVisibility} globalGameActions={globalGameActions} />
    </div>
  )
}

export default wrapGlobalGameData(CityAtWar)
