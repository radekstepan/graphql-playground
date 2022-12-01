import React from 'react';
import {useQuery} from '@apollo/client';
import {GET_SUM} from '../../queries';

function Sum() {
  const {data} = useQuery(GET_SUM, {
    // Would have to use 'network-only' to always
    //  show the latest value.
    fetchPolicy: 'cache-first'
  });

  return <>{data?.sum.value}</>;
};

export default Sum;
