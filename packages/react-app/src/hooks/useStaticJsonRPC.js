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

      // set localProviders internal polling interval
      // _p.pollingInterval = 50000;

      setProvider(_p);
    } catch (error) {
      // todo: show notification error about provider issues
      console.log(error);
    }
  }, [urlArray]);

  useEffect(() => {
    //  localProvider is null  and urlArray's length is 1 then load a first  localProvider
    if (localProvider === null && urlArray.length === 1) {
      handleProviders();
    }

    //  localProvider is not  null check chain id if it is mainnet id  then set provider
    if (localProvider !== null && localProvider?._network.chainId === 1) {
      setProvider(localProvider);
    }

    //  localProvider is not  null and chain id is not 1 then load mainnet provider
    if (localProvider !== null && localProvider?._network.chainId !== 1) {
      handleProviders();
    }

    // eslint-disable-next-line
  }, [JSON.stringify(urlArray), localProvider]);

  return provider;
}
