import * as React from 'react'
import {createRoot} from 'react-dom/client';
import {ApolloProvider} from '@apollo/client';
import App from './components/App';
import client from './apollo/client';
import './styles.less'

const root = createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
);
