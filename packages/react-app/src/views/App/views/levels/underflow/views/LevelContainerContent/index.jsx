import React from 'react'
import TokenContractWindow from './TokenContractWindow'
import { connectController } from './controller'

const LevelContainerContent = ({ terminalContent }) => {
  const { currentDialogIndex, dialog } = terminalContent

  let userIsAtCityFundsContractAnchor = false

  // check if the user has gotten to the step in the
  // dialog where 'cityFundsContract' anchorId is present
  dialog.map((dialogStep, index) => {
    if (dialogStep.anchorId === 'cityFundsContract' && currentDialogIndex >= index) {
      userIsAtCityFundsContractAnchor = true
    }
  })

  return <>{userIsAtCityFundsContractAnchor && <TokenContractWindow />}</>
}

export default connectController(LevelContainerContent)
