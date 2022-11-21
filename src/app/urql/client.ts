import {createClient, dedupExchange, fetchExchange} from 'urql';
import {cacheExchange} from '@urql/exchange-graphcache';

const client = () => createClient({
  url: 'http://localhost:4000',
  requestPolicy: 'network-only',
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        saveNumbers(_result, _args, cache, _info) {
          const key = 'Query';
          // Discard 'sum' and 'count' queries.
          cache
            .inspectFields(key)
            .filter(field => ['sum', 'count'].includes(field.fieldName))
            .forEach(field =>
              cache.invalidate(key, field.fieldName, field.arguments)
            );
        }
      }
    }
  }), fetchExchange]
});

export default client;
