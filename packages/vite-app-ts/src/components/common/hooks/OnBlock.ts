import { JsonRpcProvider, Provider, StaticJsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { useEffect, useRef } from 'react';

const DEBUG = false;

/**
 * helper hook to call a function regularly in time intervals
 * @param provider
 * @param fn
 * @param args
 */
export const useOnBlock = (
  provider: JsonRpcProvider | Web3Provider | Provider | undefined,
  fn: () => void,
  ...args: []
) => {
  const savedCallback = useRef<() => void>();
  // Remember the latest fn.
  useEffect(() => {
    savedCallback.current = fn;
  }, [fn]);

  // Turn on the listener if we have a function & a provider
  useEffect(() => {
    if (fn && provider) {
      const listener = (blockNumber: string) => {
        if (DEBUG) console.log(blockNumber, fn, args, provider.listeners());

        if (savedCallback.current) {
          if (args && args.length > 0) {
            savedCallback.current(...args);
          } else {
            savedCallback.current();
          }
        }
      };

      provider.on('block', listener);

      return () => {
        provider.off('block', listener);
      };
    }
  }, [provider]);
};
