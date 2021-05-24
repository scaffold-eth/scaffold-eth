import React from 'react'
import { connectController } from './controller'

const LevelContainerContent = ({ dialogs: { currentDialog, currentDialogIndex }, actions }) => {
  return (
    <>
      <h1>Intro</h1>
      <div>test 1</div>
      <div>test 1</div>
    </>
  )
}

export default connectController(LevelContainerContent)
