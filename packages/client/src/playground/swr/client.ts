import {SWRConfig} from 'swr';
import {GraphQLClient} from 'graphql-request';

type Client = React.ComponentProps<typeof SWRConfig>['value'];

export const gqlClient = new GraphQLClient('http://localhost:4000');

const client = (): Client => ({
  // Cache.
  provider: () => new Map()
});

export default client;
