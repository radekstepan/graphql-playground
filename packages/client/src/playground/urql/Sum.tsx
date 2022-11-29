import React from 'react';
import {useQuery} from 'urql';
import {GET_SUM} from '../../queries';

function Sum() {
  const [{data}] = useQuery({
    query: GET_SUM,
    requestPolicy: 'cache-first',
  });

  return <>{data?.sum.value}</>;
};

export default Sum;
