import contractList from "../contracts/hardhat_contracts.json";
// @ts-ignore
import externalContracts from "../contracts/external_contracts";

export const loadAppContracts = async () => {
  const config = {};
  config.deployedContracts = contractList;
  config.externalContracts = externalContracts;
  return config;
};
