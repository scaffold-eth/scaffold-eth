import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { InitChainInstructionsWindow, ExampleGameActionsWindow, GenerateWallet } from './components'
import Dialog from './Dialog'

const SetupLocalNetworkLevel = ({ dialog, actions }) => {
  useEffect(() => {
    actions.background.setCurrentBackground({ background: 'city' })
  }, [])

  const [initialInstructionsWindowVisible, setInitChainInstructionsWindowVisibility] = useState(false)
  const [walletGeneratorVisibility, setWalletGeneratorVisibility] = useState(false)
  const [sessionKey, setSessionKey] = useState(true)

  const allActions = {
    ...actions,
    setSessionKey,
    setInitChainInstructionsWindowVisibility,
    setWalletGeneratorVisibility
  }

  return (
    <div id='setupLocalNetworkLevel'>
      <Terminal>
        <Dialog
          dialog={dialog}
          actions={allActions}
        />
      </Terminal>

      <InitChainInstructionsWindow isOpen={initialInstructionsWindowVisible} />

      <ExampleGameActionsWindow isOpen={false} />


      <GenerateWallet
        isOpen={walletGeneratorVisibility}
        actions={allActions}
        dialog={dialog}
      />


    </div>
  )
}

export default wrapGlobalGameData(SetupLocalNetworkLevel)
