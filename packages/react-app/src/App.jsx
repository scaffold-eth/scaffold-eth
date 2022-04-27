import { Button, Col, Menu, Row } from "antd";
import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import {
  Account,
  Contract,
  Faucet,
  GasGauge,
  Header,
  Ramp,
  ThemeSwitch,
  NetworkDisplay,
  FaucetHint,
  NetworkSwitch,
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";
// contracts
// import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { Home, ExampleUI, Hints, Subgraph, BrowseBadges } from "./views";
import { useStaticJsonRPC } from "./hooks";


const { ethers } = require("ethers");

function App(props) {
  const contractConfig = { deployedContracts: {}, externalContracts: externalContracts || {} };

  // const provider = useStaticJsonRPC(['https://mainnet.optimism.io'])
  // const mainnet = useStaticJsonRPC(['https://mainnet.infura.io/v3/1b3241e53c8d422aab3c7c0e4101de9c'])
  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const [loaded, setLoaded] = useState(false)
  const [localProvider, setLocalProvider] = useState(null)
  const [mainnet, setMainnet] = useState(null)

  useEffect(async () => {
    const localProvider = new ethers.providers.StaticJsonRpcProvider('https://mainnet.optimism.io');

    await localProvider.ready;

    const mainnet = new ethers.providers.StaticJsonRpcProvider('https://mainnet.infura.io/v3/1b3241e53c8d422aab3c7c0e4101de9c');

    await mainnet.ready;

    setLocalProvider(localProvider)
    setMainnet(mainnet)
    setLoaded(true)
  }, [])
  

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      { loaded && <BrowseBadges
            localProvider={localProvider}
            mainnet={mainnet}
            selectedChainId={10}
      /> }
    </div>
  );
}

export default App;
