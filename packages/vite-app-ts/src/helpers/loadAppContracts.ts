import { TDeployedContracts, TExternalContracts } from 'eth-hooks/models';
import { TContractConfig } from 'eth-hooks';

const contractListPromise = import('../generated/contracts/hardhat_contracts.json');
/**
 * - run yarn compile-ts and yarn deploy-ts to generate hardhhat_contracts.json
 */
// @ts-ignore
const externalContractsPromise = import('../generated/contracts/external_contracts');

/**
 * LoadsAppContracts
 * - run yarn compile-ts and yarn deploy-ts to generate hardhhat_contracts.json
 * @returns
 */
export const loadAppContracts = async (): Promise<TContractConfig> => {
  const config: TContractConfig = {};
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  config.deployedContracts = ((await contractListPromise).default ?? {}) as unknown as TDeployedContracts;
  config.externalContracts = ((await externalContractsPromise).default ?? {}) as unknown as TExternalContracts;
  return config;
};
