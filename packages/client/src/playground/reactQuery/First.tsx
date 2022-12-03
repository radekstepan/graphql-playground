import React from 'react';
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {GetNumberQuery} from '../../__generated/graphql';

function First() {
  const client = useQueryClient();

  const {data} = useQuery(
    ['number', {id: '0'}],
    // This is essentially a 'cache-only' strategy.
    () => client.getQueryData<GetNumberQuery>(['number', {id: '0'}]) || null
  );

  if (data?.number) {
    return <>first = {data.number.value}</>
  }

  return null;
};

export default First;
