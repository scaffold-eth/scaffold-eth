import { useEffect } from "react";
import { useLatestRef } from "eth-hooks";

// helper hook to call a function regularly in time intervals

export default function usePoller(fn, delay, extraWatch) {
  const savedCallback = useLatestRef();
  // Set up the interval.
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, savedCallback]);
  // run at start too
  useEffect(() => {
    fn();
  }, [extraWatch]);
}
