import { useEffect, useRef } from "react";
import { Provider } from "@ethersproject/providers";


// helper hook to call a function regularly in time intervals
let DEBUG = false

export default function useOnBlock(
  provider: Provider,
  fn: (...args: any[]) => void,
  args?: any
): void {
  const savedCallback = useRef<(...args: any[]) => void>();
  // Remember the latest fn.
  useEffect(() => {
    savedCallback.current = fn;
  }, [fn]);

  // Turn on the listener if we have a function & a provider
  useEffect(() => {
    if (fn && provider) {

      const listener = (blockNumber: number) => {
        if (DEBUG) console.log(blockNumber, fn, args, provider.listeners())

        if (args && args.length > 0) {
          if (savedCallback.current) savedCallback.current(...args);
        } else {
          if (savedCallback.current) savedCallback.current();
        }

      }

      provider.on("block", listener)

      return () => {
          provider.off("block", listener)
      }
    }
  }, [provider])
}
