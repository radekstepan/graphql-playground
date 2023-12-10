import React, { useCallback, useEffect, useState } from 'react'
import {ApolloProvider, useApolloClient, useLazyQuery, useMutation} from '@apollo/client';
import client from './client';
import {GET_NUMBER, SAVE_NUMBERS} from '../../queries';

const fetchPolicy = 'network-only';

function App() {
  const client = useApolloClient();
  const [output, setOutput] = useState<string[]>([]);

  const [saveNumbers] = useMutation(SAVE_NUMBERS, {
    variables: {
      input: '0,1,2'
    },
  });

  const [getNumber] = useLazyQuery(GET_NUMBER, {
    fetchPolicy,
    // NOTE: does not trigger in 3.7.1
    onCompleted(res) {
      setOutput(output => [...output, 'onCompleted: ' + JSON.stringify(res.number)]);
    }
  });

  useEffect(() => {
    saveNumbers();
  }, []);

  const onLazyQuery = useCallback(async () => {
    for (let i = 0; i < 3; i++) {
      const id = `${i}`;
      // await new Promise(resolve => setTimeout(resolve, 100));
      setOutput(output => [...output, `useLazyQuery(${id})`]);
      // NOTE: returns a Promise in 3.7.1
      let res: any = null;
      res = getNumber({variables: {id}});
      if (res && res.then) {
        res.then((res: any) => {
          if (res.data) {
            setOutput(output => [...output, 'Promise: ' + JSON.stringify(res.data!.number)]);
          }
        });
      }
    }
  }, []);

  const onClientQuery = useCallback(async () => {
    for (let i = 0; i < 3; i++) {
      const id = `${i}`;
      setOutput(output => [...output, `client.query(${id})`]);
      const res = await client.query({
        query: GET_NUMBER,
        variables: {id},
        fetchPolicy
      });
      setOutput(output => [...output, 'Promise: ' + JSON.stringify(res.data.number)]);
    }
  }, []);

  return (
    <>
      <input
        type="button"
        value="useLazyQuery"
        onClick={onLazyQuery}
      />
      <input
        type="button"
        value="client.query"
        onClick={onClientQuery}
      />
      <code className="output">
        {output.map((o, i) => (
          <div key={i}>{o}</div>
        ))}
      </code>
    </>
  );
};

function Wrapper() {
  return (
    <ApolloProvider client={client()}>
      <App />
    </ApolloProvider>  
  );
}

export default Wrapper;
