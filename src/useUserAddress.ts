import { useState, useEffect } from 'react';

import { parseProviderOrSigner, TProviderAndSigner } from '~~/functions';
import { TProviderOrSigner } from '~~/models';

export const useUserAddress = (providerOrSigner: TProviderOrSigner): string => {
  const [userAddress, setUserAddress] = useState<string>('');
  // sdfasdfklsdjafjdskfjsd

  useEffect(() => {
    const getUserAddress = async (injectedProvider: TProviderOrSigner) => {
      const result: TProviderAndSigner = await parseProviderOrSigner(injectedProvider);
      if (result.signer) {
        const address = await result.signer?.getAddress();
        setUserAddress(address);
      }
    };

    if (providerOrSigner) void getUserAddress(providerOrSigner);
  }, [providerOrSigner]);

  return userAddress;
};
