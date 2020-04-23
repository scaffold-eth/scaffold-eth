import React, { useState, useEffect, useRef } from 'react'
import 'antd/dist/antd.css';
//import { gql } from "apollo-boost";
import { ethers } from "ethers";
//import { useQuery } from "@apollo/react-hooks";
import "./App.css";

import { usePoller, useGasPrice, useUserProvider, useBalance, useBlockNumber } from "eth-hooks";
import useExchangePrice from './ExchangePrice.js'

import { Button, notification } from 'antd';

import Account from './Account.js'
import ContractLoader from "./ContractLoader.js";
import Notify from './Notify.js'

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet","2717afb6bf164045b5d5468031b93f87")
// change your local provider when you deploy with: echo "REACT_APP_PROVIDER=https://SOME_PROD_RPC" > .env
const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER?process.env.REACT_APP_PROVIDER:"http://localhost:8545")

function App() {
  const [account, setAccount] = useState();
  const [injectedProvider, setInjectedProvider] = useState();

  const gasPrice = useGasPrice()
  //const [account, userProvider] = useUserProvider(localProvider,mainnetProvider)
  const localBalance = useBalance(account,localProvider)
  const price = useExchangePrice(mainnetProvider)

  const [contracts, setContracts] = useState();
  React.useEffect(() => {
    //localProvider.resetEventsBlock(0)
    ContractLoader(localProvider, async (loadedContracts)=>{
      console.log("CONTRACTS ARE READY!",loadedContracts)
      setContracts(loadedContracts)
      // listen to events after contracts are loaded
      //listenForEvents(loadedContracts)
    })
  },[])

  const [purpose, setPurpose] = useState();
  const loadPurpose = async ()=>{
      if(contracts){
        let newPurpose = await contracts.SmartContractWallet.purpose()
        if(newPurpose!=purpose){
          console.log("purpose: ",purpose)
          setPurpose(newPurpose)
        }
      }
  }
  usePoller(loadPurpose,3333)

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
        {localBalance}
        <Button onClick={async ()=>{
          let signer = injectedProvider.getSigner()

          let tx = {
              to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
              value: ethers.utils.parseEther('0.01')
          };

          try{
            let result = await signer.sendTransaction(tx);
            console.log(result)
            const { emitter } = Notify.hash(result.hash)
            emitter.on('all', (transaction) => {
              return {
                onclick: () =>
                   window.open(etherscanTxUrl+transaction.hash),
                }
            })
          }catch(e){
            console.log(e)
            notification['error']({
               message: 'Transaction Error',
               description: e.message
             });
          }


        }}>
          do something cool
        </Button>
    </div>
  );
}

export default App;
