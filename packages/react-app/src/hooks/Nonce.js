import { useState } from "react";
import usePoller from "./Poller";

export default function useNonce(provider, address, pollTime) {
  const [nonce, setNonce] = useState();

  usePoller(() => {
    if (typeof provider !== "undefined") {
      // eslint-disable-next-line no-inner-declarations
      async function getTransactionCount() {
        const nextNonce = await provider.getTransactionCount(address);
        if (nextNonce !== nonce) {
          setNonce(nextNonce);
        }
      }
      getTransactionCount();
    }
  }, pollTime || 1777);

  return nonce;
}
