import React, {useEffect, useState, FC} from 'react'
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {gqlClient} from './client';
import css from '../utils/css';

const SAVE_NUMBERS = `#graphql
  mutation SaveNumbers($input: String!) {
    saveNumbers(input: $input) {
      __typename
      id
      value
    }
  }
`;

interface Props {
  onFocus: () => void;
  onUpdate: () => void;
}

const Numbers: FC<Props> = ({onFocus, onUpdate}) => {
  const [input, setInput] = useState('');
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    setHasChanged(true);
  }, [input]);

  const client = useQueryClient();

  const {data, mutate: saveNumbers} = useMutation({
    mutationFn: (variables: {input: string}) =>
      gqlClient.request(SAVE_NUMBERS, variables),
    // Can do optimistic updates here.
    onMutate: () => setHasChanged(false),
    onSuccess: (data, _variables) => {
      // Invalidate root level queries, like "GetSum".
      client.invalidateQueries({queryKey: ['numbers']});
      // Store each result; updates "GetFirst".
      for (const number of data.saveNumbers) {
        client.setQueryData(['number', {id: number.id}], {number});
      }
      onUpdate();
    }
  });

  const error = data && !data.saveNumbers.length;

  return (
    <input
      type="text"
      className={css('input', error && 'status-error')}
      value={input}
      onChange={({currentTarget}) => {
        setInput(currentTarget.value);
      }}
      onFocus={onFocus}
      onBlur={() => hasChanged && saveNumbers({input})}
    />
  );
};

export default Numbers;
