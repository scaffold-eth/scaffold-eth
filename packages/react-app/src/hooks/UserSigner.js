import { useMemo } from "react";
import useBurnerSigner from "./BurnerSigner";

/*
  ~ What it does? ~

  Gets user provider

  ~ How can I use? ~

  const userProvider = useUserProvider(injectedProvider, localProvider);

  ~ Features ~

  - Specify the injected provider from Metamask
  - Specify the local provider
  - Usage examples:
    const tx = Transactor(userSigner, gasPrice)
*/

const useUserSigner = (injectedProvider, localProvider) => {
  const burnerSigner = useBurnerSigner(localProvider);

  const userSigner = useMemo(() => {
    if (injectedProvider) {
      console.log("🦊 Using injected provider");
      return injectedProvider._isProvider ? injectedProvider.getSigner() : injectedProvider;
    }
    if (!localProvider) return undefined;

    if (window.location.pathname) {
      if (window.location.pathname.indexOf("/pk") >= 0) {
        const incomingPK = window.location.hash.replace("#", "");
        let rawPK;
        if (incomingPK.length === 64 || incomingPK.length === 66) {
          console.log("🔑 Incoming Private Key...");
          rawPK = incomingPK;
          window.history.pushState({}, "", "/");
          const currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
          if (currentPrivateKey && currentPrivateKey !== rawPK) {
            window.localStorage.setItem("metaPrivateKey_backup" + Date.now(), currentPrivateKey);
          }
          window.localStorage.setItem("metaPrivateKey", rawPK);
        }
      }
    }

    console.log("🔥 Using burner signer", burnerSigner);
    return burnerSigner;
  }, [injectedProvider, localProvider, burnerSigner]);

  return userSigner;
};

export default useUserSigner;
