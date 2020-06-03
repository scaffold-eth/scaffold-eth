import React, { useState, useMemo, useEffect } from 'react'
import 'antd/dist/antd.css';
//import { gql } from "apollo-boost";
import { ethers } from "ethers";
//import { useQuery } from "@apollo/react-hooks";
import "./App.css";
import { Row, Col } from 'antd';
import { useExchangePrice, useGasPrice, useContractLoader } from "./hooks"
import { Header, Account, Provider, Faucet, Ramp, TokenBalance } from "./components"

import DEX from './DEX.js'

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet","2717afb6bf164045b5d5468031b93f87")
const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER?process.env.REACT_APP_PROVIDER:"http://localhost:8545")

function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider)
  const gasPrice = useGasPrice("fast")
  const readContracts = useContractLoader(localProvider);

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
          readContracts={readContracts}
          price={price}
        />
        <TokenBalance name={"Balloons"} img={"🎈"} address={address} contracts={readContracts} />
      </div>

      <DEX
        address={address}
        injectedProvider={injectedProvider}
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        readContracts={readContracts}
        price={price}
      />

      <div style={{position:'fixed',textAlign:'right',right:0,bottom:20,padding:10}}>
        <Row align="middle" gutter={4}>
          <Col span={10}>
            <Provider name={"mainnet"} provider={mainnetProvider} />
          </Col>
          <Col span={6}>
            <Provider name={"local"} provider={localProvider} />
          </Col>
          <Col span={8}>
            <Provider name={"injected"} provider={injectedProvider} />
          </Col>
        </Row>
      </div>
      <div style={{position:'fixed',textAlign:'left',left:0,bottom:20,padding:10}}>
        <Row align="middle" gutter={4}>
          <Col span={9}>
            <Ramp
              price={price}
              address={address}
            />
          </Col>
          <Col span={15}>
            <Faucet
              localProvider={localProvider}
              dollarMultiplier={price}
            />
          </Col>
        </Row>
      </div>

    </div>
  );
}

export default App;
