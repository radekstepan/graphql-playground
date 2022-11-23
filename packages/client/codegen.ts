import {CodegenConfig} from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: 'http://localhost:4000',
  documents: ['src/gql.ts'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    'src/__generated/': {
      preset: 'client',
      plugins: []
    },
    'src/__generated/schema.json': {
      plugins: ['introspection'],
      config: {
        descriptions: false,
        minify: true
      }
    }
  }
}
 
export default config