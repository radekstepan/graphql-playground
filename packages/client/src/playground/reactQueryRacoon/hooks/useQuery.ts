import { useQuery as useBaseQuery } from "@tanstack/react-query";
import { useGetQueryData } from "./useGetQueryData";
import { useOverseer } from "./useOverseer";
import { requestDataEvent } from "../events/requestDataEvent";
import { QueryDataType, QueryKey } from "../keys";
import { useAtomLazy } from "./useAtom";
import { queriesAtom } from "../atoms/queriesAtom";
import { DataStatus } from "../interfaces";

// Components use this to request and read data from the cache.
export function useQuery<T extends QueryKey>(key: T): {
  data: QueryDataType[T['type']] | null | undefined
  isFetching: boolean // tanstackism; isLoading is only for init
} {
  const getQueryData = useGetQueryData();
  const [getQueries] = useAtomLazy(queriesAtom)
  const {events} = useOverseer();

  const { data } = useBaseQuery({
    queryKey: key.key,
    queryFn: () => {
      // Mark that a component requested the data.
      events.emit(requestDataEvent, key);
      // Get the data from the cache.
      return getQueryData(key) ?? null;
    }
  });

  // Is our fragment loading?
  const queries = getQueries();
  const status = queries.get(key);
  // Don't show stale data.
  if (status !== DataStatus.LATEST) {
    return {data: undefined, isFetching: true};
  }

  return {data, isFetching: false};
};
