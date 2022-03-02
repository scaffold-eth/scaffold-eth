import { useEffect, useState } from "react";

const useMyReader = (contract, method, args) => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const parsedArgs = args ? JSON.parse(args) : [];

    const id = setInterval(async () => {
      if (!contract) return;
      const methodResult = await contract[method](...parsedArgs);
      setResult(methodResult);
    }, 2000);

    if (id) return () => clearInterval(id);
  }, [contract, method, args]);

  return result;
};

export default useMyReader;
