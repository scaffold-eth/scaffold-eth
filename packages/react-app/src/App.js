import React, { useState, useEffect, useRef } from 'react'
import 'antd/dist/antd.css';
//import { gql } from "apollo-boost";
import { ethers } from "ethers";
//import { useQuery } from "@apollo/react-hooks";
import "./App.css";

import { usePoller, useGasPrice, useBalance, useBlockNumber } from "eth-hooks";
import useExchangePrice from './ExchangePrice.js'
import useContractLoader from "./ContractLoader.js";

import Header from "./Header.js"
import Account from './Account.js'
import Provider from './Provider.js'
import Transactor from './Transactor.js'


import SmartContractWallet from './SmartContractWallet.js'

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet","2717afb6bf164045b5d5468031b93f87")
// change your local provider when you deploy with: echo "REACT_APP_PROVIDER=https://SOME_PROD_RPC" > .env
const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER?process.env.REACT_APP_PROVIDER:"http://localhost:8545")


function App() {
  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();

  const readContracts = useContractLoader(localProvider);
  const writeContracts = useContractLoader(injectedProvider);

  const tx = Transactor(injectedProvider)

  const gasPrice = useGasPrice()
  const localBalance = useBalance(address,localProvider)
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
          dollarMultiplier={price}
        />
      </div>

      <div style={{padding:40,textAlign: "left"}}>
        <SmartContractWallet
          readContracts={readContracts}
          writeContracts={writeContracts}
          injectedProvider={injectedProvider}
          dollarMultiplier={price}
          tx={tx}
        />
      </div>

      <div style={{position:'fixed',textAlign:'right',right:0,bottom:20,padding:10}}>
        <Provider
          name={"mainnet"}
          provider={mainnetProvider}
        />
        <Provider
          name={"local"}
          provider={localProvider}
        />
        <Provider
          name={"injected"}
          provider={injectedProvider}
        />
      </div>
    </div>
  );
}

export default App;
