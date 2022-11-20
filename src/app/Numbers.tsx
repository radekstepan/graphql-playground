import React, {useState} from 'react'
import {useMutation} from '@apollo/client';
import gql from 'graphql-tag';

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

  const [saveNumbers] = useMutation(SAVE_NUMBERS, {
    variables: {
      input
    }
  });

  return (
    <input
      type="text"
      value={input}
      onChange={({currentTarget}) => {
        setInput(currentTarget.value);
      }}
      onBlur={() => saveNumbers()}
    />
  );
};

export default Numbers;
