import React, { useState } from 'react'
import { Background, Terminal } from '../gameItems/components'
import { connectController as wrapGlobalGameData } from '../gameItems'
import { Intro, City, CityOutskirts, CitySkylineInsideNight, Workstation } from '../backgrounds'

import { InitialInstructionsWindow, ExampleGameActionsWindow } from './components'
import Dialog from './Dialog'

const NewLevel = ({ dialog, actions }) => {
  // ----------------------------------------
  const [background, setBackground] = useState('citySkylineInsideNight')
  const [initialInstructionsWindowVisible, setInitialInstructionsWindowVisibility] = useState(false)

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
    <div id='newLevel'>
      <Background>{backgroundComp}</Background>

      <Terminal>
        <Dialog dialog={dialog} actions={{ ...actions, setInitialInstructionsWindowVisibility }} />
      </Terminal>

      <InitialInstructionsWindow isOpen={initialInstructionsWindowVisible} />

      <ExampleGameActionsWindow
        setBackground={setBackground}
        getRandomBackground={getRandomBackground}
      />
    </div>
  )
}

export default wrapGlobalGameData(NewLevel)
