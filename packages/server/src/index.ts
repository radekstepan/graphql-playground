import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import {mergeTypeDefs, mergeResolvers} from '@graphql-tools/merge';

import numbers from './numbers/index.js';
import expense from './expense/index.js';
import racoon from './racoon/index.js';

import * as data from './data.js';

const server = new ApolloServer({
  typeDefs: mergeTypeDefs([
    numbers.typeDefs,
    expense.typeDefs,
    racoon.typeDefs
  ]),
  resolvers: mergeResolvers([
    numbers.resolvers,
    expense.resolvers,
    racoon.resolvers,
    data.resolvers
  ])
});

const {url} = await startStandaloneServer(server, {
  context: async () => ({}) as any,
  listen: {port: 4000},
});

console.log(`🚀  Server ready at: ${url}`);
