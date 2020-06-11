import React, { useState } from 'react'
import 'antd/dist/antd.css';
//import { gql } from "apollo-boost";
import { ethers } from "ethers";
//import { useQuery } from "@apollo/react-hooks";
import "./App.css";
import { Row, Col } from 'antd';
import { useExchangePrice, useGasPrice, useContractLoader, useCustomContractLoader, useCustomContractReader } from "./hooks"
import { Header, Account, Provider, Faucet, Ramp, Contract, TokenBalance, Balance } from "./components"
import DEX from "./DEX.js"
import AMB from "./AMB.js"

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet","2717afb6bf164045b5d5468031b93f87")
const localProvider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/e59c464c322f47e2963f5f00638be2f8")
const xdaiProvider = new ethers.providers.JsonRpcProvider("https://dai.poa.network")

function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider)
  const gasPrice = useGasPrice("fast")
  const readContracts = useContractLoader(localProvider);

  const moonContract = useCustomContractLoader(injectedProvider,"Balloons","0xDF82c9014F127243CE1305DFE54151647d74B27A")
  const moonbalance = useCustomContractReader(moonContract,"balanceOf",[address])

  const xmoonContract = useCustomContractLoader(injectedProvider,"Balloons","0xC5C35D01B20f8d5cb65C60f02113EF6cd8e79910")
  const xmoonbalance = useCustomContractReader(xmoonContract,"balanceOf",[address])

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
        <TokenBalance name={"MOON"} img={"🌘"} address={address} balance={moonbalance} />
        <TokenBalance name={"xMOON"} img={"🌒"} address={address} balance={xmoonbalance} />
        <Balance address={address} provider={xdaiProvider} dollarMultiplier={1}/>
      </div>

      <Contract
        name={"DEX"}
        show={["init"]}
        provider={injectedProvider}
        address={address}
      />


      <AMB
        address={address}
        moonContract={moonContract}
        injectedProvider={injectedProvider}
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        readContracts={readContracts}
        price={price}
      />


      <DEX
        address={address}
        injectedProvider={injectedProvider}
        localProvider={xdaiProvider}
        xmoonContract={xmoonContract}
        mainnetProvider={mainnetProvider}
        readContracts={readContracts}
        price={price}
      />


      <Contract
        title={"🎈 Balloons"}
        name={"Balloons"}
        show={["balanceOf","approve"]}
        provider={localProvider}
        address={address}
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
