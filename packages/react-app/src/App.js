import React from "react";
import logo from "./ethereumLogo.png";
import { MAINNET_ID, addresses, abis } from "@uniswap-v1-app/contracts";
import { gql } from "apollo-boost";
import { ethers } from "ethers";
import { useQuery } from "@apollo/react-hooks";
import "./App.css";

const GET_EXCHANGES = gql`
  {
    exchanges(first: 5) {
      id
      tokenAddress
      tokenSymbol
      tokenName
    }
  }
`;

async function readOnChainData() {
  // Should replace with the end-user wallet, e.g. Metamask
  const defaultProvider = ethers.getDefaultProvider();
  // Create an instance of ethers.Contract
  // Read more about ethers.js on https://docs.ethers.io/ethers.js/html/api-contract.html
  const ethDaiExchangeContract = new ethers.Contract(
    addresses[MAINNET_ID].exchanges["ETH-DAI"],
    abis.exchange,
    defaultProvider,
  );
  // A pre-defined address that owns some cDAI tokens
  const exchangeRate = await ethDaiExchangeContract.getEthToTokenInputPrice("1000000000000000000"); // price of 1 Ether in DAI
  console.log({ exchangeRate: exchangeRate.toString() });
}

function App() {
  const { loading, error, data } = useQuery(GET_EXCHANGES);

  React.useEffect(() => {
    if (!loading && !error && data && data.exchanges) {
      console.log({ exchanges: data.exchanges });
    }
  }, [loading, error, data]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="react-logo" />
        <p>
          Edit <code>packages/react-app/src/App.js</code> and save to reload.
        </p>
        <button onClick={() => readOnChainData()} style={{ display: "none" }}>
          Read On-Chain Exchange Rate
        </button>
        <a
          className="App-link"
          href="https://ethereum.org/developers/#getting-started"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: "0px" }}
        >
          Learn Ethereum
        </a>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        <a className="App-link" href="https://docs.uniswap.io/" target="_blank" rel="noopener noreferrer">
          Learn Uniswap
        </a>
      </header>
    </div>
  );
}

export default App;
