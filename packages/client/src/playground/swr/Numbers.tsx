import React, {useState, useEffect, FC} from 'react'
import {useSWRConfig} from 'swr';
import {gqlClient} from './client';
import {css, useMutation} from '../../utils';
import {SAVE_NUMBERS} from '../../queries';

interface Props {
  onFocus: () => void;
  onUpdate: () => void;
}

const useInvalidate = () => {
  const {cache, mutate} = useSWRConfig();
  return () => {
    const mutations = [];
    for (const [query] of cache as Map<string, unknown>) {
      // Yes, official docs suggests using a regex.
      if (query.match(/GetSum|GetNumber/)) {
        mutations.push(query);
      }
    }

    return Promise.all(mutations.map(key => mutate(key)));
  }
};

const Numbers: FC<Props> = ({onFocus, onUpdate}) => {
  const [input, setInput] = useState('');

  const [saveNumbers, {data}] = useMutation(() =>
    gqlClient.request(SAVE_NUMBERS, {input})
  , [input]);

  const invalidate = useInvalidate();

  useEffect(() => {
    if (data) {
      invalidate();
      onUpdate();
    }
  }, [data])

  const error = data && !data.saveNumbers.numbers.length;

  return (
    <input
      type="text"
      className={css('input', error && 'status-error')}
      value={input}
      onChange={({currentTarget}) => {
        setInput(currentTarget.value);
      }}
      onFocus={onFocus}
      onBlur={() => saveNumbers()}
    />
  );
};

export default Numbers;
