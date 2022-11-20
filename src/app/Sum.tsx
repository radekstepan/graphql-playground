// import React, {useState} from 'react'
import {useQuery} from '@apollo/client';
import gql from 'graphql-tag';

const GET_SUM = gql`
  query GetSum {
    sum {
      __typename
      id
      value
    }
  }
`;

function Sum() {
  const {data} = useQuery(GET_SUM);

  return data?.sum.value;
};

export default Sum;
