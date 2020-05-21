import React, { useState } from 'react'
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import "./App.css";
import { Row, Col } from 'antd';
import { useExchangePrice } from "./hooks"
import { Header, Account, Provider, Faucet, Ramp } from "./components"

import Vote from './Vote.js'
import TimeReport from './TimeReport.js'
import VoteReport from './VoteReport.js'

/// CHANGE THIS TO YOUR INFURA ID 
const mainnetProvider = new ethers.providers.InfuraProvider("mainnet","2717afb6bf164045b5d5468031b93f87")
const localProvider = mainnetProvider//new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER?process.env.REACT_APP_PROVIDER:"http://localhost:8545")

function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider)

  return (
    <div className="App">
      <Header />
      <div style={{position:'fixed',textAlign:'right',right:0,top:0,padding:10}}>
        <Account
          address={address}
          setAddress={setAddress}
          localProvider={localProvider}
          injectedProvider={injectedProvider}
          setInjectedProvider={setInjectedProvider}
          mainnetProvider={mainnetProvider}
          price={price}
        />
      </div>
      <div style={{padding:40,textAlign: "left"}}>
        <Vote
          address={address}
          injectedProvider={injectedProvider}
          localProvider={localProvider}
        />
        <div style={{display:"none"}}>
          <TimeReport
            mainnetProvider={mainnetProvider}
          />
          <VoteReport />
        </div>
      </div>
    </div>
  );
}

export default App;
