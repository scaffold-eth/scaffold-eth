import { Provider } from '@ethersproject/providers';
import { Contract, ContractFunction } from 'ethers';
import { useEffect, useState } from 'react';

import { useOnBlock, usePoller } from '~~';

const DEBUG = false;

/**
 * Enables you to read values from contracts and keep track of them in the local React states
 * 
  ~ Features ~
  - Provide readContracts by loading contracts (see more on ContractLoader.js)
  - Specify the name of the contract, in this case it is "YourContract"
  - Specify the name of the variable in the contract, in this case we keep track of "purpose" variable
  - Pass an args array if the function requires
  - Pass pollTime - if no pollTime is specified, the function will update on every new block
 * @param contracts hash of all [contractName]: Contract
 * @param contractName contractName
 * @param functionName functionName
 * @param functionArgs arguments to functions
 * @param pollTime 
 * @param formatter 
 * @param onChange callback for value change
 * @returns 
 */
export const useContractReader = <T>(
  contracts: Record<string, Contract>,
  contractName: string,
  functionName: string,
  functionArgs: any[] = [],
  pollTime?: number,
  formatter?: (_value: T) => T,
  onChange?: (_value?: T) => void
): T | undefined => {
  let adjustPollTime = 0;
  if (pollTime) {
    adjustPollTime = pollTime;
  } else if (!pollTime && typeof functionArgs === 'number') {
    // it's okay to pass poll time as last argument without args for the call
    adjustPollTime = functionArgs;
  }

  const [value, setValue] = useState<T>();
  useEffect(() => {
    if (typeof onChange === 'function') {
      setTimeout(onChange.bind(this, value), 1);
    }
  }, [value, onChange]);

  const updateValue = async (): Promise<void> => {
    try {
      let newValue: T;
      if (DEBUG) console.log('CALLING ', contractName, functionName, 'with args', functionArgs);
      if (functionArgs && functionArgs.length > 0) {
        newValue = await (contracts[contractName][functionName] as ContractFunction<T>)(...functionArgs);
        if (DEBUG)
          console.log(
            'contractName',
            contractName,
            'functionName',
            functionName,
            'args',
            functionArgs,
            'RESULT:',
            newValue
          );
      } else {
        newValue = await (contracts[contractName][functionName] as ContractFunction<T>)();
      }
      if (formatter && typeof formatter === 'function') {
        newValue = formatter(newValue);
      }
      if (newValue !== value) {
        setValue(newValue);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Only pass a provider to watch on a block if we have a contract and no PollTime
  const provider: Provider | undefined =
    contracts && contracts[contractName] && adjustPollTime === 0 ? contracts[contractName].provider : undefined;
  useOnBlock(provider, () => {
    if (contracts && contracts[contractName] && adjustPollTime === 0) {
      void updateValue();
    }
  });

  // Use a poller if a pollTime is provided
  usePoller(
    () => {
      if (contracts && contracts[contractName] && adjustPollTime > 0) {
        if (DEBUG) console.log('polling!', contractName, functionName);
        void updateValue();
      }
    },
    adjustPollTime,
    contracts && contracts[contractName] ? true : false
  );

  return value;
};
