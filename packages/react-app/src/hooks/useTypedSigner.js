import { useCallback } from "react";

export default function useTypedSigner(userSigner, domain) {
  const typedSigner = useCallback(
    async (types, value) => {
      return await userSigner._signTypedData(domain, types, value);
    },
    [userSigner, domain],
  );

  return typedSigner;
}
