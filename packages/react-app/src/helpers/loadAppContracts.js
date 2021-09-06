const contractListPromise = import("../contracts/hardhat_contracts.json");
// @ts-ignore
const externalContractsPromise = import("../contracts/external_contracts");

/**
 * LoadsAppContracts
 * - run yarn compile-ts and yarn deploy-ts to generate hardhhat_contracts.json
 * @returns
 */
export const loadAppContracts = async () => {
  const config = {};
  config.deployedContracts = (await contractListPromise).default ?? {};
  config.externalContracts = (await externalContractsPromise).default ?? {};
  return config;
};
