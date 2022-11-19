import 'react'
import {useQuery} from '@apollo/client';
import gql from 'graphql-tag';
// @ts-ignore
import GET_BOOKS from './GetBooks.gql';

function App() {
  const result = useQuery(gql(GET_BOOKS), {
    variables: {},
  });  

  return null;
};

export default App;
