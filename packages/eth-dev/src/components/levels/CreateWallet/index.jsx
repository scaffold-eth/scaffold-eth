import React, { useEffect, useState } from 'react'
import { Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import levelDialog from './dialog'
import { DetailsOnWalletsWindow, CreateWalletWindow } from './components'

export const LEVEL_ID = 'CreateWallet'

const CreateWalletLevel = ({ dialog, globalGameActions }) => {
  useEffect(() => {
    // set initial level background
    globalGameActions.background.setCurrentBackground({ background: 'City' })
    // set dialog
    globalGameActions.dialog.initDialog({
      initialDialogPathId: `${LEVEL_ID}/Start`,
      currentDialog: levelDialog
    })
  }, [])

  const [createWalletWindowVisible, setCreateWalletWindowVisibility] = useState(false)
  const [detailsOnWalletsWindowVisible, setDetailsOnWalletsWindowVisibility] = useState(false)

  return (
    <div id='createWalletLevel'>
      <Terminal
        isOpen
        globalGameActions={globalGameActions}
        setCreateWalletWindowVisibility={setCreateWalletWindowVisibility}
        setDetailsOnWalletsWindowVisibility={setDetailsOnWalletsWindowVisibility}
      />

      <DetailsOnWalletsWindow isOpen={detailsOnWalletsWindowVisible} />
      <CreateWalletWindow isOpen={createWalletWindowVisible} />
    </div>
  )
}

export default wrapGlobalGameData(CreateWalletLevel)
