import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Internally marks the data as stale and invalidates the actual query.
export const useOnInvalidate = (key: unknown[], cb: () => void) => {
  const isMounted = useRef(false);
  const client = useQueryClient();
  useQuery({
    // NOTE: React Query deduplicates queries with the same key.
    queryKey: ['$invalidate', ...key],
    queryFn: () => {
      // Do not call on initial mount.
      if (!isMounted.current) {
        return null;
      }
      // Mark the data as stale in a provider.
      cb();
      // Invalidate the query so that components using this data
      //  will mark the data as "requested".
      client.invalidateQueries(key);
      return null;
    }
  });

  useEffect(() => {
    isMounted.current = true;
  }, []);
}
