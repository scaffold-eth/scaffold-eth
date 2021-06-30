import { useEffect, useRef } from 'react';

import { TEthHooksProvider } from '~~/models/TEthProvider';

const DEBUG = false;
/**
 * helper hook to call a function regularly at time intervals
 * @param provider ethers/web3 provider
 * @param fn any function
 * @param args function parameters
 */
export const useOnBlock = (provider: TEthHooksProvider | undefined, fn: (...args: []) => void, ...args: []): void => {
  // save the input function provided
  const savedCallback = useRef<(...args: []) => void>();
  useEffect(() => {
    savedCallback.current = fn;
  }, [fn]);

  // Turn on the listener if we have a function & a provider
  useEffect(() => {
    if (fn && provider) {
      const listener = (blockNumber: number) => {
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
  }, [args, fn, provider]);
};
