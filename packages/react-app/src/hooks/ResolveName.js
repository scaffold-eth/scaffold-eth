import { useState, useEffect } from "react";
import { AddressZero } from "@ethersproject/constants";

/*
  ~ What it does? ~

  Gets address from given ENS name and provider

  ~ How can I use? ~

  const addressFromENS = useResolveName(mainnetProvider, "austingriffith.eth");

  ~ Features ~

  - Specify mainnetProvider
  - Provide ENS name and get address corresponding to given ENS name
*/

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
