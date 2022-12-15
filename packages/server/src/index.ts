import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import {mergeTypeDefs, mergeResolvers} from '@graphql-tools/merge';

import numbers from './numbers/index.js';
import expense from './expense/index.js';

const server = new ApolloServer({
  typeDefs: mergeTypeDefs([
    numbers.typeDefs,
    expense.typeDefs
  ]),
  resolvers: mergeResolvers([
    numbers.resolvers,
    expense.resolvers
  ])
});

const {url} = await startStandaloneServer(server, {
  context: async () => ({}) as any,
  listen: {port: 4000},
});

console.log(`🚀  Server ready at: ${url}`);
