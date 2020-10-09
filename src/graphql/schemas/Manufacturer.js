const { gql } = require('apollo-server-core');

const typeDefs = gql`
  type Manufacturer {
    _id: ID!
    name: String
    founder: String
    employeeCount: Int
    symbolImageUrl: String
    establishedAt: String
    createdAt: String
    updatedAt: String
  }

  input ManufacturerInput {
    name: String
    founder: String
    employeeCount: Int
    symbolImageUrl: String
    establishedAt: String
  }
`;

module.exports = typeDefs;
