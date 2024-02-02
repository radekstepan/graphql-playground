import React, {memo, useEffect, useState} from 'react';
import {request} from 'graphql-request';

import Apollo from './playground/apollo/App';
import ApolloLatestLink from './playground/apolloLatestLink/App';
import ApolloCachePolicies from './playground/apolloCachePolicies/App';
import ApolloUseLazyQuery from './playground/apolloUseLazyQuery/App';
import Urql from './playground/urql/App';
import ReactQuery from './playground/reactQuery/App';
import Swr from './playground/swr/App';
import ApolloReactQuery from './playground/apolloReactQuery/App';
import ReactQueryRacoon from './playground/reactQueryRacoon/App';

import {css} from './utils';
import {SERVER_URL} from './const';
import {RESET} from './queries';

function Content({active}: {active: number}) {
  active >= 0 && request(SERVER_URL, RESET);

  switch (active) {
    case 0:
      return <Apollo />;
    case 1:
      return <ApolloLatestLink />;
    case 2:
      return <ApolloCachePolicies />;
    case 3:
      return <Urql />;
    case 4:
      return <ReactQuery />;
    case 5:
      return <Swr />;
    case 6:
      return <ApolloReactQuery />;
    case 7:
      return <ApolloUseLazyQuery />;
    case 8:
      return <ReactQueryRacoon />;
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
          'Apollo',
          'Apollo w/ LatestLink',
          'Apollo w/ ApolloCachePolicies',
          'urql',
          'React Query',
          'SWR',
          'Apollo w/ React Query',
          'Apollo useLazyQuery',
          'React Query (Racoon)'
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
            <label className="label" onClick={() => {
              setActive(i);
              document.title = d;
              }}>{d}</label>
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
