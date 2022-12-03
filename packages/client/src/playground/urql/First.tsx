import React from 'react';
import {useQuery} from 'urql';
import {GET_NUMBER} from '../../queries';

function First() {
  const [{data}] = useQuery({
    query: GET_NUMBER,
    variables: {
      id: '0'
    },
    requestPolicy: 'cache-first',
  });

  if (data?.number) {
    return <>first = {data.number.value}</>
  }

  return null;
};

export default First;
