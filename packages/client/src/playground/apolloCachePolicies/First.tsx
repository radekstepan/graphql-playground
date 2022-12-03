import 'react';
import {useQuery} from '@apollo/client';
import {GET_NUMBER} from '../../queries';

function First() {
  const {data} = useQuery(GET_NUMBER, {
    variables: {
      id: '0'
    },
    fetchPolicy: 'cache-first'
  });

  if (data?.number) {
    return <>first = {data.number.value}</>
  }

  return null;
};

export default First;
