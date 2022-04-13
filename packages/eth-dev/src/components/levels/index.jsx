import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { QRPunkBlockie } from '../gameItems/components'

import NotFound from './NotFound'

import { routesList } from '../../routes'

const Levels = props => {
  return (
    <>
      {/* wallet && wallet.address && (
        <div style={{ position: 'absolute', right: 100, top: -100, zIndex: 1 }}>
          <QRPunkBlockie withQr={false} address={wallet && wallet.address} scale={1} />
        </div>
      ) */}

      <BrowserRouter>
        <Switch>
          {routesList.map(route => {
            const { name, path, component } = route
            if (name === 'Intro') {
              return (
                <Route exact path='/'>
                  {component(props)}
                </Route>
              )
            }
            return <Route path={path}>{component(props)}</Route>
          })}

          <Route path='*'>
            <NotFound />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  )
}

export default Levels
