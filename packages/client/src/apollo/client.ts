import {ApolloClient, from, HttpLink, InMemoryCache} from '@apollo/client';

const client = () => new ApolloClient({
  link: from([
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
