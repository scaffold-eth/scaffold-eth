import { Provider } from '@ethersproject/providers';
import { ethers, Signer } from 'ethers';
import { useMemo, useState } from 'react';

import { useBurnerSigner } from '.';

import { parseProviderOrSigner, TProviderAndSigner } from '~~/functions/providerOrSigner';
import { TEthHooksProvider, TProviderOrSigner } from '~~/models';

const syncBurnerKeyFromStorage = () => {
  if (window.location.pathname && window.location.pathname.indexOf('/pk') >= 0) {
    const incomingPK = window.location.hash.replace('#', '');
    let rawPK;
    if (incomingPK.length === 64 || incomingPK.length === 66) {
      console.log('🔑 Incoming Private Key...');
      rawPK = incomingPK;
      window.history.pushState({}, '', '/');
      const currentPrivateKey = window.localStorage.getItem('metaPrivateKey');
      if (currentPrivateKey && currentPrivateKey !== rawPK) {
        window.localStorage.setItem(`metaPrivateKey_backup${Date.now()}`, currentPrivateKey);
      }
      window.localStorage.setItem('metaPrivateKey', rawPK);
    }
  }
};

/**
 * Gets user provider or Signer
 * 
  ~ Features ~
  - Specify the injected provider from Metamask
  - Specify the local provider
  - Usage examples:
    const tx = Transactor(userSigner, gasPrice)
 * @param injectedProviderOrSigner 
 * @param localProvider 
 * @returns 
 */
export const useUserProviderAndSigner = (
  injectedProviderOrSigner: TProviderOrSigner,
  localProvider: TEthHooksProvider
): TProviderAndSigner | undefined => {
  const [signer, setSigner] = useState<Signer>();
  const [provider, setProvider] = useState<Provider>();
  const [providerNetwork, setProviderNetwork] = useState<ethers.providers.Network>();
  const burnerSigner = useBurnerSigner(localProvider);

  useMemo(() => {
    if (injectedProviderOrSigner) {
      console.log('🦊 Using injected provider');
      void parseProviderOrSigner(injectedProviderOrSigner).then((result) => {
        if (result != undefined) setSigner(result.signer);
      });
    } else if (!localProvider) {
      setSigner(undefined);
    } else {
      syncBurnerKeyFromStorage();
      console.log('🔥 Using burner signer', burnerSigner);
      setSigner(burnerSigner);
    }
  }, [injectedProviderOrSigner, localProvider, burnerSigner]);

  useMemo(() => {
    if (signer) {
      const result = parseProviderOrSigner(signer);
      void result.then((r) => {
        setProvider(r.provider);
        setProviderNetwork(r.providerNetwork);
      });
    }
  }, [signer]);

  return { signer, provider, providerNetwork };
};
