const { gql } = require('apollo-server-core');

const typeDefs = gql`
  type Computer {
    _id: ID!
    modelName: String
    price: Int
    cpu: String
    memory: String
    ssd: String
    imageUrl: String
    assembledAt: String
    maker: Manufacturer
    createdAt: String
    updatedAt: String
  }

  input ComputerInput {
    modelName: String
    price: Int
    cpu: String
    memory: String
    ssd: String
    imageUrl: String
    assembledAt: String
    maker: String
  }
`;

module.exports = typeDefs;
