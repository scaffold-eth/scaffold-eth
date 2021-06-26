import { useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { JsonRpcProvider } from '@ethersproject/providers/src.ts/json-rpc-provider';

export const useUserAddress = (provider: Web3Provider | JsonRpcProvider | undefined): string => {
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    const getUserAddress = async (injectedProvider: Web3Provider | JsonRpcProvider) => {
      const signer = injectedProvider.getSigner();
      if (signer) setUserAddress(await signer.getAddress());
    };

    if (provider) getUserAddress(provider);
  }, [provider]);

  return userAddress;
};
