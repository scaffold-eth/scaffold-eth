import { useState, useEffect } from "react";
import { Provider } from "@ethersproject/providers";
import { constants } from "ethers";

/*
  ~ What it does? ~

  Gets address from given ENS name and provider

  ~ How can I use? ~

  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");

  ~ Features ~

  - Specify mainnetProvider
  - Provide ENS name and get address corresponding to given ENS name
*/

const useResolveEnsName = (provider: Provider, ensName: string): string => {
  const [address, setAddress] = useState<string>(constants.AddressZero);

  useEffect(() => {
    if (provider) {
      provider.resolveName(ensName).then((resolvedAddress: string) => setAddress(resolvedAddress));
    }
  }, [provider, ensName]);

  return address;
};

export default useResolveEnsName;
