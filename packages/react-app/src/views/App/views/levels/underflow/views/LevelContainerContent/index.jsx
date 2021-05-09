import React from 'react'
import TokenContractWindow from './TokenContractWindow'
import { connectController } from './controller'

const LevelContainerContent = ({ dialogs: { currentDialog, currentDialogIndex }, actions }) => {
  // TODO: move this into redux state and reducer
  // TODO: find better variable name (eg. isAtOrPast)
  let userIsAtCityFundsContractAnchor = false

  // check if the user has gotten to the step in the
  // dialog where 'cityFundsContract' anchorId is present
  currentDialog.map((dialogStep, index) => {
    if (dialogStep.anchorId === 'cityFundsContract' && currentDialogIndex >= index) {
      userIsAtCityFundsContractAnchor = true
    }
  })

  return <>{userIsAtCityFundsContractAnchor && <TokenContractWindow />}</>
}

export default connectController(LevelContainerContent)
