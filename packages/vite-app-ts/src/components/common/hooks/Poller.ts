import { useEffect, useRef } from 'react';

// helper hook to call a function regularly in time intervals

export const usePoller = (fn: () => void, delay: number, extraWatch: boolean = false) => {
  const savedCallback = useRef<() => void>();
  // Remember the latest fn.
  useEffect(() => {
    savedCallback.current = fn;
  }, [fn]);
  // Set up the interval.
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
  // run at start too
  useEffect(() => {
    fn();
  }, [extraWatch]);
};
