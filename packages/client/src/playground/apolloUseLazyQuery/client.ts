import {ApolloClient, from, HttpLink, InMemoryCache} from '@apollo/client';
import {GetNumberQueryVariables} from '../../__generated/graphql';

const client = () => new ApolloClient({
  link: from([
    new HttpLink({uri: 'http://localhost:4000'})
  ]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Necessary because GetFirst caches a "null" with no type name.
          number: {
            read(_obj, options) {
              const args = options.args as GetNumberQueryVariables;
              return options.toReference({
                __typename: 'Number',
                id: args.id
              });
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only'
    }
  }
});

export default client;
