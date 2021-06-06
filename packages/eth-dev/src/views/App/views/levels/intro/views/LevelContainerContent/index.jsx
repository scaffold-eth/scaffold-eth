import React from 'react'
import { connectController } from './controller'
import CreateWalletWindow from './CreateWalletWindow'

const LevelContainerContent = ({ dialogs: { currentDialog, currentDialogIndex }, actions }) => {
  return (
    <>
      <CreateWalletWindow />
    </>
  )
}

export default connectController(LevelContainerContent)
