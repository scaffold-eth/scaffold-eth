import { useState, useEffect } from "react";
import { Provider } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";

const useResolveEnsName = (provider: Provider, ensName: string): string => {
  const [address, setAddress] = useState<string>(AddressZero);

  useEffect(() => {
    if (provider) {
      provider.resolveName(ensName).then((resolvedAddress: string) => setAddress(resolvedAddress));
    }
  }, [provider, ensName]);

  return address;
};

export default useResolveEnsName;
