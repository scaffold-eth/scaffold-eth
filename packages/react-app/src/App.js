import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css';
import { Row, Col,  Button } from 'antd';
import { ethers } from "ethers";
import "./App.css";
import { useExchangePrice, useContractLoader, useGasPrice } from "./hooks"
import { Ramp } from "./components"
import BurnerProvider from 'burner-provider';

import NftyWallet from "./NftyWallet.js"

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet", "9ea7e149b122423991f56257b882261c")
const kovanProvider = new BurnerProvider("https://kovan.infura.io/v3/9ea7e149b122423991f56257b882261c")//new ethers.providers.InfuraProvider("kovan", "9ea7e149b122423991f56257b882261c")

let localProvider
let networkBanner = ""
if(process.env.REACT_APP_NETWORK_NAME){
  networkBanner = (
    <div style={{backgroundColor:process.env.REACT_APP_NETWORK_COLOR,color:"#FFFFFF",position:"absolute",left:0,top:0,width:"100%",fontSize:32,textAlign:"left",paddingLeft:32,opacity:0.777,filter:"blur(1.2px)"}}>
      {process.env.REACT_APP_NETWORK_NAME}
    </div>
  )
  localProvider = new ethers.providers.InfuraProvider(process.env.REACT_APP_NETWORK_NAME, "9ea7e149b122423991f56257b882261c")
}else{
  networkBanner = (
    <div style={{backgroundColor:"#666666",color:"#FFFFFF",position:"absolute",left:0,top:0,width:"100%",fontSize:32,textAlign:"left",paddingLeft:32,opacity:0.777,filter:"blur(1.2px)"}}>
      {"localhost"}
    </div>
  )
  localProvider = new ethers.providers.JsonRpcProvider("http://localhost:8545")
}

function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const [metaProvider, setMetaProvider] = useState();
  const price = useExchangePrice(mainnetProvider)
  const gasPrice = useGasPrice("fast")

  //console.log("gasPrice",gasPrice)

  const readContracts = useContractLoader(localProvider);


  return (
    <div className="App">

      {networkBanner}

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
        gasPrice={gasPrice}
        kovanProvider={kovanProvider}
      />

      <div style={{ position: 'fixed', textAlign: 'left', left: 0, bottom: 20, padding: 10 }}>
        <Row gutter={8}>
          <Col>
          <Ramp
            price={price}
            address={address}
          />
          </Col>
          <Col>
          <Button onClick={()=>{window.open("https://ethgasstation.info/")}} size="large" shape="round">
            <span style={{marginRight:8}}>⛽️</span>
            {parseInt(gasPrice)/10**9}g
          </Button>
          </Col>
        </Row>



      </div>


    </div>
  );
}

export default App;
