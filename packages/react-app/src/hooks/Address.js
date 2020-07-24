import { useCallback, useState } from "react";
import usePoller from "./Poller";

const useAddress = provider => {
  const [address, setAddress] = useState();

  const getAddress = useCallback(async () => {
    if (provider) {
      const accounts = await provider.listAccounts();
      if (accounts && accounts[0] && accounts[0] !== address) {
        // console.log("ADDRESS: ",accounts[0])
        setAddress(accounts[0]);
      }
    }
  }, [provider]);

  usePoller(() => getAddress(provider), 1999);
  return address;
};

export default useAddress;
