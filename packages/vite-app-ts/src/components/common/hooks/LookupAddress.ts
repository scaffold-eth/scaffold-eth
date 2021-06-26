import { getAddress, isAddress } from '@ethersproject/address';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';

const lookupAddress = async (provider: JsonRpcProvider | Web3Provider, address: string) => {
  if (isAddress(address)) {
    // console.log(`looking up ${address}`)
    try {
      // Accuracy of reverse resolution is not enforced.
      // We then manually ensure that the reported ens name resolves to address
      const reportedName = await provider.lookupAddress(address);

      const resolvedAddress = await provider.resolveName(reportedName);

      if (getAddress(address) === getAddress(resolvedAddress)) {
        return reportedName;
      }
      return getAddress(address);
    } catch (e) {
      return getAddress(address);
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
export const useLookupAddress = (provider: JsonRpcProvider | Web3Provider, address: string) => {
  const [ensName, setEnsName] = useState(address);
  // const [ensCache, setEnsCache] = useLocalStorage('ensCache_'+address); Writing directly due to sync issues

  useEffect(() => {
    let cache: any = window.localStorage.getItem('ensCache_' + address);
    cache = cache && JSON.parse(cache);

    if (cache && cache.timestamp > Date.now()) {
      setEnsName(cache.name);
    } else if (provider) {
      lookupAddress(provider, address).then((name) => {
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
