import * as React from 'react'
import {createRoot} from 'react-dom/client';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import App from './App';
import './styles.less'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});

const root = createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);
