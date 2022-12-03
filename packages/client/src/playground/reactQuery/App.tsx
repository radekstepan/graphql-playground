import React, {useState} from 'react'
import {useUpdate, useRendersCount} from 'react-use';
import {QueryClientProvider} from '@tanstack/react-query';
import client from './client';
import First from './First';
import Numbers from './Numbers';
import Sum from './Sum';

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
    </>
  );
};

function Wrapper() {
  return (
    <QueryClientProvider client={client()}>
      <App />
    </QueryClientProvider>
  )
};

export default Wrapper;
