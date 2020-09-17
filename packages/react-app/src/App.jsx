import React, { useState } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { getDefaultProvider, InfuraProvider, JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { INFURA_ID, ETHERSCAN_KEY } from "./constants";
import { useUserProvider } from "./hooks";
import { Admin, Debug } from "./views"
import "antd/dist/antd.css";
import "./App.css";

// 🛰 providers
console.log("📡 Connecting to Mainnet Ethereum");
const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
// const mainnetProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/5ce0898319eb4f5c9d4c982c8f78392a")
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID)

// 🏠 Your local provider is usually pointed at your local blockchain
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrl = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : "http://localhost:8545"; // https://dai.poa.network
console.log("🏠 Connecting to provider:", localProviderUrl);
const localProvider = new JsonRpcProvider(localProviderUrl);

function App() {
  const [injectedProvider, setInjectedProvider] = useState();
  const userProvider = useUserProvider(injectedProvider, localProvider);

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/debug">
            <Debug />
          </Route>
          <Route path="/admin">
            <Admin
              localProvider={localProvider}
              mainnetProvider={mainnetProvider}
            />
          </Route>
          <Route path="/projects">
          </Route>
          <Route path="/">
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
