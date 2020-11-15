import { useState, useEffect } from "react";
import { getAddress } from "@ethersproject/address";
import { useLocalStorage } from "."

const lookupAddress = async (provider, address) => {
  try {
    // Accuracy of reverse resolution is not enforced.
    // We then manually ensure that the reported ens name resolves to address
    const reportedName = await provider.lookupAddress(address);
    const resolvedAddress = await provider.resolveName(reportedName);
    if (getAddress(address) === getAddress(resolvedAddress)) {
      return reportedName;
    }
  } catch (e) {
    // Do nothing
  }
  return "";
};

const useLookupAddress = (provider, address) => {
  const [ensName, setEnsName] = useState(address);
  const [ensCache, setEnsCache] = useLocalStorage('ensCache_'+address);

  useEffect(() => {
    if( ensCache && ensCache.timestamp>Date.now()){
      setEnsName(ensCache.name)
    }else{
      if (provider) {
        lookupAddress(provider, address).then((name) => {
          setEnsName(name)
          setEnsCache({
            timestamp:Date.now()+360000,
            name:name
          })
        });
      }
    }
  }, [ensCache, provider, address, setEnsName, setEnsCache]);

  return ensName;
};

export default useLookupAddress;
