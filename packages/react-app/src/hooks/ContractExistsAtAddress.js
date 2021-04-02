import { useEffect, useState } from 'react'
import { isAddress } from '@ethersproject/address'

/*
  ~ What it does? ~

  Checks whether a contract exists on the blockchain, returns true if it exists, otherwise false

  ~ How can I use? ~

  const contractIsDeployed = useContractExistsAtAddress(localProvider, contractAddress);

  ~ Features ~

  - Provide contractAddress to check if the contract is deployed
  - Change provider to check contract address on different chains (ex. mainnetProvider)
*/

const useContractExistsAtAddress = (provider, contractAddress) => {
  const [contractIsDeployed, setContractIsDeployed] = useState(false)

  // We can look at the blockchain and see what's stored at `contractAddress`
  // If we find code then we know that a contract exists there.
  // If we find nothing (0x0) then there is no contract deployed to that address
  useEffect(() => {
    // eslint-disable-next-line consistent-return
    const checkDeployment = async () => {
      if (!isAddress(contractAddress)) return false
      const bytecode = await provider.getCode(contractAddress)
      setContractIsDeployed(bytecode !== '0x0')
    }
    if (provider) checkDeployment()
  }, [provider, contractAddress])

  return contractIsDeployed
}

export default useContractExistsAtAddress
