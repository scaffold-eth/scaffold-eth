import { useState, useEffect } from 'react';

import { parseProviderOrSigner } from '~~/functions';
import { TProviderAndSigner, TProviderOrSigner } from '~~/models';

export const useUserAddress = (providerOrSigner: TProviderOrSigner): string => {
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    const getUserAddress = async (injectedProvider: TProviderOrSigner): Promise<void> => {
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
