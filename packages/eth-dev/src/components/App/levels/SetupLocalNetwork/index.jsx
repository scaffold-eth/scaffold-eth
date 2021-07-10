import React, { useState } from 'react'
import { Background, Terminal } from '../../gameItems/components'
import { connectController as wrapGlobalGameData } from '../../gameItems'
import { Intro, City, CityOutskirts, CitySkylineInsideNight, Workstation } from '../../backgrounds'

import { InitChainInstructionsWindow, ExampleGameActionsWindow } from './components'
import Dialog from './Dialog'

const SetupLocalNetworkLevel = ({ dialog, actions }) => {
  // ----------------------------------------
  const [background, setBackground] = useState('citySkylineInsideNight')
  const [
    initialInstructionsWindowVisible,
    setInitChainInstructionsWindowVisibility
  ] = useState(false)

  const backgroundStrings = [
    'intro',
    'city',
    'cityOutskirts',
    'citySkylineInsideNight',
    'workstation'
  ]

  let backgroundComp
  if (background === 'intro') {
    backgroundComp = <Intro />
  } else if (background === 'city') {
    backgroundComp = <City />
  } else if (background === 'cityOutskirts') {
    backgroundComp = <CityOutskirts />
  } else if (background === 'citySkylineInsideNight') {
    backgroundComp = <CitySkylineInsideNight />
  } else if (background === 'workstation') {
    backgroundComp = <Workstation />
  }

  const getRandomBackground = () => {
    return backgroundStrings[Math.floor(Math.random() * backgroundStrings.length)]
  }
  // ----------------------------------------

  return (
    <div id='setupLocalNetworkLevel'>
      <Background>{backgroundComp}</Background>

      <Terminal>
        <Dialog
          dialog={dialog}
          actions={{ ...actions, setInitChainInstructionsWindowVisibility }}
        />
      </Terminal>

      <InitChainInstructionsWindow isOpen={initialInstructionsWindowVisible} />

      <ExampleGameActionsWindow
        setBackground={setBackground}
        getRandomBackground={getRandomBackground}
      />
    </div>
  )
}

export default wrapGlobalGameData(SetupLocalNetworkLevel)
