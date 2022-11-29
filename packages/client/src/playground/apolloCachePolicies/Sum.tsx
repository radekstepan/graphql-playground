import React from 'react';
import {useQuery} from '@apollo/client';
import {GET_SUM} from '../../queries';

function Sum() {
  const {data} = useQuery(GET_SUM, {
    fetchPolicy: 'cache-first'
  });

  return <>{data?.sum.value}</>;
};

export default Sum;
