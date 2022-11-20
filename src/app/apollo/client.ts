import {ApolloClient, from, HttpLink, InMemoryCache} from '@apollo/client';
import InvalidateLink from './InvalidateLink';

const client = new ApolloClient({
  link: from([
    new InvalidateLink(),
    new HttpLink({uri: 'http://localhost:4000'})
  ]),
  cache: new InMemoryCache(),
});

export default client;
