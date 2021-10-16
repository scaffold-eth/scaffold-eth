import { useState, useEffect } from "react";
import { loadAppContracts } from "../helpers/loadAppContracts";

export const useContractConfig = (extraConfig = {}) => {
  const [contractsConfig, setContractsConfig] = useState({});

  useEffect(() => {
    const loadFunc = async () => {
      const result = await loadAppContracts();
      setContractsConfig({ ...result, ...extraConfig });
    };
    void loadFunc();
  }, [JSON.stringify(extraConfig)]);
  return contractsConfig;
};
