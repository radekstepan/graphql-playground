import React from 'react';
import {useQuery} from '@apollo/client';
import {GET_NUMBER} from '../../queries';

function First() {
  const {data} = useQuery(GET_NUMBER, {
    variables: {
      id: '0'
    },
    // We could use 'network-only' but we'd have to re-render
    //  the component for this to take effect.
    fetchPolicy: 'cache-first'
  });

  if (data?.number) {
    return <>first = {data.number.value}</>
  }

  return null;
};

export default First;
