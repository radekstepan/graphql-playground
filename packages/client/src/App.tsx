import React, {memo, useEffect, useState} from 'react';
import Apollo from './playground/apollo/Apollo';
import ApolloLatestLink from './playground/apolloLatestLink/Apollo';
import TanStack from './playground/tanstack/TanStack';
import Urql from './playground/urql/Urql';
import css from './utils/css';

function Content({active}) {
  switch (active) {
    case 0:
      return <Apollo />;
    case 1:
      return <ApolloLatestLink />;
    case 2:
      return <TanStack />;
    case 3:
      return <Urql />;
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
        {[
          'Vanilla Apollo',
          'Apollo w/ LatestLink',
          'TanStack Query',
          'urql'
        ].map((d, i) => (
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
