import Safe, { EthersAdapter, SafeFactory } from '@gnosis.pm/safe-core-sdk'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const useSafeSdk = (userSigner, safeAddress) => {
  const [safeSdk, setSafeSdk] = useState()
  const [safeFactory, setSafeFactory] = useState()

  useEffect(() => {
    let isCurrent = true

    const updateSafeSdk = async () => {
      if (!userSigner) return
      try {
        const ethAdapter = new EthersAdapter({ ethers, signer: userSigner })
        const factory = await SafeFactory.create({ ethAdapter })
        setSafeFactory(factory)
        if (!safeAddress) return
        /*
        // If the Safe contracts are not deployed in the current network, you can deploy them and pass the addresses to the SDK:
        const id = await ethAdapter.getChainId()
        const contractNetworks = {
          [id]: {
            multiSendAddress: <MULTI_SEND_ADDRESS>,
            safeMasterCopyAddress: <MASTER_COPY_ADDRESS>,
            safeProxyFactoryAddress: <PROXY_FACTORY_ADDRESS>
          }
        }
        */
        const safeSdk = await Safe.create({ ethAdapter, safeAddress /*, contractNetworks*/ })
        if (isCurrent) {
          setSafeSdk(safeSdk)
        }
      } catch (error) {
        console.error(error)
      }
    }

    updateSafeSdk()

    return () => {
      isCurrent = false
    }
  }, [userSigner, safeAddress])

  return { safeSdk, safeFactory }
}

export default useSafeSdk
