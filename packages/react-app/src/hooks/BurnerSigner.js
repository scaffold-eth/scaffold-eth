import { useState, useEffect } from 'react';
const { ethers } = require("ethers");

export default function useBurnerSigner(provider) {

  let key = 'metaPrivateKey'
  let wallet
  const [signer, setSigner] = useState()
  const [storedValue, setStoredValue] = useState()

  const setValue = value => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storedKey = window.localStorage.getItem(key);
    if(!storedKey) {
      console.log('generating a new key')
      let _newWallet = ethers.Wallet.createRandom()
      let _newKey = _newWallet.privateKey
      setValue(_newKey)
      console.log(_newKey)
      return _newKey
    } else {
      setValue(storedKey)
    }
  },[])

  useEffect(() => {
    if(storedValue) {
      wallet = new ethers.Wallet(storedValue)
      let _signer = wallet.connect(provider)
      setSigner(_signer)
    }
  },[storedValue])

  return signer;
}
