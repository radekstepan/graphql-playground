import {ApolloClient, from, HttpLink, InMemoryCache} from '@apollo/client';
import isLatestLink from './IsLatestLink';

const client = () =>new ApolloClient({
  link: from([
    isLatestLink.use(),
    new HttpLink({uri: 'http://localhost:4000'})
  ]),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only'
    }
  }
});

export default client;
