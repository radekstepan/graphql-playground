import {getIntrospectionQuery} from 'graphql';
import {request} from 'graphql-request';
import {
  getIntrospectedSchema,
  minifyIntrospectionQuery
} from '@urql/introspection';
import * as fs from 'fs';

request(
  'http://localhost:4000',
  getIntrospectionQuery({descriptions: false})
)
.then((data) => {
  const minified = minifyIntrospectionQuery(getIntrospectedSchema(data));

  fs.writeFile('./src/app/schema.json', JSON.stringify(minified), err => {
    if (err) {
      return console.error('Writing failed:', err);
    }
    console.log('Schema written!');
  });
});
