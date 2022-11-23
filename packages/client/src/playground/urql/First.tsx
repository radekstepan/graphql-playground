import {useQuery} from 'urql';
import {GET_NUMBER} from '../../gql';

function First() {
  const [{data}] = useQuery({
    query: GET_NUMBER,
    variables: {
      id: "0"
    },
    requestPolicy: 'cache-first',
  });

  console.log(data?.number?.value);

  return null;
};

export default First;
