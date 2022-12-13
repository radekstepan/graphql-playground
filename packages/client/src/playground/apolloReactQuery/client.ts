import {ApolloClient, from, HttpLink} from '@apollo/client';
import {GraphQLClient} from 'graphql-request';
import {QueryClient} from '@tanstack/react-query'
import {ARQCache} from './arqCache';

const URI = 'http://localhost:4000';

export const gqlClient = new GraphQLClient(URI);
export let apolloClient: ApolloClient<any>;
export let reactQueryClient: QueryClient;

export const reset = () => {
  apolloClient = new ApolloClient({
    link: from([
      new HttpLink({uri: URI})
    ]),
    cache: new ARQCache({
      typePolicies: {
        Number: {
          keyFields: ['id']
        }
      }
    }),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only'
      }
    }
  });
  
  reactQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // https://tanstack.com/query/v4/docs/guides/caching
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      }
    }
  });
};

reset();
