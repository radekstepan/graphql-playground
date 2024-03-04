import { useQueryClient } from "@tanstack/react-query";
import { type QueryDataType, type QueryKey } from "../keys";

export const useGetQueryData = () => {
  const client = useQueryClient();

  return <T extends QueryKey>(queryKey: T): QueryDataType[T['type']] | undefined =>
    client.getQueryData(queryKey.key);
};
