import React, {useEffect, useState, FC} from 'react'
import {useMutation} from './client';
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

  const {data, mutate: saveNumbers} = useMutation(['sum'], SAVE_NUMBERS);

  useEffect(() => {
    if (data) {
      onUpdate();
    }
  }, [data]);

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
      onBlur={() => saveNumbers({input} as any)}
    />
  );
};

export default Numbers;
