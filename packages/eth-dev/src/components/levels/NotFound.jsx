import React from 'react'
import { connectController as wrapGlobalGameData } from '../gameItems'

const NotFound = ({ dialog, globalGameActions }) => {
  return (
    <div id='upgradeableContracts' style={{ textAlign: 'center' }}>
      <h1 style={{ marginTop: '25%' }}>404 - Not Found</h1>
    </div>
  )
}

export default wrapGlobalGameData(NotFound)
