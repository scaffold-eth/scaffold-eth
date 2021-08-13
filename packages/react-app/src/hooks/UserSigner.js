import { useMemo, useState } from "react";
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
  const [signer, setSigner] = useState();
  const burnerSigner = useBurnerSigner(localProvider);

  useMemo(() => {
    if (injectedProvider) {
      console.log("🦊 Using injected provider");
      const injectedSigner = injectedProvider._isProvider ? injectedProvider.getSigner() : injectedProvider;
      setSigner(injectedSigner);
    } else if (!localProvider) setSigner();
  }, [injectedProvider, localProvider, burnerSigner]);

  return signer;
};

export default useUserSigner;
