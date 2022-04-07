import React, { useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { connectController as wrapGlobalGameData } from '../gameItems'
import { Background, QRPunkBlockie } from '../gameItems/components'

import NotFound from './NotFound'

import { routesList } from '../../routes'

const Levels = ({ levelContainer: { currentLevel }, globalGameActions, loadWeb3Modal }) => {
  // TODO:
  /*
  const setInitialLevel = levelId => {
    console.log(`setting initial level to: ${levelId}`)
    globalGameActions.level.setCurrentLevel({ levelId })
  }
  */

  // TODO:
  const [wallet, setWallet] = useState()

  return (
    <>
      <Background />

      {wallet && wallet.address && (
        <div style={{ position: 'absolute', right: 100, top: -100, zIndex: 1 }}>
          <QRPunkBlockie withQr={false} address={wallet && wallet.address} scale={1} />
        </div>
      )}

      <BrowserRouter>
        <Switch>
          {routesList.map(route => {
            const { name, path, component } = route
            if (name === 'Intro') {
              return (
                <Route exact path='/'>
                  {component}
                </Route>
              )
            }
            return <Route path={path}>{component}</Route>
          })}

          <Route path='*'>
            <NotFound />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  )
}

export default wrapGlobalGameData(Levels)
