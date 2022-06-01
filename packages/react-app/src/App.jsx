import 'antd/dist/antd.css'
import React, { useEffect, useState, useCallback } from 'react'
import {
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import { NETWORKS } from "./constants";
import { Layout } from './components'
import { BrowseBadges } from './views'
import {
  Account,
} from "./components";
const { ethers } = require('ethers')

function App(props) {
  const [loaded, setLoaded] = useState(false)
  const [localProvider, setLocalProvider] = useState(null)
  const [mainnet, setMainnet] = useState(null)
  const [injectedProvider, setInjectedProvider] = useState()
  const [address, setAddress] = useState('');
  const [connectedAddress, setConnectedAddress] = useState();

  const targetNetwork = NETWORKS['optimism']
  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnet)
  
  const USE_BURNER_WALLET = false
  
  /* SETUP METAMASK */

   // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
   const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
   const userSigner = userProviderAndSigner.signer;
 
   useEffect(() => {
     async function getAddress() {
       if (userSigner) {
         const newAddress = await userSigner.getAddress();
         setConnectedAddress(newAddress);
         console.log(newAddress)
       }
     }
     getAddress();
   }, [userSigner]);

  const logoutOfWeb3Modal = async () => {
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect()
    }
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }

  const loadWeb3Modal = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      console.log('MetaMask is not installed!');
      // metamask not installed
      return
    }
    const provider = window.ethereum
    window.ethereum.request({ method: 'eth_requestAccounts' })

    setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(window.ethereum));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider])

  /* END - SETUP METAMASK */

  /* SETUP MAINNET & OPTIMISM provider */

  useEffect(() => {
    const run = async () => {
      const localProvider = new ethers.providers.StaticJsonRpcProvider('https://mainnet.optimism.io')

      await localProvider.ready

      const mainnet = new ethers.providers.StaticJsonRpcProvider(
        'https://mainnet.infura.io/v3/1b3241e53c8d422aab3c7c0e4101de9c',
      )

      setLocalProvider(localProvider)
      setMainnet(mainnet)
      setLoaded(true)
    }
    run()
  }, [])

  /* END - SETUP MAINNET & OPTIMISM provider */  

  return (
    <div className="App">
      <Layout>
        {loaded && (
          <BrowseBadges
            address={address}
            connectedAddress={connectedAddress}
            injectedProvider={injectedProvider}
            setAddress={setAddress}
            localProvider={localProvider}
            mainnet={mainnet}
            selectedChainId={10}
            {...props}
            wallet={<Account
              useBurner={USE_BURNER_WALLET}
              address={connectedAddress}
              localProvider={localProvider}
              userSigner={userSigner}
              mainnetProvider={mainnet}
              price={price}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={targetNetwork.blockExplorer}
            />}
          />
        )}
      </Layout>
    </div>
  )
}

export default App
