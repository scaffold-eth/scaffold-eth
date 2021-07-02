import { useState, useEffect } from 'react';

import { TEthHooksProvider } from '~~/models';

export const useUserAddress = (provider: TEthHooksProvider): string => {
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    const getUserAddress = async (injectedProvider: TEthHooksProvider) => {
      const signer = injectedProvider.getSigner();
      if (signer) setUserAddress(await signer.getAddress());
    };

    if (provider) void getUserAddress(provider);
  }, [provider]);

  return userAddress;
};
