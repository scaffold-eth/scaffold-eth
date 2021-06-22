import { useState, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";

const { ethers } = require("ethers");

export default function useBurnerSigner(provider: Web3Provider) {
  const key = "metaPrivateKey";
  let wallet;
  const [signer, setSigner] = useState();
  const [storedValue, setStoredValue] = useState();

  const setValue = (value: any) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storedKey = window.localStorage.getItem(key);
    if (!storedKey) {
      console.log("generating a new key");
      const _newWallet = ethers.Wallet.createRandom();
      const _newKey = _newWallet.privateKey;
      setValue(_newKey);
    } else {
      setValue(storedKey);
    }
  }, []);

  useEffect(() => {
    if (storedValue && provider) {
      wallet = new ethers.Wallet(storedValue);
      const _signer = wallet.connect(provider);
      setSigner(_signer);
    }
  }, [storedValue, provider]);

  return signer;
}
