import { useLayoutEffect, useRef} from "react";

/*
  ~ What it does? ~

  Keeps a stable reference to a value, that persists between renders

  This is good for enabling non-primitive values to be used inside
  hooks that have a dependency array, without invalidating the hook
  on every render.
*/

const useLatestRef = (value) => {
  const ref = useRef(value)

  useLayoutEffect(() => {
    ref.current = value
  }, [value]);
  
  return ref;
};

export default useLatestRef;