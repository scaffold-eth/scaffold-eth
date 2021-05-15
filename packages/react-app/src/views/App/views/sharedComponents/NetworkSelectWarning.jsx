import React from 'react'
import { Button, Alert } from 'antd'
import { getNetworkByChainId } from '../../../../constants'

const NetworkSelectWarning = ({ targetNetwork, selectedChainId, localChainId }) => {
  const selectedNetwork = getNetworkByChainId(selectedChainId)

  if (selectedNetwork && localChainId && selectedChainId && localChainId !== selectedChainId) {
    return (
      <div style={{ zIndex: 2, position: 'absolute', right: 0, top: 120, padding: 8 }}>
        <Alert
          message='⚠️ Wrong Network selected in Metamask'
          description={
            <div>
              You have <b>{selectedNetwork.name}</b> selected and you need to be on{' '}
              <Button
                onClick={async () => {
                  const ethereum = window.ethereum
                  const data = [
                    {
                      chainId: '0x' + targetNetwork.chainId.toString(16),
                      chainName: targetNetwork.name,
                      nativeCurrency: targetNetwork.nativeCurrency,
                      rpcUrls: [targetNetwork.rpcUrl],
                      blockExplorerUrls: [targetNetwork.blockExplorer]
                    }
                  ]
                  console.log('data', data)
                  const tx = await ethereum
                    .request({ method: 'wallet_addEthereumChain', params: data })
                    .catch()
                  if (tx) console.log(tx)
                }}
              >
                {getNetworkByChainId(localChainId).name}
              </Button>
              .
            </div>
          }
          type='error'
          closable={false}
        />
      </div>
    )
  }
  return <></>
}

export default NetworkSelectWarning
