import { useMemo } from "react";
import { Web3Provider } from "@ethersproject/providers";
import BurnerProvider from "burner-provider";
import { INFURA_ID } from "../constants";

const useUserProvider = (injectedProvider, localProvider) =>
  useMemo(() => {
    if (injectedProvider) {
      console.log("🦊 Using injected provider")
      return injectedProvider;
    }
    if (!localProvider) return undefined;
    if (localProvider.connection && localProvider.connection.url) {
      console.log("🔥 Using burner provider")
      return new Web3Provider(new BurnerProvider(localProvider.connection.url));
    }
    // eslint-disable-next-line no-underscore-dangle
    const networkName = localProvider._network && localProvider._network.name;
    return new Web3Provider(new BurnerProvider(`https://${networkName || "mainnet"}.infura.io/v3/${INFURA_ID}`));
  }, [injectedProvider, localProvider]);

export default useUserProvider;
