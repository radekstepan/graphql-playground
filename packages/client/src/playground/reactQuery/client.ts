import {GraphQLClient} from 'graphql-request';
import {QueryClient} from '@tanstack/react-query'

const client = () => new QueryClient({
  defaultOptions: {
    queries: {
      // https://tanstack.com/query/v4/docs/guides/caching
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    }
  }
});

export const gqlClient = new GraphQLClient('http://localhost:4000');

export default client;
