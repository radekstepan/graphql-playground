import { useContext } from "react";
import { useQuery as useBaseQuery } from "@tanstack/react-query";
import { OverseerContext } from "../providers/OverseerProvider";
import { useAtomLazy } from "./useAtom";
import { useGetQueryData } from "./useGetQueryData";
import { requestDataEvent } from "../events/requestDataEvent";
import { queriesAtom } from "../atoms/queriesAtom";
import { type QueryDataType, type QueryKey } from "../keys";
import { DataStatus } from "../interfaces";

// Components use this to request and read data from the cache.
export function useQuery<T extends QueryKey>(key: T): {
  data: QueryDataType[T['type']] | null | undefined
  isLoading: boolean // initial load
  isFetching: boolean // subsequent fetches
} {
  const {events} = useContext(OverseerContext);
  const getQueryData = useGetQueryData();
  const [getQueries] = useAtomLazy(queriesAtom)

  const { data } = useBaseQuery({
    queryKey: key.key,
    queryFn: () => {
      // Mark that a component requested the data.
      events.emit(requestDataEvent, key);
      // Return the (stale) data from the cache.
      return getQueryData(key) ?? null;
    }
  });

  // Is our fragment fetching?
  if (getQueries().get(key) !== DataStatus.LATEST) {
    return {data, isFetching: true, isLoading: false};
  }

  return {data, isFetching: false, isLoading: data === undefined};
};
