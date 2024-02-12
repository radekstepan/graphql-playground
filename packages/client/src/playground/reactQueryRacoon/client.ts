import {GraphQLClient} from 'graphql-request';
import {QueryClient} from '@tanstack/react-query'

const client = () => new QueryClient({
  defaultOptions: {
    queries: {
      // https://tanstack.com/query/v4/docs/guides/caching
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      cacheTime: 0, // do not cache any queries
      retry: 0, // do not retry any queries
    }
  }
});

export const gqlClient = new GraphQLClient('http://localhost:4000');

export default client;
