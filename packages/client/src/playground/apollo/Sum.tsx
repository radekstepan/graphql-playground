import React from 'react';
import {useQuery} from '@apollo/client';
import {GET_SUM} from '../../queries';

function Sum() {
  const {data} = useQuery(GET_SUM, {
    // Have to use 'network-only' to always
    //  show the latest value. Only works
    //  because the component unmounts.
    fetchPolicy: 'network-only'
  });

  return <>{data?.sum.value}</>;
};

export default Sum;
