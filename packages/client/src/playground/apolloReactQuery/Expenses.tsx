import React from 'react';
import {
  useQuery as useReactQuery,
  useQueryClient
} from '@tanstack/react-query'
import {useQuery as useApolloQuery} from '@apollo/client';
import {GET_EXPENSES} from '../../queries';
import {GetExpensesQuery} from '../../__generated/graphql';

function Expenses() {
  const client = useQueryClient();

  // Populate the cache with Apollo.
  const {data} = useApolloQuery(GET_EXPENSES);

  // Read it with RQ from cache.
  const cacheKey = ['Employee', {id: 'EMP_1'}];
  const {data: rqData} = useReactQuery(
    cacheKey,
    () => client.getQueryData<GetExpensesQuery>(cacheKey) || null,
    {
      enabled: !!data
    }
  );

  console.log(JSON.stringify(rqData, null, 2));

  return null;
};

export default Expenses;
