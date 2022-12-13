import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import {mergeTypeDefs, mergeResolvers} from '@graphql-tools/merge';

import numbers from './numbers/index.js';

const server = new ApolloServer({
  typeDefs: mergeTypeDefs([
    numbers.typeDefs
  ]),
  resolvers: mergeResolvers([
    numbers.resolvers
  ])
});

const {url} = await startStandaloneServer(server, {
  context: async () => ({}) as any,
  listen: {port: 4000},
});

console.log(`🚀  Server ready at: ${url}`);
