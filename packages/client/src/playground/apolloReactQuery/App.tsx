import React, {useEffect, useState} from 'react'
import {useUpdate, useRendersCount} from 'react-use';
import {ApolloProvider} from '@apollo/client';
import {QueryClientProvider} from '@tanstack/react-query';
import {apolloClient, reactQueryClient, reset} from './client';
import First from './First';
import Numbers from './Numbers';
import Sum from './Sum';
import Expenses from './Expenses';

function App() {
  const [showSum, setShowSum] = useState(false);
  const onUpdate = useUpdate();
  const count = useRendersCount();

  return (
    <>
      <code>
        sum(<Numbers
          onFocus={() => setShowSum(false)}
          onUpdate={() => setShowSum(true)}
        />)
        {showSum && (
          <>
            {' = '}
            <Sum />
          </>
        )}
      </code>
      <input
        className="render"
        type="button"
        value={`Render ${count}`}
        onClick={onUpdate}
      />
      <First />
      <Expenses />
    </>
  );
};

function Wrapper() {
  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={reactQueryClient}>
        <App />
      </QueryClientProvider>
    </ApolloProvider>  
  );
}

export default Wrapper;
