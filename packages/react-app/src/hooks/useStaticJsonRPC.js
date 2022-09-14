import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";

const createProvider = async url => {
  // console.log("n-url: ", url);
  const p = new ethers.providers.StaticJsonRpcProvider(url);

  let isReady = await p.ready;
  // console.log("n-isReady: ", isReady);

  return p;
};

const loadMainnetProvider = async urls => {
  console.log("n-urls: ", urls);
  return new Promise(async (resolve, reject) => {
    let loadedUrl;
    for (const url of urls) {
      console.log("n-url: ", url);

      try {
        const provider = new ethers.providers.StaticJsonRpcProvider(url);
        let isReady = await provider.ready;
        loadedUrl = url;
        break;
      } catch (err) {
        console.log("n-err: ", err);
      }
    }
    console.log("n-loadedUrl: ", loadedUrl);
  });
};

export default function useStaticJsonRPC(localUrl, urlArray) {
  const [provider, setProvider] = useState({ localProvider: null, mainnetProvider: null });

  const handleProviders = useCallback(async () => {
    try {
      // let mainnetProvider1 = await loadMainnetProvider(urlArray);
      // console.log("n-mainnetProvider1: ", mainnetProvider1);

      const p = await Promise.race(urlArray.map(createProvider));
      const mainnetProvider = await p;
      let localProvider = await createProvider(localUrl);

      console.log("n-p:FINAL ", localProvider, mainnetProvider);
      setProvider({ localProvider, mainnetProvider });
    } catch (error) {
      // todo: show notification error about provider issues
      console.log(error);
    }
  }, [localUrl, JSON.stringify(urlArray)]);

  useEffect(() => {
    handleProviders();
    // eslint-disable-next-line
  }, [localUrl, JSON.stringify(urlArray)]);

  return provider;
}
