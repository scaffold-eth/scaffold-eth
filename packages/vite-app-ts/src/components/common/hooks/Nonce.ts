import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { useState } from 'react';

export const useNonce = (mainnetProvider: JsonRpcProvider | Web3Provider, address: string) => {
  const [nonce, setNonce] = useState(0);

  const Nonce = () => {
    async function getNonce() {
      setNonce(await mainnetProvider.getTransactionCount(address));
    }
    if (address) getNonce();
  };
  Nonce();
  return nonce;
};
