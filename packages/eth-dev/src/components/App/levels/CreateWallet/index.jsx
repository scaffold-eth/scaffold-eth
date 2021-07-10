import React, { useState } from 'react'
import { Background, Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import { Intro, City, CityOutskirts, CitySkylineInsideNight, Workstation } from '../../backgrounds'

const CreateWalletLevel = ({ dialog, actions }) => {
  return (
    <div id='createWalletLevel'>
      <Terminal />
    </div>
  )
}

export default wrapGlobalGameData(CreateWalletLevel)
