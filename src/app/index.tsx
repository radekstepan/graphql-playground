import * as React from 'react'
import {createRoot} from 'react-dom/client';
import {ApolloProvider} from '@apollo/client';
import {QueryClientProvider,} from '@tanstack/react-query'
import Apollo from './apollo/Apollo';
import apolloClient from './apollo/client';
import TanStack from './tanstack/TanStack';
import tanstackClient from './tanstack/client';
import './styles.less'

const root = createRoot(document.getElementById('root'));

root.render(
  <>
    <div className="header">Apollo</div>
    <ApolloProvider client={apolloClient}>
      <Apollo />
    </ApolloProvider>

    <div className="header">TanStack</div>
    <QueryClientProvider client={tanstackClient}>
      <TanStack />
    </QueryClientProvider>
  </>
);
