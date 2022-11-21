import {GraphQLClient} from 'graphql-request';
import {DocumentNode} from 'graphql';
import {
  useQuery as useReactQuery,
  useMutation as useReactMutation,
  QueryClient,
  useQueryClient
} from '@tanstack/react-query'

const client = () => new QueryClient({
  defaultOptions: {
    queries: {
      // https://tanstack.com/query/v4/docs/guides/caching
      staleTime: Infinity
    }
  }
});

const gqlClient = new GraphQLClient('http://localhost:4000');

export const useQuery = (
  queryKey: any[],
  gql: DocumentNode|string
) =>
  useReactQuery(queryKey, () => gqlClient.request(gql));

export const useMutation = (
  queryKey: any[],
  gql: DocumentNode|string
) => {
  const client = useQueryClient();

  return useReactMutation({
    mutationFn: (variables) => gqlClient.request(gql, variables),
    // https://tanstack.com/query/v4/docs/guides/query-invalidation
    onSuccess: () => client.invalidateQueries({queryKey})
  });
};

export default client;
