import { BytesLike, ethers, Signer } from 'ethers';
import { SigningKey } from 'ethers/lib/utils';
import { useState, useEffect } from 'react';

import { TEthHooksProvider } from '~~/models/providerTypes';
export const useBurnerSigner = (provider: TEthHooksProvider): Signer | undefined => {
  const key = 'metaPrivateKey';
  const [signer, setSigner] = useState<Signer>();
  const [privateKeyValue, setPrivateKeyValue] = useState<BytesLike | SigningKey>();

  const setValue = (value: any) => {
    try {
      setPrivateKeyValue(value);
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storedKey = window.localStorage.getItem(key);
    if (!storedKey) {
      console.log('generating a new key');
      const _newWallet = ethers.Wallet.createRandom();
      const _newKey = _newWallet.privateKey;
      setValue(_newKey);
    } else {
      setValue(storedKey);
    }
  }, []);

  useEffect(() => {
    if (privateKeyValue && provider) {
      const wallet = new ethers.Wallet(privateKeyValue);
      const _signer = wallet.connect(provider);
      setSigner(_signer);
    }
  }, [privateKeyValue, provider]);

  return signer;
};
