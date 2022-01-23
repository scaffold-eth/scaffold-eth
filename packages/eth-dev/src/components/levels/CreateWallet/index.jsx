import React, { useEffect, useState } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import dialogArray from './dialog'
import { DetailsOnWalletsWindow, CreateWalletWindow } from './components'

const CreateWalletLevel = ({ dialog, actions }) => {
  useEffect(() => {
    // set initial level background
    actions.background.setCurrentBackground({ background: 'city' })
    // set dialog
    actions.dialog.initDialog({
      initialDialogPathId: 'create-wallet/start',
      currentDialog: dialogArray
    })
  }, [])

  const [createWalletWindowVisible, setCreateWalletWindowVisibility] = useState(false)
  const [detailsOnWalletsWindowVisible, setDetailsOnWalletsWindowVisibility] = useState(false)

  return (
    <div id='createWalletLevel'>
      <Terminal
        isOpen
        globalGameActions={actions}
        setCreateWalletWindowVisibility={setCreateWalletWindowVisibility}
        setDetailsOnWalletsWindowVisibility={setDetailsOnWalletsWindowVisibility}
      />

      <DetailsOnWalletsWindow isOpen={detailsOnWalletsWindowVisible} />
      <CreateWalletWindow isOpen={createWalletWindowVisible} />
    </div>
  )
}

export default wrapGlobalGameData(CreateWalletLevel)
