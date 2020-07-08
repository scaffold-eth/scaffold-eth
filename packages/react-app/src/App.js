import React, { useState, useRef, useEffect } from 'react'
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import "./App.css";
import { Row, Col, Tabs } from 'antd';
import { useExchangePrice, useGasPrice, useLocalStorage, useContractLoader } from "./hooks"
import { AdminWidget } from "./components"

import NftyWallet from "./NftyWallet.js"


const mainnetProvider = new ethers.providers.InfuraProvider("mainnet", "2717afb6bf164045b5d5468031b93f87")
const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : "http://localhost:8545")//'https://kovan.infura.io/v3/813ba28a534f416793957d3fe470923c')//

function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider)
  const readContracts = useContractLoader(localProvider);



  return (
    <div className="App">

      <NftyWallet
        address={address}
        setAddress={setAddress}
        localProvider={localProvider}
        injectedProvider={injectedProvider}
        setInjectedProvider={setInjectedProvider}
        mainnetProvider={mainnetProvider}
        price={price}
        minimized={true}
        readContracts={readContracts}
      />

      <AdminWidget
        address={address}
        localProvider={localProvider}
        injectedProvider={injectedProvider}
        mainnetProvider={mainnetProvider}
        price={price}
      />

    </div>
  );
}

export default App;
