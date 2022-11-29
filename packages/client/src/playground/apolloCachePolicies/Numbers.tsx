import React, {useEffect, useState, FC} from 'react'
import {useMutation} from '@apollo/client';
import css from '../../utils/css';
import {SAVE_NUMBERS} from '../../queries';

interface Props {
  onFocus: () => void;
  onUpdate: () => void;
}

const Numbers: FC<Props> = ({onFocus, onUpdate}) => {
  const [input, setInput] = useState('');

  const [saveNumbers, {data}] = useMutation(SAVE_NUMBERS, {
    variables: {
      input
    },
    // NOTE to show this doesn't work if the query isn't watched.
    refetchQueries: ['GetSum'],
  });

  useEffect(() => {
    if (data) {
      onUpdate();
    }
  }, [data]);

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
