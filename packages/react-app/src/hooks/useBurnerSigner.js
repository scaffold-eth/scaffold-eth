// import { ethers } from 'ethers';
import { Wallet } from "zksync-web3";
import { useState, useEffect } from "react";
/**
 * A hook that creates a buner address and returns a Signer
 * @param provider (TEthersProvider)
 * @returns (ethers.signer) :: signer of the wallet
 */
export default function useBurnerSigner(provider) {
  const key = "metaPrivateKey";
  const [signer, setSigner] = useState();
  const [privateKeyValue, setPrivateKeyValue] = useState();
  const setValue = value => {
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
      console.log("generating a new key");
      // const newWallet = ethers.Wallet.createRandom();
      const newWallet = Wallet.createRandom();
      const newKey = newWallet.privateKey;
      setValue(newKey);
    } else {
      setValue(storedKey);
    }
  }, []);
  useEffect(() => {
    if (privateKeyValue && provider) {
      // const wallet = new ethers.Wallet(privateKeyValue);
      const wallet = new Wallet(privateKeyValue);
      const newSigner = wallet.connect(provider);
      setSigner(newSigner);
    }
  }, [privateKeyValue, provider]);
  return signer;
}
