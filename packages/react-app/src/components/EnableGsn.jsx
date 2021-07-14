import { Switch } from "antd";
import React from "react";
import { RelayProvider } from "@opengsn/provider";
import axios from "axios";

export function EnableGsn({ usingGsn, setUsingGsn }) {
  return (
    <>
      <p />
      <Switch
        defaultChecked={usingGsn}
        checkedChildren="Using GSN"
        unCheckedChildren="Not using GSN"
        onClick={on => setUsingGsn(on)}
      />
    </>
  );
}

async function getGsnNetwork(chainId) {
  if (chainId === 31337) {
    return {
      Paymaster: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
    };
  }
  const gsnNetworks = await axios.get("https://opengsn.github.io/gsn-networks/gsn-networks.json");
  if (!gsnNetworks.data) {
    throw new Error("unable to fetch GSN networks " + (gsnNetworks.error || gsnNetworks));
  }
  const gsnNetwork = gsnNetworks.data.networks[chainId];
  if (!gsnNetwork) {
    throw new Error("GSN is not deployed on network " + chainId);
  }
  console.log("==chain", chainId, "ret=", gsnNetwork);
  return gsnNetwork;
}

/**
 * Initialize GSN wrapper for the given provider
 * @param {*} usingGsn - If true, initialize GSN. if false, then return the provider as-is.
 * @param {*} provider - Rpc provider
 */
export async function initGsn(usingGsn, provider) {
  if (!usingGsn) return provider;
  const chainId = parseInt(await provider.request({ method: "eth_chainId", params: [] }));

  const gsnNetwork = await getGsnNetwork(chainId);

  console.log("⛽ Using GSN provider");
  const gsnProvider = RelayProvider.newProvider({
    provider,
    config: {
      paymasterAddress: gsnNetwork.Paymaster,
      loggerConfiguration: { logLevel: "debug" },
    },
  });
  await gsnProvider.init();
  return gsnProvider;
}
