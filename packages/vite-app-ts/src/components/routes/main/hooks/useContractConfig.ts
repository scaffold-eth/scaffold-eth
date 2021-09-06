import { useState, useEffect } from 'react';
import { loadAppContracts } from '~~/helpers/loadAppContracts';
import { TContractConfig } from 'eth-hooks';

export const useContractConfig = (): TContractConfig => {
  const [contractsConfig, setContractsConfig] = useState<TContractConfig>({});

  useEffect(() => {
    const loadFunc = async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await loadAppContracts();
      setContractsConfig(result);
    };
    void loadFunc();
  }, []);
  return contractsConfig;
};
