import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating the returned value until
 * the input hasn't changed for `delay` ms.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchTerm, 500);
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
