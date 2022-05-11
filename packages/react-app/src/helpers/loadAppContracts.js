// @ts-ignore
const externalContractsPromise = import('../contracts/external_contracts')

export const loadAppContracts = async () => {
  const config = {}
  config.deployedContracts = {}
  config.externalContracts = (await externalContractsPromise).default ?? {}
  return config
}
