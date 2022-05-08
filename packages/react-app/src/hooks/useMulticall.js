import { useState, useMemo, useEffect } from "react";
import { ethers } from "ethers";
import { Multicall } from "ethereum-multicall";
import { useOnBlock } from "eth-hooks";

const FormatTypes = ethers.utils.FormatTypes;
// params = { "UNI": { "aggregate": [] } }

export default function useMultiCall(contracts, params, provider) {
  const [returnValues, setReturnValues] = useState({});
  const multicall = useMemo(() => {
    return provider ? new Multicall({ ethersProvider: provider, tryAggregate: true }) : null;
  }, [provider]);
  const contractCallContext = useMemo(() => {
    return Object.keys(params).reduce((acc, curr) => {
      // compile contract info here
      const contractItem = contracts[curr] || {};
      const formattedCallsObj = params[curr];

      if (contractItem.interface && contractItem.address) {
        const abi = contractItem.interface.format(FormatTypes.json);
        const address = contractItem.address;
        const calls = Object.keys(formattedCallsObj).reduce((callAcc, currFunc) => {
          const cObj = formattedCallsObj[currFunc].map(item => ({
            reference: item.key,
            methodName: currFunc,
            methodParameters: item.params || [],
          }));

          return [...callAcc, ...cObj];
        }, []);

        acc.push({
          reference: curr,
          contractAddress: address,
          abi: JSON.parse(abi),
          calls,
        });
      }

      return acc;
    }, []);
  }, [contracts, params]);

  console.log({ contractCallContext });

  useOnBlock(provider, async () => {
    const { results } = await multicall.call(contractCallContext);

    const formattedReturnValues = Object.keys(results).reduce((acc, curr) => {
      acc[curr] = {};

      results[curr].callsReturnContext.forEach(res => {
        const key = { [res.reference]: res.returnValues };
        acc[curr][res.methodName] = acc[curr][res.methodName] ? { ...acc[curr][res.methodName], ...key } : key;
      });

      return acc;
    }, {});

    setReturnValues(formattedReturnValues);
  });

  return returnValues;
}
