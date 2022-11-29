import React, {memo, useEffect, useState} from 'react';
import {request} from 'graphql-request';

import Apollo from './playground/apollo/App';
import ApolloLatestLink from './playground/apolloLatestLink/App';
import TanStack from './playground/tanstack/App';
import Urql from './playground/urql/App';

import css from './utils/css';
import {SERVER_URL} from './const';
import {RESET} from './queries';

function Content({active}) {
  active >= 0 && request(SERVER_URL, RESET);

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
