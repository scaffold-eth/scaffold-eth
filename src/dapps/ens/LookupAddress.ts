import { Provider } from '@ethersproject/providers';
import { utils } from 'ethers';
import { useState, useEffect } from 'react';

import { TEthHooksProvider } from '~~/models';

const lookupAddress = async (provider: TEthHooksProvider, address: string) => {
  if (utils.isAddress(address)) {
    try {
      // Accuracy of reverse resolution is not enforced.
      // We then manually ensure that the reported ens name resolves to address
      const reportedName = await provider.lookupAddress(address);

      const resolvedAddress = await provider.resolveName(reportedName);

      if (address && utils.getAddress(address) === utils.getAddress(resolvedAddress)) {
        return reportedName;
      } else {
        return utils.getAddress(address);
      }
    } catch (e) {
      return utils.getAddress(address);
    }
  }
  return 0;
};

/**
 * Gets ENS name from given address and provider
 * @param provider
 * @param address
 * @returns
 */
export const useLookupAddress = (provider: TEthHooksProvider, address: string): string => {
  const [ensName, setEnsName] = useState(address);

  useEffect(() => {
    let cache: any = window.localStorage.getItem('ensCache_' + address);
    cache = cache && JSON.parse(cache);

    if (cache && cache?.name && cache?.timestamp > Date.now()) {
      setEnsName(cache?.name);
    } else if (provider) {
      void lookupAddress(provider, address).then((name) => {
        if (name) {
          setEnsName(name);
          window.localStorage.setItem(
            'ensCache_' + address,
            JSON.stringify({
              timestamp: Date.now() + 360000,
              name,
            })
          );
        }
      });
    }
  }, [provider, address, setEnsName]);

  return ensName;
};
