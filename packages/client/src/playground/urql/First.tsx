import {useQuery} from 'urql';
import {GET_FIRST} from '../../gql';

function First() {
  const [{data}] = useQuery({
    query: GET_FIRST,
    requestPolicy: 'cache-first',
  });

  console.log(data?.number?.value);

  return null;
};

export default First;
