import {GraphQLClient} from 'graphql-request';
import {QueryClient} from '@tanstack/react-query'

const client = () => new QueryClient({
  defaultOptions: {
    queries: {
      // https://tanstack.com/query/v4/docs/guides/caching
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      // Make sure we re-render all hooks even if the data doesn't
      //  change between fetches.
      structuralSharing: false
    }
  }
});

export const gqlClient = new GraphQLClient('http://localhost:4000');

export default client;
