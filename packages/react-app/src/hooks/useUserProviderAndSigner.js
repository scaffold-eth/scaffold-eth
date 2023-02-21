import { useMemo, useState } from "react";
import { useBurnerSigner } from "./";
import { parseProviderOrSigner } from "./functions/providerOrSigner";
const syncBurnerKeyFromStorage = () => {
  if (window.location.pathname && window.location.pathname.includes("/pk")) {
    const incomingPK = window.location.hash.replace("#", "");
    if (incomingPK.length === 64 || incomingPK.length === 66) {
      console.log("🔑 Incoming Private Key...");
      const rawPK = incomingPK;
      window.history.pushState({}, "", "/");
      const currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
      if (currentPrivateKey && currentPrivateKey !== rawPK) {
        window.localStorage.setItem(`metaPrivateKey_backup${Date.now()}`, currentPrivateKey);
      }
      window.localStorage.setItem("metaPrivateKey", rawPK);
    }
  }
};
/**
 *  Gets user provider/signer from injected provider or local provider
 *  Use your injected provider from 🦊 Metamask
 *  If you don't have it then instantly generate a 🔥 burner wallet from a local provider
 *
  ~ Features ~
  - Specify the injected provider from Metamask
  - Specify the local provider
  - Usage examples:
    const tx = Transactor(userSigner, gasPrice)
 * @param injectedProviderOrSigner (TEthersProviderOrSigner) :: injected provider/signer from metamask etc..
 * @param localProvider (TEthersProvider) local provider to generate a burner wallet from
 * @param useBurnerWallet (boolean) lets the hook know wether to use the burner wallet or not
 * @returns (TProviderAndSigner)
 */
export default function useUserProviderAndSigner(injectedProviderOrSigner, localProvider, useBurnerWallet) {
  const [signer, setSigner] = useState();
  const [provider, setProvider] = useState();
  const [providerNetwork, setProviderNetwork] = useState();
  const burnerSigner = useBurnerSigner(localProvider);
  useMemo(() => {
    if (injectedProviderOrSigner) {
      console.log("🦊 Using injected provider");
      void parseProviderOrSigner(injectedProviderOrSigner).then(result => {
        if (result != null) setSigner(result.signer);
      });
    } else if (!localProvider) {
      setSigner(undefined);
    } else if (useBurnerWallet) {
      syncBurnerKeyFromStorage();
      console.log("🔥 Using burner signer", burnerSigner);
      setSigner(burnerSigner);
    } else {
      console.log("burner is off");
    }
  }, [injectedProviderOrSigner, localProvider, burnerSigner, useBurnerWallet]);
  useMemo(() => {
    if (signer) {
      const result = parseProviderOrSigner(signer);
      void result.then(r => {
        setProvider(r.provider);
        setProviderNetwork(r.providerNetwork);
      });
    }
  }, [signer]);
  return { signer, provider, providerNetwork };
}
