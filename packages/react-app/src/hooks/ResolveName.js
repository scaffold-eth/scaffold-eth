import { useState, useEffect } from "react";
import { Provider } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";

const useResolveName = (provider, ensName) => {
  const [address, setAddress] = useState(AddressZero);

  useEffect(() => {
    if (provider) {
      provider.resolveName(ensName).then((resolvedAddress) => setAddress(resolvedAddress));
    }
  }, [provider, ensName]);

  return address;
};

export default useResolveName;
