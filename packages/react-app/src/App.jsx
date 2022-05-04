import 'antd/dist/antd.css'
import React, { useEffect, useState } from 'react'
import './App.css'
import { BrowseBadges } from './views'
const { ethers } = require('ethers')

function App(props) {
  const [loaded, setLoaded] = useState(false)
  const [localProvider, setLocalProvider] = useState(null)
  const [mainnet, setMainnet] = useState(null)

  useEffect(() => {
    const run = async () => {
      const localProvider = new ethers.providers.StaticJsonRpcProvider('https://mainnet.optimism.io')

      await localProvider.ready

      const mainnet = new ethers.providers.StaticJsonRpcProvider(
        'https://mainnet.infura.io/v3/1b3241e53c8d422aab3c7c0e4101de9c',
      )

      await mainnet.ready

      setLocalProvider(localProvider)
      setMainnet(mainnet)
      setLoaded(true)
    }
    run()
  }, [])

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      {loaded && <BrowseBadges localProvider={localProvider} mainnet={mainnet} selectedChainId={10} />}
    </div>
  )
}

export default App
