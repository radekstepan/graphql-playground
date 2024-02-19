import { useEffect, useRef, type MutableRefObject, useCallback } from "react";
import debounce from "debounce";
import { useAtom } from "./useAtom";
import { loadingAtom } from "../atoms/loadingAtom";
import { DataStatus } from "../interfaces";

export const useFetchData = <QK>({
  isStaleRef,
  refetch,
  getFragmentFromKey
}: {
  isStaleRef: MutableRefObject<Record<string, DataStatus>>;
  refetch: () => Promise<any>;
  getFragmentFromKey: (key: QK) => string|null;
}) => {
  const isMounted = useRef(true);

  // Track if there's a request in flight and if there's a queued request.
  const isReqInFlightRef = useRef(false);
  const isReqQueued = useRef(false);

  const [, setIsLoading] = useAtom(loadingAtom);

  // Fire off a network request if any data is stale and requested by a component.
  const fetchData = debounce(async () => {
    // If there's no data to fetch, bail out.
    if (!Object.values(isStaleRef.current).find(status => status === DataStatus.REQUESTED)) {
      return;
    }
    // If there's a request in flight, queue another one.
    if (isReqInFlightRef.current) {
      isReqQueued.current = true;
      return;
    }
    isReqInFlightRef.current = true;
    setIsLoading(true);
    refetch().finally(() => {
      isReqInFlightRef.current = false;
      setIsLoading(false);
      // Trigger any queued requests.
      if (isReqQueued.current && isMounted.current) {
        isReqQueued.current = false;
        fetchData();
      }
    });
  }, 200);

  useEffect(() => () => {
    isMounted.current = false;
    fetchData.clear();
  }, []);

  const checkAndFetch = useCallback((fragment: string) => {
    if (isStaleRef.current[fragment] === DataStatus.STALE) {
      isStaleRef.current[fragment] = DataStatus.REQUESTED;
      fetchData();
    }
  }, [fetchData]);

  // Mark stale data as requested by a component.
  return useCallback((queryKey: QK) => {
    const fragment = getFragmentFromKey(queryKey);
    if (fragment) {
      checkAndFetch(fragment);
      return;
    }
    for (const fragment in isStaleRef.current) {
      checkAndFetch(fragment);
    }
  }, []);
}
