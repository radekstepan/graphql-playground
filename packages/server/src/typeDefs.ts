const typeDefs = `#graphql
  type Number {
    id: String!
    value: Float!
  }

  type SaveNumbersResponse {
    numbers: [Number!]!
  }

  type Query {
    sum: Number!
    number(id: String!): Number
  }

  type Mutation {
    saveNumbers(input: String!): SaveNumbersResponse
    reset: Boolean!
  }
`;

export default typeDefs;
