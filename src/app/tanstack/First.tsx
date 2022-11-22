import {useQuery, useQueryClient} from '@tanstack/react-query'

function First() {
  const client = useQueryClient();

  useQuery(
    ['number', {id: '0'}],
    // This is essentially a 'cache-only' strategy.
    () => client.getQueryData(['number', {id: '0'}]) || null
  );

  return null;
};

export default First;
