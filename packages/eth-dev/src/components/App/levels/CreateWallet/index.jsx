import React, { useEffect } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import Dialog from './Dialog'
import { CreateWalletWindow } from './components'

const CreateWalletLevel = ({ dialog, actions }) => {
  useEffect(() => {
    actions.background.setCurrentBackground({ background: 'workstation' })
  }, [])

  return (
    <div id='createWalletLevel'>
      <Terminal>
        <Dialog dialog={dialog} actions={{ ...actions }} />
      </Terminal>
      <CreateWalletWindow />
    </div>
  )
}

export default wrapGlobalGameData(CreateWalletLevel)
