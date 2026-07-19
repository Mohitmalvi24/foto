import { useEffect, useState } from 'react';

/**
 * Debounces a value by the given delay.
 * Returns the debounced value that only updates after the delay has elapsed
 * since the last change.
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
