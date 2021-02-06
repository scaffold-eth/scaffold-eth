import { useState, useEffect } from "react";
import { AddressZero } from "@ethersproject/constants";

const useResolveName = (provider, ensName) => {
  const [state, setState] = useState({ addressFromENS: AddressZero, loading: true, error: "" });

  const handleInvalidENS = () => {
    setState({
      loading: false,
      error: "Invalid ENS name",
    });
  };

  useEffect(() => {
    setState({
      loading: true,
    });

    if (provider) {
      provider
        .resolveName(ensName)
        .then(resolvedAddress => {
          if (resolvedAddress) {
            setState({
              addressFromENS: resolvedAddress,
              loading: false,
              error: "",
            });
          } else {
            handleInvalidENS();
          }
        })
        .catch(handleInvalidENS);
    } else {
      setState({
        loading: false,
        error: "No provider was given",
      });
    }
  }, [provider, ensName]);

  return state;
};

export default useResolveName;
