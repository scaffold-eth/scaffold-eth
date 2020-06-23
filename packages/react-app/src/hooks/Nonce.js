import { useState } from 'react';
import usePoller from "./Poller.js";

export default function useNonce(provider,address,pollTime) {

  const [nonce, setNonce] = useState()

  usePoller(() => {
    if(typeof provider !== "undefined"){
      async function getTransactionCount() {
        let nextNonce = await provider.getTransactionCount(address)
        if(nextNonce!==nonce){
          setNonce(nextNonce)
        }
      }
      getTransactionCount();
    }
  },pollTime?pollTime:1777)

  return nonce;
}
