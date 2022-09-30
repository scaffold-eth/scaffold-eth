import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";

const createProvider = async url => {
  const p = new ethers.providers.StaticJsonRpcProvider(url);

  await p.ready;

  return p;
};

export default function useStaticJsonRPC(urlArray, localProvider = null) {
  const [provider, setProvider] = useState(null);

  const handleProviders = useCallback(async () => {
    try {
      const p = await Promise.race(urlArray.map(createProvider));
      const _p = await p;

      setProvider(_p);
    } catch (error) {
      // todo: show notification error about provider issues
      console.log(error);
    }
  }, [urlArray]);

  useEffect(() => {
    // Re-use the localProvider if it's mainnet (to use only one instance of it)
    if (localProvider && localProvider?._network.chainId === 1) {
      setProvider(localProvider);
      return;
    }

    handleProviders();

    // eslint-disable-next-line
  }, [JSON.stringify(urlArray), localProvider]);

  return provider;
}
