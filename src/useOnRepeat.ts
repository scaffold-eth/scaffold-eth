import { Provider } from '@ethersproject/providers';
import { useCallback, useEffect } from 'react';

import { TEthHooksProvider, TProviderOrSigner } from '~~/models/providerTypes';

const DEBUG = false;
/**
 * A combination of useOnBlock and usePoller
 * helper hook to call a function regularly at time intervals when the block changes
 * @param provider ethers/web3 provider
 * @param callback any function
 * @param args function parameters
 */
/**
 * A combination of useOnBlock and usePoller
 * - the hook will invoke a callback regularly on the "block" event.  If a pollTime is provided,
 * it will use that instead.
 * - the hook will invoke the callback when the leadTrigger changes state to true as a leading invokation
 * @param callback
 * @param options pollTime?: number; provider?: Provider | undefined; leadTrigger?: boolean;
 * @param args varargs callback function arguments
 */
export const useOnRepeat = (
  callback: (..._args: any[]) => void,
  options: {
    pollTime?: number;
    provider?: Provider | undefined;
    leadTrigger?: boolean;
  },
  ...args: any[]
): void => {
  const polling = options?.pollTime ?? 0 > 0;

  // save the input function provided
  const callFunctionWithArgs = useCallback(() => {
    if (callback) {
      if (args && args.length > 0) {
        callback(...args);
      } else {
        callback();
      }
    }
  }, [callback, ...args]);

  // Turn on the listener if we have a function & a provider
  const listener = useCallback(
    (_blockNumber: number): void => {
      console.log('listen block event', _blockNumber, ...args);
      if (options.provider) callFunctionWithArgs();
    },
    [callFunctionWithArgs, options.provider, ...args]
  );

  // connect a listener for block changes
  useEffect(() => {
    if (options.provider && !polling) {
      console.log('register block event', ...args);
      options.provider.addListener('block', listener);
      return (): void => {
        options?.provider?.removeListener('block', listener);
      };
    } else {
      return (): void => {};
    }
  }, [options.provider, polling, listener]);

  // Set up the interval if poller
  useEffect(() => {
    const tick = (): void => {
      callFunctionWithArgs();
    };

    if (polling) {
      const id = setInterval(tick, options.pollTime);
      return (): void => {
        clearInterval(id);
      };
    }
  }, [options.pollTime, polling, callFunctionWithArgs]);

  // call if triggered by extra watch
  useEffect(() => {
    if (options.leadTrigger) {
      callFunctionWithArgs();
    }
  }, [options.leadTrigger, callFunctionWithArgs]);
};
