import { useState } from "react";

export default function useNonce(mainnetProvider, address) {
  const [nonce, setNonce] = useState(0);

  const Nonce = () => {
    async function getNonce() {
      setNonce(await mainnetProvider.getTransactionCount(address));
    }
    if(address) getNonce();
  };
  Nonce();
  return nonce;
}
