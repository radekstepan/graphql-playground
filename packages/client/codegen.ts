import {CodegenConfig} from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: 'http://localhost:4000',
  documents: ['src/gql.ts'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/__generated/': {
      preset: 'client',
      plugins: []
    }
  }
}
 
export default config