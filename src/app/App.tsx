import React, {memo, useEffect, useState} from 'react';
import {ApolloProvider} from '@apollo/client';
import {QueryClientProvider,} from '@tanstack/react-query'
import Apollo from './apollo/Apollo';
import apolloClient from './apollo/client';
import TanStack from './tanstack/TanStack';
import tanstackClient from './tanstack/client';
import css from './utils/css';

function Content({active}) {
  switch (active) {
    case 0:
      return (
        <ApolloProvider client={apolloClient}>
          <Apollo />
        </ApolloProvider>    
      );
    case 1:
      return (
        <QueryClientProvider client={tanstackClient}>
          <TanStack />
        </QueryClientProvider>
      )
    default:
      return null
  }
}

const ContentM = memo(Content);

function App() {
  const [flash, setFlash] = useState(false);
  const [active, setActive] = useState(-1);
  
  useEffect(() => {
    if (active === -1) {
      return;
    }
    setFlash(true);
    const t = setTimeout(() => {
      setFlash(false)
    }, 500);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <>
      <div className="select">
        {['Apollo', 'TanStack'].map((d, i) => (
          <div key={i}>
            <input
              type="radio"
              className="radio"
              value={i}
              name="content"
              checked={active === i}
              onChange={() => setActive(i)}
            />
            <label className="label" onClick={() => setActive(i)}>{d}</label>
          </div>
        ))}
      </div>
      <div className={css('content', flash && 'flash')}>
        <ContentM active={active} />
      </div>
    </>
  );
}

export default App;
