import {ApolloClient, from, HttpLink} from '@apollo/client';
import {InvalidationPolicyCache} from "@nerdwallet/apollo-cache-policies";
import {GetNumberQueryVariables} from '../../__generated/graphql';

const client = () => new ApolloClient({
  link: from([
    new HttpLink({uri: 'http://localhost:4000'})
  ]),
  cache: new InvalidationPolicyCache({
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
    },
    // This is new.
    invalidationPolicies: {
      types: {
        SaveNumbersResponse: {
          onWrite: ({modify, evict}) => {
            modify({
              fields: {
                // NOTE: The item gets evicted, does not require
                //  variables to be passed in.
                sum: (_ref) => {
                  // evict(_ref);
                }
              }
            });
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
