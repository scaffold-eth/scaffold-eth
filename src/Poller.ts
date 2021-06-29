import { useEffect, useRef } from 'react';

/**
 * helper hook to call a function regularly in time intervals
 * @param fn
 * @param delay
 * @param extraWatch
 */
export const usePoller = (fn: () => void, delay: number, extraWatch: boolean): void => {
  const savedCallback = useRef<() => void>();

  // Remember the latest fn.
  useEffect(() => {
    savedCallback.current = fn;
  }, [fn]);

  // Set up the interval.
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
  }, [extraWatch, fn]);
};
