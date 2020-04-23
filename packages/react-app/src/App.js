import React, { useState, useEffect, useRef } from 'react'
import 'antd/dist/antd.css';
//import { gql } from "apollo-boost";
import { ethers } from "ethers";
//import { useQuery } from "@apollo/react-hooks";
import "./App.css";

import { usePoller, useGasPrice, useBalance, useBlockNumber } from "eth-hooks";
import useExchangePrice from './ExchangePrice.js'


import Account from './Account.js'
import ContractLoader from "./ContractLoader.js";
import Transactor from "./Transactor.js"


import SmartContractWallet from './SmartContractWallet.js'

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet","2717afb6bf164045b5d5468031b93f87")
// change your local provider when you deploy with: echo "REACT_APP_PROVIDER=https://SOME_PROD_RPC" > .env
const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER?process.env.REACT_APP_PROVIDER:"http://localhost:8545")


function App() {
  const [account, setAccount] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const [contracts, setContracts] = useState();

  const tx = Transactor(injectedProvider)

  const gasPrice = useGasPrice()
  const localBalance = useBalance(account,localProvider)
  const price = useExchangePrice(mainnetProvider)


  React.useEffect(() => {
    //localProvider.resetEventsBlock(0)
    ContractLoader(localProvider, async (loadedContracts)=>{
      console.log("CONTRACTS ARE READY!",loadedContracts)
      setContracts(loadedContracts)
    })
  },[])

  return (
    <div className="App">
        <Account
          account={account}
          setAccount={setAccount}
          localProvider={localProvider}
          injectedProvider={injectedProvider}
          setInjectedProvider={setInjectedProvider}
        />
        <SmartContractWallet
          contracts={contracts}
          injectedProvider={injectedProvider}
          tx={tx}
        />
    </div>
  );
}

export default App;
