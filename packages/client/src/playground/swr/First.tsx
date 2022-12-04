import React from 'react';
import useSWR from 'swr';
import {gqlClient} from './client';
import {GET_NUMBER} from '../../queries';

function First() {
  // NOTE: makes a network request unless we explicitly
  //  store each number in the cache.
  const {data} = useSWR(
    ['GetNumber', {id: '0'}],
    () => gqlClient.request(GET_NUMBER, {id: '0'})
  );

  if (data?.number) {
    return <>first = {data.number.value}</>
  }

  return null;
};

export default First;
