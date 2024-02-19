import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Mark a key as invalidated.
export const useInvalidateQuery = () => {
  const client = useQueryClient();
  return useCallback((key: unknown[]) => {
    client.invalidateQueries(['$invalidate', ...key]);
  }, [client]);
}
