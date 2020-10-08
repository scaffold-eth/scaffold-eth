import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ApolloClient, { gql, InMemoryCache } from 'apollo-boost'
import { ApolloProvider, Query } from 'react-apollo'
import "antd/dist/antd.css";
import { Row, Col, Button, Spin } from "antd";
import { ethers } from "ethers";
import "./App.css";
import { useContractLoader } from "./hooks";
import { Ramp, Faucet } from "./components";

import NftyWallet from "./NftyWallet.js";

if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
  throw new Error('REACT_APP_GRAPHQL_ENDPOINT environment variable not defined')
}

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
})

const INKS_QUERY = gql`
  query inks {
    inks(first: 5) {
      id
      inkId
      jsonUrl
    }
  }
`

const mainnetProvider = new ethers.providers.InfuraProvider(
  "mainnet",
  "9ea7e149b122423991f56257b882261c"
);
let kovanProvider;

let localProvider;
let networkBanner = <></>;
if (process.env.REACT_APP_NETWORK_NAME) {
  if (process.env.REACT_APP_NETWORK_NAME === "xdai") {
    console.log("🎉 XDAINETWORK + 🚀 Mainnet Ethereum");
    localProvider = mainnetProvider;
    kovanProvider = new ethers.providers.JsonRpcProvider(
      "https://dai.poa.network"
    );
  } else if (process.env.REACT_APP_NETWORK_NAME === "sokol") {
    console.log("THIS.IS.SOKOL");
    localProvider = new ethers.providers.JsonRpcProvider(
      "https://sokol.poa.network"
    );
    kovanProvider = new ethers.providers.InfuraProvider(
      "kovan",
      "9ea7e149b122423991f56257b882261c"
    );
  } else {
    localProvider = new ethers.providers.InfuraProvider(
      process.env.REACT_APP_NETWORK_NAME,
      "9ea7e149b122423991f56257b882261c"
    );
    kovanProvider = new ethers.providers.InfuraProvider(
      "kovan",
      "9ea7e149b122423991f56257b882261c"
    );
  }
} else {
  networkBanner = (
    <div
      style={{
        backgroundColor: "#666666",
        color: "#FFFFFF",
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        fontSize: 54,
        textAlign: "left",
        paddingLeft: 32,
        opacity: 0.125,
        filter: "blur(1.2px)"
      }}
    >
      {"localhost"}
    </div>
  );
  localProvider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
  kovanProvider = new ethers.providers.JsonRpcProvider("http://localhost:8546"); // yarn run sidechain
}

function App() {
  const [address, setAddress] = useState();
  const [injectedProvider, setInjectedProvider] = useState();
  const [metaProvider, setMetaProvider] = useState();
  const price = 1;
  const gasPrice = 1001010001;

  // Mainnet contract:
  const readContracts = useContractLoader(localProvider);

  const readKovanContracts = useContractLoader(kovanProvider);

  return (
    <ApolloProvider client={client}>
    <Router>
    <div className="App">
      {networkBanner}

    </div>
      <Switch>
        <Route path="/">
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
            readKovanContracts={readKovanContracts}
            gasPrice={gasPrice}
            kovanProvider={kovanProvider}
            metaProvider={metaProvider}
            setMetaProvider={setMetaProvider}
            />
            <div
              style={{
                position: "fixed",
                textAlign: "left",
                left: 0,
                bottom: 20,
                padding: 10
              }}
            >
              <Row gutter={8}>
                {!process.env.REACT_APP_NETWORK_NAME ||
                process.env.REACT_APP_NETWORK_NAME === "xdai" ? (
                  ""
                ) : (
                  <>
                    <Col>
                      <Ramp price={price} address={address} />
                    </Col>
                    <Col>
                      <Button
                        onClick={() => {
                          window.open("https://ethgasstation.info/");
                        }}
                        size="large"
                        shape="round"
                      >
                        <span
                          style={{ marginRight: 8 }}
                          role="img"
                          aria-label="Fuel_pump"
                        >
                          ⛽️
                        </span>
                        {parseInt(gasPrice) / 10 ** 9}g
                      </Button>
                    </Col>
                  </>
                )}
                {process.env.REACT_APP_NETWORK_NAME ? (
                  ""
                ) : (
                  <>
                    <Col>
                      <Faucet localProvider={localProvider} price={price} />
                    </Col>
                    <Col>
                      <Faucet
                        localProvider={kovanProvider}
                        placeholder={"sidechain faucet"}
                        price={price}
                      />
                    </Col>
                  </>
                )}
              </Row>
            </div>
            <div style={{ padding: 50 }}>
              <a
                href="https://github.com/austintgriffith/scaffold-eth/tree/nifty-ink-dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                {readContracts ? (
                  ""
                ) : (
                  <Spin
                    style={{ padding: 64, opacity: metaProvider ? 0.125 : 0.3 }}
                  />
                )}
              </a>
            </div>
      </Route>
      </Switch>
    </Router>
    </ApolloProvider>
  );
}

export default App;
