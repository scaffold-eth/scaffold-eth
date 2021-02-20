import React, { useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import { Row, Col, Button, Menu, Alert } from "antd";
import {
  Header,
  Account,
  Faucet,
  Ramp,
  Contract,
  GasGauge,
} from "./components";
import { useUserProvider } from "./hooks";
import { NETWORKS } from "./constants";

const targetNetwork = NETWORKS["localhost"];

const blockExplorer = targetNetwork.blockExplorer;

function DebugContracts({ address, localProvider, injectedProvider }) {
  console.log("props: ", address, localProvider, injectedProvider);
  const userProvider = useUserProvider(injectedProvider, localProvider);

  const [route, setRoute] = useState();

  return (
    <div
      style={{
        textAlign: "center",
        // margin: "0 auto",
      }}
    >
      <BrowserRouter>
        <Menu
          style={{ textAlign: "center" }}
          selectedKeys={[route]}
          mode="horizontal"
        >
          <Menu.Item key="/debug/">
            <Link
              onClick={() => {
                setRoute("/debug/");
              }}
              to="/debug/"
            >
              NiftyInk
            </Link>
          </Menu.Item>
        </Menu>

        <Switch>
          <Route exact path="/debug/">
            <Contract
              name="NiftyInk"
              signer={userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default DebugContracts;
