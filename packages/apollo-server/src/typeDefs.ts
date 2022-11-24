const typeDefs = `#graphql
  type Number {
    id: String!
    value: Float!
  }

  type Query {
    sum: Number!
    number(id: String!): Number
  }

  type Mutation {
    saveNumbers(input: String!): [Number!]!
    reset: Boolean!
  }
`;

export default typeDefs;
