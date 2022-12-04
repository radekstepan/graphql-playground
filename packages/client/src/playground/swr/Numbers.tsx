import React, {useState, FC} from 'react'
import {useSWRConfig} from 'swr';
import {gqlClient} from './client';
import css from '../../utils/css';
import {SAVE_NUMBERS} from '../../queries';
import {SaveNumbersMutation} from '../../__generated/graphql';

interface Props {
  onFocus: () => void;
  onUpdate: () => void;
}

const useInvalidate = () => {
  const {cache, mutate} = useSWRConfig();
  return () => {
    const mutations = [];
    // @ts-ignore
    for (const [query] of cache) {
      if (query.match(/GetSum|GetNumber/)) {
        mutations.push(query);
      }
    }

    return Promise.all(mutations.map(key => mutate(key)));
  }
};

const Numbers: FC<Props> = ({onFocus, onUpdate}) => {
  const [input, setInput] = useState('');
  const [data, setData] = useState<SaveNumbersMutation>();

  const invalidate = useInvalidate();

  const saveNumbers = async () => {
    const res = await gqlClient.request(SAVE_NUMBERS, {input});
    setData(res);
    invalidate();
    onUpdate();
  };

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
      onBlur={saveNumbers}
    />
  );
};

export default Numbers;
