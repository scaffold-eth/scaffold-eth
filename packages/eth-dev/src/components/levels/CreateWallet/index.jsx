import React, { useEffect, useState } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import dialogArray from './dialog/dialogArray'
import { CreateWalletWindow } from './components'

const CreateWalletLevel = ({ dialog, actions }) => {
  useEffect(() => {
    // set background
    actions.background.setCurrentBackground({ background: 'workstation' })
    // set dialog
    actions.dialog.initDialog({
      initialDialogPathId: 'create-wallet/start',
      currentDialog: dialogArray
    })
  }, [])

  const [createWalletWindowVisible, setCreateWalletWindowVisibility] = useState(false)

  return (
    <div id='createWalletLevel'>
      <Terminal
        isOpen
        globalGameActions={actions}
        setCreateWalletWindowVisibility={setCreateWalletWindowVisibility}
      />

      <CreateWalletWindow isOpen={createWalletWindowVisible} />
    </div>
  )
}

export default wrapGlobalGameData(CreateWalletLevel)
