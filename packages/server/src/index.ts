import {ApolloServer} from '@apollo/server';
import {startStandaloneServer} from '@apollo/server/standalone';
import {mergeTypeDefs, mergeResolvers} from '@graphql-tools/merge';

import report from './report/index.js';

import * as data from './data.js';

const server = new ApolloServer({
  typeDefs: mergeTypeDefs([
    report.typeDefs
  ]),
  resolvers: mergeResolvers([
    report.resolvers,
    data.resolvers
  ])
});

const {url} = await startStandaloneServer(server, {
  context: async () => ({}) as any,
  listen: {port: 4000},
});

console.log(`🚀  Server ready at: ${url}`);
