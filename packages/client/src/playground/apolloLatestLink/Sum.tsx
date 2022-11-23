import React from 'react';
import useLatestQuery from './useLatestQuery';
import {GET_SUM} from '../../gql';

function Sum() {
  const {data} = useLatestQuery(GET_SUM, {
    fetchPolicy: 'cache-first',
    context: {
      invalidate: ['@sum']
    }
  });

  return <>{data?.sum.value}</>;
};

export default Sum;
