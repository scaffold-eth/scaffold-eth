import React, { useState, useRef, useEffect } from 'react'
import 'antd/dist/antd.css';
import { ethers } from "ethers";
import "./App.css";
import { Row, Col } from 'antd';
import { useExchangePrice, useGasPrice, useLocalStorage, useContractLoader } from "./hooks"
import { AdminWidget } from "./components"
import InkInfo from "./InkInfo.js"
import NftyWallet from "./NftyWallet.js"
import NftyHeader from "./NftyHeader.js"
import InkCanvas from "./InkCanvas.js"

const mainnetProvider = new ethers.providers.InfuraProvider("mainnet", "2717afb6bf164045b5d5468031b93f87")
const localProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : "http://localhost:8545")//'https://kovan.infura.io/v3/813ba28a534f416793957d3fe470923c')//

function App() {

  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const price = useExchangePrice(mainnetProvider)

  const readContracts = useContractLoader(localProvider);

  const [mode, setMode] = useState("edit")

  const [ipfsHash, setIpfsHash] = useState()
  const [ink, setInk] = useState({})

  let inkInfo

  if (mode === "edit") {
  inkInfo = (<></>)

  } else if (mode === "mint") {

    inkInfo = (<InkInfo
      address={address}
      mainnetProvider={mainnetProvider}
      injectedProvider={injectedProvider}
      ink={ink}
      ipfsHash={ipfsHash}
      readContracts={readContracts}
      />)
  }

  return (
    <div className="App">

      <NftyHeader
        address={address}
        setAddress={setAddress}
        localProvider={localProvider}
        injectedProvider={injectedProvider}
        setInjectedProvider={setInjectedProvider}
        mainnetProvider={mainnetProvider}
        hideInterface={false}
        price={price}
        minimized={true}
        readContracts={readContracts}
      />

      <Row style={{justifyContent: 'center'}} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      <Col>
      <InkCanvas
        address={address}
        mainnetProvider={mainnetProvider}
        injectedProvider={injectedProvider}
        ink={ink}
        ipfsHash={ipfsHash}
        readContracts={readContracts}
        mode={mode}
        setMode={setMode}
        setIpfsHash={setIpfsHash}
        setInk={setInk}
      />
      </Col>
      <Col style={{display: "flex", alignItems: "center"}}>
        {inkInfo}
      </Col>
      </Row>

      <AdminWidget
      address={address}
      localProvider={localProvider}
      injectedProvider={injectedProvider}
      mainnetProvider={mainnetProvider}
      price={price}/>

    </div>
  );
}

export default App;
