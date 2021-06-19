import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import shortid from 'shortid'
import { WindowModal } from '../views/sharedComponents'
import { connectController as wrapGlobalGameActions } from './globalGameActions'

const NewLevel = props => {
  console.log('NewLevel:')
  console.log({ props })
  const { actions } = props

  return (
    <div id='newLevel'>
      <WindowModal
        uniqueWindowId={shortid()}
        initWidth={400}
        initHeight={600}
        initTop={100}
        initLeft={100}
        backgroundPath='./assets/trimmed/window_trimmed.png'
        dragAreaHeightPercent={20}
        onRequestClose={() => console.log('onRequestClose')}
        isOpen
        contentContainerStyle={{ marginTop: '20%', paddingLeft: 20, paddingRight: 20 }}
      >
        <div style={{ color: 'white' }}>
          <p>Lorem Ipsum</p>
          <Button block onClick={() => actions.dialog.continueDialog()}>
            Advance Dialog
          </Button>
        </div>
      </WindowModal>
    </div>
  )
}

export default wrapGlobalGameActions(NewLevel)
