import { Web3Provider } from "@ethersproject/providers";
import BurnerProvider from "burner-provider";
import { useMemo } from "react";
import { INFURA_ID } from "../constants";

/*
  ~ What it does? ~

  Gets user provider

  ~ How can I use? ~

  const userProvider = useUserProvider(injectedProvider, localProvider);

  ~ Features ~

  - Specify the injected provider from Metamask
  - Specify the local provider
  - Usage examples:
    const address = useUserAddress(userProvider);
    const tx = Transactor(userProvider, gasPrice)
*/

const useUserProvider = (injectedProvider, localProvider) =>
  useMemo(() => {
    if (injectedProvider) {
      console.log("🦊 Using injected provider");
      return injectedProvider;
    }
    if (!localProvider) return undefined;

    const burnerConfig = {};

    if (window.location.pathname) {
      if (window.location.pathname.indexOf("/pk") >= 0) {
        const incomingPK = window.location.hash.replace("#", "");
        let rawPK;
        if (incomingPK.length === 64 || incomingPK.length === 66) {
          console.log("🔑 Incoming Private Key...");
          rawPK = incomingPK;
          burnerConfig.privateKey = rawPK;
          window.history.pushState({}, "", "/");
          const currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
          if (currentPrivateKey && currentPrivateKey !== rawPK) {
            window.localStorage.setItem("metaPrivateKey_backup" + Date.now(), currentPrivateKey);
          }
          window.localStorage.setItem("metaPrivateKey", rawPK);
        }
      }
    }

    console.log("🔥 Using burner provider", burnerConfig);
    if (localProvider.connection && localProvider.connection.url) {
      burnerConfig.rpcUrl = localProvider.connection.url;
      return new Web3Provider(new BurnerProvider(burnerConfig));
    }
    // eslint-disable-next-line no-underscore-dangle
    const networkName = localProvider._network && localProvider._network.name;
    burnerConfig.rpcUrl = `https://${networkName || "mainnet"}.infura.io/v3/${INFURA_ID}`;
    return new Web3Provider(new BurnerProvider(burnerConfig));
  }, [injectedProvider, localProvider]);

export default useUserProvider;
