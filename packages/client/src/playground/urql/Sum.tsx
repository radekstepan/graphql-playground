import React from 'react';
import {useQuery} from 'urql';
import {GET_SUM} from '../../gql';

function Sum() {
  const [{data}] = useQuery({
    query: GET_SUM,
    requestPolicy: 'cache-first',
  });

  return <>{data?.sum.value}</>;
};

export default Sum;
