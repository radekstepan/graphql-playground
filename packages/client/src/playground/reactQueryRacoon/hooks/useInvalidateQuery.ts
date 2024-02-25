import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { INVALIDATE_KEY_PREFIX } from "../constants";

// Mark a key as invalidated.
export const useInvalidateQuery = () => {
  const client = useQueryClient();
  return useCallback((key: unknown[]) => {
    client.invalidateQueries([INVALIDATE_KEY_PREFIX, ...key]);
  }, [client]);
}
