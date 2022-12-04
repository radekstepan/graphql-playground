import {useState, useCallback, DependencyList} from 'react';
import {useMountedState} from 'react-use';

// CSS class names in a declarative and readable way.
export const css = (...classes: unknown[]) => classes.filter(Boolean).join(' ');

interface Result<F extends () => unknown> {
  data: Awaited<ReturnType<F>>|null,
  loading: boolean,
  error: unknown
}

// Wrap a mutation promise in a hook.
export function useMutation<T = any>(
  promiseFn: () => Promise<T>,
  deps: DependencyList = []
): [() => void, Result<typeof promiseFn>] {
  const [result, setResult] = useState<Result<typeof promiseFn>>({
    data: null,
    loading: true,
    error: null,
  });

  const isMounted = useMountedState();

  const execute = useCallback(() => {
    promiseFn()
      .then((data) => isMounted() && setResult({
        data: data as any,
        loading: false,
        error: null
      }))
      .catch((error: unknown) => isMounted() && setResult({
        data: null,
        loading: false,
        error
      }));
  }, deps);

  return [execute, result];
}
