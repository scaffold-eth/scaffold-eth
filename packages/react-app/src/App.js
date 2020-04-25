import React, { useState, useEffect, useRef } from 'react'
import 'antd/dist/antd.css';
//import { gql } from "apollo-boost";
import { ethers } from "ethers";
//import { useQuery } from "@apollo/react-hooks";
import "./App.css";

import { usePoller, useGasPrice, useBalance, useBlockNumber } from "eth-hooks";
import useExchangePrice from './ExchangePrice.js'
import useContractLoader from "./ContractLoader.js";

import Account from './Account.js'

import Transactor from "./Transactor.js"


import SmartContractWallet from './SmartContractWallet.js'

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet","2717afb6bf164045b5d5468031b93f87")
// change your local provider when you deploy with: echo "REACT_APP_PROVIDER=https://SOME_PROD_RPC" > .env
const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER?process.env.REACT_APP_PROVIDER:"http://localhost:8545")


function App() {
  const [account, setAccount] = useState();
  const [injectedProvider, setInjectedProvider] = useState();

  const readContracts = useContractLoader(localProvider);
  const writeContracts = useContractLoader(injectedProvider);

  const tx = Transactor(injectedProvider)

  const gasPrice = useGasPrice()
  const localBalance = useBalance(account,localProvider)
  const price = useExchangePrice(mainnetProvider)




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
          readContracts={readContracts}
          writeContracts={writeContracts}
          injectedProvider={injectedProvider}
          tx={tx}
        />
    </div>
  );
}

export default App;
