import React, { useMemo } from "react";
import { Card } from "antd";
import { useContractLoader, useContractExistsAtAddress } from "../../hooks";
import Account from "../Account";
import DisplayVariable from "./DisplayVariable";
import FunctionForm from "./FunctionForm";

const noContractDisplay = (
  <div>
    Loading...{" "}
    <div style={{ padding: 32 }}>
      You need to run{" "}
      <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
        yarn run chain
      </span>{" "}
      and{" "}
      <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
        yarn run deploy
      </span>{" "}
      to see your contract here.
    </div>
    <div style={{ padding: 32 }}>
      <span style={{ marginRight: 4 }} role="img" aria-label="warning">☢️</span>Warning: You might need to run
      <span style={{ marginLeft: 4, backgroundColor: "#f1f1f1", padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
        yarn run deploy
      </span>{" "}
      <i>again</i> after the frontend comes up!
    </div>
  </div>
);

const isQueryable = fn => (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length === 0;

export default function Contract({ account, gasPrice, provider, name, show, price }) {
  const contracts = useContractLoader(provider);
  const contract = contracts ? contracts[name] : "";
  const address = contract ? contract.address : "";
  const contractIsDeployed = useContractExistsAtAddress(provider, address);

  const contractDisplay = useMemo(() => {
    if (contract) {
      return Object.values(contract.interface.functions)
        .filter(fn => fn.type === "function")
        .map(fn => {
          if (show && show.indexOf(fn.name) < 0) {
            // do nothing
            return <div key={fn.name} />;
          }
          if (isQueryable(fn)) {
            // If there are no inputs, just display return value
            return <DisplayVariable key={fn.name} contractFunction={contract[fn.name]} functionInfo={fn} />;
          }
          // If there are inputs, display a form to allow users to provide these
          return (
            <FunctionForm
              key={"FF"+fn.name}
              contractFunction={contract[fn.name]}
              functionInfo={fn}
              provider={provider}
              gasPrice={gasPrice}
            />
          );
        });
    }
    return <div />;
  }, [contract, gasPrice, provider, show]);

  return (
    <div style={{ margin: "auto", width: "70vw" }}>
      <Card
        title={
          <div>
            {name}
            <div style={{ float: "right" }}>
              <Account
                address={address}
                localProvider={provider}
                injectedProvider={provider}
                mainnetProvider={provider}
                price={price}
              />
              {account}
            </div>
          </div>
        }
        size="large"
        style={{ marginTop: 25, width: "100%" }}
        loading={contractDisplay && contractDisplay.length <= 0}
      >
        {contractIsDeployed ? contractDisplay : noContractDisplay}
      </Card>
    </div>
  );
}
