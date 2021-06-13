import { useEffect } from "react";
import { useLatestRef } from "eth-hooks";

// helper hook to call a function regularly in time intervals
const DEBUG = false;

export default function useOnBlock(provider, fn, args) {
  // Remember the latest fn.
  const savedCallback = useLatestRef(fn);

  // Turn on the listener if we have a function & a provider
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (fn && provider) {
      const listener = blockNumber => {
        if (DEBUG) console.log(blockNumber, fn, args, provider.listeners());

        if (args && args.length > 0) {
          savedCallback.current(...args);
        } else {
          savedCallback.current();
        }
      };

      provider.on("block", listener);

      return () => {
        provider.off("block", listener);
      };
    }
  }, [provider, savedCallback]);
}
