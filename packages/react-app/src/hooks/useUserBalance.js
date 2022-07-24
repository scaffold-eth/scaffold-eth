import { useBalance } from "wagmi";

function useUserBalance({
  address,
  chainId,
  watch,
  formatUnits,
  token,
  cacheTime,
  enabled,
  staleTime,
  suspense,
  onError,
  onSettled,
  onSuccess,
}) {
  const { data, isError, error, isLoading } = useBalance({
    addressOrName: address,
    chainId: chainId,
    watch: watch,
  });

  if (isLoading) return { loading: true };
  if (isError) return { error: error };

  if (!isError && !isLoading) return data ? data : 0;
}

export default useUserBalance;
