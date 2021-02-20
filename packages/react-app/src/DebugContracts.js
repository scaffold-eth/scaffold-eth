import React, { useState } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import { Menu } from "antd";
import { Contract } from "./components";
import { useUserProvider } from "./hooks";
import { NETWORKS } from "./constants";

const targetNetwork = NETWORKS["localhost"];

const blockExplorer = targetNetwork.blockExplorer;

const contractsToDebug = ["NiftyInk", "NiftyToken"];

function DebugContracts({ address, localProvider, injectedProvider }) {
  const userProvider = useUserProvider(injectedProvider, localProvider);

  const [route, setRoute] = useState();

  return (
    <div>
      <Menu
        style={{ textAlign: "center" }}
        selectedKeys={[route]}
        mode="horizontal"
      >
        {contractsToDebug.map((n) => (
          <Menu.Item key={`/debug/${n}`}>
            <Link
              onClick={() => {
                setRoute(`/debug/${n}`);
              }}
              to={`/debug/${n}`}
            >
              {n}
            </Link>
          </Menu.Item>
        ))}
      </Menu>

      <Switch>
        {contractsToDebug.map((n) => (
          <Route key={n} path={`/debug/${n}`}>
            <Contract
              name={n}
              signer={userProvider.getSigner()}
              provider={localProvider}
              address={address}
              blockExplorer={blockExplorer}
            />
          </Route>
        ))}
        <Redirect to={`/debug/${contractsToDebug[0]}`} />
      </Switch>
    </div>
  );
}

export default DebugContracts;
