import React, {useEffect, useState, FC} from 'react'
import {useMutation} from '@apollo/client';
import gql from 'graphql-tag';
import css from '../utils/css';

const SAVE_NUMBERS = gql`
  mutation SaveNumbers($input: String!) {
    saveNumbers(input: $input) {
      __typename
      id
      value
    }
  }
`;

interface Numbers {
  onUpdate: () => void;
}

const Numbers: FC<Numbers> = ({onUpdate}) => {
  const [input, setInput] = useState('');

  const [saveNumbers, {loading, data}] = useMutation(SAVE_NUMBERS, {
    variables: {
      input
    },
    context: {
      invalidate: ['sum']
    }
  });

  useEffect(() => {
    if (data) {
      onUpdate();
    }
  }, [data]);

  const error = !data?.saveNumbers.length;

  return (
    <input
      type="text"
      className={css('input', data && error && 'status-error')}
      value={input}
      onChange={({currentTarget}) => {
        setInput(currentTarget.value);
      }}
      onBlur={() => saveNumbers()}
    />
  );
};

export default Numbers;
