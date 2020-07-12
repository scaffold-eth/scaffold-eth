import React, { useState } from 'react'
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import "./App.css";
import { useExchangePrice, useContractLoader } from "./hooks"
import { AdminWidget } from "./components"

import NftyWallet from "./NftyWallet.js"


const mainnetProvider = new ethers.providers.InfuraProvider("mainnet", "9ea7e149b122423991f56257b882261c")
const localProvider = new ethers.providers.InfuraProvider("rinkeby", "9ea7e149b122423991f56257b882261c")
//const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : "http://localhost:8545")//'https://kovan.infura.io/v3/813ba28a534f416793957d3fe470923c')//

//let relayHubAddress = require('./gsn/RelayHub.json').address
//let stakeManagerAddress = require('./gsn/StakeManager.json').address
//let paymasterAddress = require('./gsn/Paymaster.json').address

function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const [metaProvider, setMetaProvider] = useState();
  const price = useExchangePrice(mainnetProvider)
  const readContracts = useContractLoader(localProvider);

  const gsnConfig = {} //relayHubAddress, stakeManagerAddress, paymasterAddress}


  return (
    <div className="App">

      {<div style={{backgroundColor:"#FFFAB2",color:"#FFFFFF",position:"absolute",left:0,top:0,width:"100%",fontSize:32,textAlign:"left",paddingLeft:32,opacity:0.777,filter:"blur(0.5px)"}}>
        rinkeby
      </div>}


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
        setMetaProvider={setMetaProvider}
        metaProvider={metaProvider}
        gsnConfig={gsnConfig}
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
