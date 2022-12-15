import React from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {Number} from '../../__generated/graphql';

function First() {
  const client = useQueryClient();

  const {data} = useQuery(
    ['Number', {id: '0'}],
    // This is essentially a 'cache-only' strategy.
    () => client.getQueryData<Number>(['Number', {id: '0'}]) || null
  );

  if (data) {
    return <>first = {data.value}</>
  }

  return null;
};

export default First;
