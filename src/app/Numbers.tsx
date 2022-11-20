import React, {useState} from 'react'
import {useMutation} from '@apollo/client';
import gql from 'graphql-tag';

const css = (classes: unknown[]) => classes.filter(Boolean).join(' ');

const SAVE_NUMBERS = gql`
  mutation SaveNumbers($input: String!) {
    saveNumbers(input: $input) {
      __typename
      id
      value
    }
  }
`;

function Numbers() {
  const [input, setInput] = useState('');

  const [saveNumbers, {data}] = useMutation(SAVE_NUMBERS, {
    variables: {
      input
    }
  });

  const error = !data?.saveNumbers.length;

  return (
    <input
      type="text"
      className={css(['input', data && error && 'status-error'])}
      value={input}
      onChange={({currentTarget}) => {
        setInput(currentTarget.value);
      }}
      onBlur={() => saveNumbers()}
    />
  );
};

export default Numbers;
