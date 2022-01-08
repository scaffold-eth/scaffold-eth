import React, { useState, useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'

import { ExampleGameActionsWindow, GenerateWallet } from './components'
import Dialog from './Dialog'

const CityAtWar = ({ dialog, actions }) => {
  useEffect(() => {
    actions.background.setCurrentBackground({ background: 'cityAtWar' })
  }, [])

  const [walletGeneratorVisibility, setWalletGeneratorVisibility] = useState(false)
  const [sessionKey, setSessionKey] = useState(true)

  const allActions = {
    ...actions,
    setSessionKey,
    setWalletGeneratorVisibility
  }

  return (
    <div id='cityAtWar'>
      <Terminal>
        <Dialog dialog={dialog} actions={allActions} />
      </Terminal>

      <ExampleGameActionsWindow isOpen={false} />

      <GenerateWallet isOpen={walletGeneratorVisibility} actions={allActions} dialog={dialog} />
    </div>
  )
}

export default wrapGlobalGameData(CityAtWar)
