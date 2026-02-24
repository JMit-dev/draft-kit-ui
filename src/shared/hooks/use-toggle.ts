import { useCallback, useState } from 'react';

export function useToggle(initial: boolean = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle] as const;
}
