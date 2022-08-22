import { useEffect, useState } from "react";

export default function useDebounce(value: any, delay?: number): any {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => clearTimeout(timer);
  })

  return debouncedValue;
}