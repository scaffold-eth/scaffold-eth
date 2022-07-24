import { useBlockNumber } from "wagmi";

function useOnBlockNumber({
  chainId,
  watch,
  cacheTime,
  enabled,
  staleTime,
  suspense,
  onBlock,
  onSuccess,
  onError,
  onSettled,
}) {
  const blockNumber = useBlockNumber({
    chainId: chainId,
    watch: watch,
    cacheTime: cacheTime,
    onSuccess: onSuccess,
  });

  return blockNumber;
}

export default useOnBlockNumber;
