import { useQueryClient } from '@tanstack/react-query';
import { DataStatus } from '../interfaces';
import { type QueryDataType, type QueryKey } from '../keys';
import { queriesAtom } from '../atoms/queriesAtom';
import { useAtomSetter } from './useAtom';

// Keep query staleness and cache data in sync.
export const useSetQueryData = () => {
  const queryClient = useQueryClient();

  const setQueries = useAtomSetter(queriesAtom);

  function setQueryData(status: DataStatus.STALE, queryKey: QueryKey): void;
  function setQueryData(status: DataStatus.LATEST, queryKey: QueryKey, value: QueryDataType[QueryKey['type']]): void;

  function setQueryData(status: DataStatus, queryKey: QueryKey, value?: QueryDataType[QueryKey['type']]): void {
    // Data is stale, need to clear the cache.
    if (status === DataStatus.STALE) {
      setQueries(queries => queries.set(queryKey, status));
      // Exact = do not invalidate child queries.
      queryClient.invalidateQueries({queryKey: queryKey.key, exact: true});
    // Data has arrived, update the cache.
    } else if (status === DataStatus.LATEST && value !== undefined) {
      setQueries(queries => queries.set(queryKey, status));
      queryClient.setQueryData(queryKey.key, value);
    } else {
      throw new Error('Invalid status or missing value');
    }
  }

  return setQueryData;
};
