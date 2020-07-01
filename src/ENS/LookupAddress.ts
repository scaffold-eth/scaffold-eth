import { useState, useEffect } from "react";
import { Provider } from "@ethersproject/providers";
import { getAddress } from "@ethersproject/address";

const lookupAddress = async (provider: Provider, address: string): Promise<string> => {
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

const useLookupAddress = (provider: Provider, address: string): string => {
  const [ensName, setEnsName] = useState<string>(address);

  useEffect(() => {
    if (provider) {
      lookupAddress(provider, address).then((name: string) => setEnsName(name));
    }
  }, [provider, address]);

  return ensName;
};

export default useLookupAddress;
