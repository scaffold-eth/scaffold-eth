import { Contract } from '@ethersproject/contracts';
import { Filter, Log } from '@ethersproject/providers';
import { useState, useEffect } from 'react';

const getPastEvents = async (contract: Contract, filter: Filter) => {
  const eventLogs: Log[] = await contract.provider.getLogs(filter);

  return eventLogs.map((log) => contract.interface.parseLog(log).args);
};

export const useEventReader = (contract: Contract, filter?: Filter): any[] => {
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (contract) {
      const eventFilter = {
        address: contract.address,
        fromBlock: 0,
        toBlock: 'latest',
        ...filter,
      };

      try {
        void getPastEvents(contract, eventFilter).then((events) => setUpdates(events));
      } catch (e) {
        // Event "eventName" may not exist on contract
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  }, [contract, filter]);

  return updates;
};
