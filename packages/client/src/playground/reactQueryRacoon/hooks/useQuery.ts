import { useQuery as useBaseQuery } from "@tanstack/react-query";
import { useGetQueryData } from "./useGetQueryData";
import { useOverseer } from "./useOverseer";
import { requestDataEvent } from "../events/requestDataEvent";
import { QueryDataType, QueryKey } from "../keys";

// Requests and reads data from the cache.
export function useQuery<T extends QueryKey>(key: T): QueryDataType[T['type']] | null | undefined {
  const getQueryData = useGetQueryData();
  const {events} = useOverseer();

  const { data } = useBaseQuery({
    queryKey: key.key,
    queryFn: () => {
      // Mark that a component requested the data.
      events.emit(requestDataEvent, key);
      // Get the data from the cache.
      return getQueryData(key) ?? null; // cannot return undefined
    }
  });

  return data;
};
