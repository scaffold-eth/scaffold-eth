import { useState, useEffect } from "react";
import BurnerProvider from "burner-provider";
import { Web3Provider } from "@ethersproject/providers";
import { isAddress } from "@ethersproject/address";
import useUserAddress from "./UserAddress";

const useUserProvider = (provider: Web3Provider): Web3Provider => {
  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>(provider);
  const userAddress = useUserAddress(provider);

  useEffect(() => {
    // If provider is read-only, generate a burner wallet.
    setInjectedProvider(
      isAddress(userAddress) ? provider : new Web3Provider(new BurnerProvider(provider.connection.url)),
    );
  }, [userAddress, provider]);

  return injectedProvider;
};

export default useUserProvider;
