import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";

const createProvider = async url => {
  try {
    // console.log("n-url: ", url);
    const p = new ethers.providers.StaticJsonRpcProvider(url);
    // console.log("n-p:Load ", p);

    let isReady = await p.ready;
    return p;
  } catch (error) {
    console.log("n-error: ", error);
  }
};

const loadMainnetProvider = async urls => {
  return new Promise(async (resolve, reject) => {
    let loadedProvider = null;
    for (const url of urls) {
      try {
        const provider = new ethers.providers.StaticJsonRpcProvider(url);
        let network = await provider.detectNetwork();
        if (network) {
          loadedProvider = provider;
          break;
        } else {
          continue;
        }
      } catch (err) {
        console.log("n-err: ", err);
        // reject(err);
        continue;
      }
    }
    if (loadedProvider !== null) {
      resolve(loadedProvider);
    }

    if (loadedProvider === null) {
      reject(new Error("can't reach any rpc"));
    }
  });
};

export default function useStaticJsonRPC(localUrl, urlArray, isMainnet) {
  const [provider, setProvider] = useState({ provider: null, mainnetProvider: null });

  const handleProviders = useCallback(async () => {
    try {
      // old race condition logic which is calling all rcp's
      // const p = await Promise.race(urlArray.map(createProvider));
      // const mainnetProvider = await p;

      // load an first rpc from array if it is not available try second and so on..
      if (isMainnet) {
        let provider = await loadMainnetProvider(urlArray);
        setProvider({ provider, mainnetProvider: null });
      } else {
        let mainnetProvider = await loadMainnetProvider(urlArray);
        let provider = await createProvider(localUrl);
        setProvider({ provider, mainnetProvider });
      }
    } catch (error) {
      // todo: show notification error about provider issues
      console.log(error);
    }
  }, [localUrl, JSON.stringify(urlArray), isMainnet]);

  useEffect(() => {
    handleProviders();
    // eslint-disable-next-line
  }, [localUrl, JSON.stringify(urlArray)]);

  return provider;
}
