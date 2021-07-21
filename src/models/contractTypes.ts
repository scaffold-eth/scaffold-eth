import { Contract } from 'ethers';

export type TDeployedContracts = {
  [key in number]: {
    [key in string]: {
      name: string;
      chainId: string;
      contracts: Record<string, Contract>;
    };
  };
};

export type TExternalContracts = {
  [key in number]: {
    name?: string;
    chainId?: string;
    contracts: Record<string, Contract>;
  };
};
