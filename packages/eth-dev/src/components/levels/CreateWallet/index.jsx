import React, { useEffect, useState } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import Dialog from './Dialog'
import { CreateWalletWindow } from './components'

const CreateWalletLevel = ({ dialog, actions }) => {
  useEffect(() => {
    actions.background.setCurrentBackground({ background: 'workstation' })
  }, [])

  const [createWalletWindowVisible, setCreateWalletWindowVisibility] = useState(false)

  return (
    <div id='createWalletLevel'>
      <Terminal>
        <Dialog dialog={dialog} actions={{ ...actions, setCreateWalletWindowVisibility }} />
      </Terminal>
      <CreateWalletWindow isOpen={createWalletWindowVisible} />
    </div>
  )
}

export default wrapGlobalGameData(CreateWalletLevel)
