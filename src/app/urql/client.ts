import {createClient, dedupExchange, fetchExchange} from 'urql';
import {cacheExchange} from '@urql/exchange-graphcache';

const client = () => createClient({
  url: 'http://localhost:4000',
  requestPolicy: 'network-only',
  exchanges: [dedupExchange, cacheExchange({
    resolvers: {
      Query: {
        // Necessary because GetFirst caches a "null" with no type name.
        // We could also discard "number" field on the mutation.
        number(_root, args, _cache, _info) {
          return {
            __typename: 'Number',
            id: args.id
          };
        },
      }
    },
    updates: {
      Mutation: {
        saveNumbers(_result, _args, cache, _info) {
          // Discard 'sum' query.
          cache
            .inspectFields('Query')
            .filter(field => field.fieldName === 'sum')
            .forEach(field =>
              cache.invalidate('Query', field.fieldName, field.arguments)
            );
        }
      }
    }
  }), fetchExchange]
});

export default client;
