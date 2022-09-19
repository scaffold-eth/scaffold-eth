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
    //  localProvider is null  and urlArray's first index is localhost then load localprovider
    if (localProvider === null && urlArray[0].includes("localhost")) {
      handleProviders();
    }

    //  localProvider is not  null check chain id if it is mainnet id  then set provider
    if (localProvider !== null && localProvider?._network.chainId === 1) {
      setProvider(provider);
    }

    //  localProvider is not  null and chain id is not 1 then load mainnet provider
    if (localProvider !== null && localProvider?._network.chainId !== 1) {
      handleProviders();
    }

    // eslint-disable-next-line
  }, [JSON.stringify(urlArray), localProvider]);

  return provider;
}
