import React from 'react';
import useSWR from 'swr';
import {gqlClient} from './client';
import {GET_SUM} from '../../queries';

function Sum() {
  const {data} = useSWR(
    'GetSum',
    () => gqlClient.request(GET_SUM)
  );

  return <>{data?.sum.value}</>;
};

export default Sum;
