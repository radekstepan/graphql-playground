import { useQueryClient } from '@tanstack/react-query';
import { DataStatus } from '../interfaces';
import { type QueryKey } from '../keys';
import { queriesAtom } from '../atoms/queriesAtom';
import { useAtomLazy } from './useAtomLazy';

export const useSetQueryData = () => {
  const queryClient = useQueryClient();

  const [, setQueries] = useAtomLazy(queriesAtom);

  function setQueryData<T>(status: DataStatus.STALE, queryKey: QueryKey): void;
  function setQueryData<T>(status: DataStatus.LATEST, queryKey: QueryKey, value: T): void;

  function setQueryData<T>(status: DataStatus, queryKey: QueryKey, value?: T): void {
    if (status === DataStatus.STALE) {
      setQueries(queries => queries.set(queryKey, status));
      // Invalidate the query so that the components can ask for the latest data.
      queryClient.invalidateQueries({queryKey, exact: true});
    } else if (status === DataStatus.LATEST && value !== undefined) {
      setQueries(queries => queries.set(queryKey, status));
      queryClient.setQueryData(queryKey, value);
    }
  }

  return setQueryData;
};
