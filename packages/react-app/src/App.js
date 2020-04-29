import React, { useState, useEffect, useRef } from 'react'
import 'antd/dist/antd.css';
//import { gql } from "apollo-boost";
import { ethers } from "ethers";
//import { useQuery } from "@apollo/react-hooks";
import "./App.css";

import { usePoller, useGasPrice, useBalance, useBlockNumber, useExchangePrice, useContractLoader } from "./hooks"
import { Header, Account, Provider, Transactor, Address, Balance } from "./components"

import SmartContractWallet from './SmartContractWallet.js'

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet","2717afb6bf164045b5d5468031b93f87")
// change your local provider when you deploy with: echo "REACT_APP_PROVIDER=https://SOME_PROD_RPC" > .env
const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER?process.env.REACT_APP_PROVIDER:"http://localhost:8545")


function App() {
  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider)

  const readContracts = useContractLoader(localProvider);
  const writeContracts = useContractLoader(injectedProvider);

  const tx = Transactor(injectedProvider)

  const gasPrice = useGasPrice()
  const localBalance = useBalance(address,localProvider)


  return (
    <div className="App">

      <div style={{position:'fixed',textAlign:'right',right:0,top:0,padding:10}}>
        <Account
          address={address}
          setAddress={setAddress}
          localProvider={localProvider}
          injectedProvider={injectedProvider}
          setInjectedProvider={setInjectedProvider}
          mainnetProvider={mainnetProvider}
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
        <div style={{padding:8}}>
          <Provider name={"mainnet"} provider={mainnetProvider} />
        </div>
        <div style={{padding:8}}>
          <Provider name={"local"} provider={localProvider} />
        </div>
        <div style={{padding:8}}>
          <Provider name={"injected"} provider={injectedProvider} />
        </div>
      </div>


    </div>
  );
}

export default App;
/*


<div style={{position:'absolute',left:50,top:50}}>
  <Balance
    address={address}
    provider={injectedProvider}
    dollarMultiplier={price}
  />
</div>




<div style={{position:'absolute',left:50,top:50}}>

  <Address value={address} />

</div>

<div style={{position:'absolute',left:50,top:100}}>

  <Address value={address} size="short" />

</div>

<div style={{position:'absolute',left:50,top:150}}>

  <Address value={address} size="long" blockexplorer="https://blockscout.com/poa/xdai/address/"/>

</div>
<div style={{position:'absolute',left:50,top:200}}>

  <Address value={address} ensProvider={mainnetProvider}/>

</div>

      <Header />

*/
