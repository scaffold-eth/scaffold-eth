import { useState, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";

const useUserAddress = (provider: Web3Provider): string => {
  const [userAddress, setUserAddress] = useState<string>("");

  useEffect(() => {
    const getUserAddress = async (injectedProvider: Web3Provider) => {
      const signer = injectedProvider.getSigner();
      if (signer) setUserAddress(await signer.getAddress());
    };

    if (provider) getUserAddress(provider);
  }, [provider]);

  return userAddress;
};

export default useUserAddress;
