import React, { useState, useEffect, useRef } from 'react'
import 'antd/dist/antd.css';
//import { gql } from "apollo-boost";
import { ethers } from "ethers";
//import { useQuery } from "@apollo/react-hooks";
import "./App.css";

import { usePoller, useGasPrice, useBalance, useBlockNumber } from "eth-hooks";
import useExchangePrice from './ExchangePrice.js'

import { Button, notification } from 'antd';

import Account from './Account.js'
import ContractLoader from "./ContractLoader.js";
import Notify from './Notify.js'

import SmartContractWallet from './SmartContractWallet.js'

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet","2717afb6bf164045b5d5468031b93f87")
// change your local provider when you deploy with: echo "REACT_APP_PROVIDER=https://SOME_PROD_RPC" > .env
const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER?process.env.REACT_APP_PROVIDER:"http://localhost:8545")


function App() {
  const [account, setAccount] = useState();
  const [injectedProvider, setInjectedProvider] = useState();

  const gasPrice = useGasPrice()

  const localBalance = useBalance(account,localProvider)
  const price = useExchangePrice(mainnetProvider)

  const [contracts, setContracts] = useState();
  React.useEffect(() => {
    //localProvider.resetEventsBlock(0)
    ContractLoader(localProvider, async (loadedContracts)=>{
      console.log("CONTRACTS ARE READY!",loadedContracts)
      setContracts(loadedContracts)
    })
  },[])

  const etherscanTxUrl = "https://ropsten.etherscan.io/tx/"

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
        />
    </div>
  );
}

export default App;
