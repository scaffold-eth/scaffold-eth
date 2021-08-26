import { useState } from "react";

export default function useNonce(mainnetProvider, address) {
  const [nonce, setNonce] = useState(0);

  const Nonce = () => {
    async function getNonce() {
        setNonce(await mainnetProvider.getTransactionCount(address));
    }
<<<<<<< HEAD
    getNonce();
=======
    if (address) getNonce();
>>>>>>> master
  };
  Nonce();
  return nonce;
}
