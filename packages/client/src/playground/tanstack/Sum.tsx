import React from 'react';
import {useQuery} from '@tanstack/react-query'
import {gqlClient} from './client';
import {GET_SUM} from '../../gql';

function Sum() {
  const {data} = useQuery(
    ['numbers', {sum: 41}],
    () => gqlClient.request(GET_SUM
      )
  );

  return <>{data?.sum.value}</>;
};

export default Sum;
