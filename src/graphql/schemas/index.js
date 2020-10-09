const { makeExecutableSchema, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

const Manufacturer = require('./Manufacturer');
const Computer = require('./Computer');

const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function() {
  return this.toString();
}

const manufacturers = [
  {
    _id: '5f4f87674a142e94ca3a853f',
    name: 'Apple',
    founder: 'Steven Paul Jobs',
    employeeCount: 137000,
    symbolImageUrl: 'https://as-images.apple.com/is/og-default?wid=1200&hei=630&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1525370171638',
    establishedAt: '1976-04-01',
  },
  {
    _id: '5f5321712b30596a0a674fcf',
    name: 'Microsoft',
    founder: 'William Henry Bill Gates',
    employeeCount: 156439,
    symbolImageUrl: 'https://blog.kakaocdn.net/dn/bbaUVL/btqCVE01iMs/GaoXsQWvPcLNEmT6A50qO0/img.jpg',
    establishedAt: '1975-04-04',
  },
];

const computers = [
  {
    _id: '6f4f87674a142e94ca3a853f',
    modelName: 'Macbook pro 15',
    price: 3200,
    cpu: 'awesome cpu',
    memory: 'awesome memory',
    ssd: 'awesome ssd',
    imageUrl: 'https://d3nevzfk7ii3be.cloudfront.net/igi/n4ActWgGSZaFgHio.large',
    assembledAt: '2020-02-19',
    maker: {
      _id: '5f4f87674a142e94ca3a853f',
      name: 'Apple',
      founder: 'Steven Paul Jobs',
      employeeCount: 137000,
      symbolImageUrl: 'https://as-images.apple.com/is/og-default?wid=1200&hei=630&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1525370171638',
      establishedAt: '1976-04-01',
    },
  },
  {
    _id: '6f4f87674a142e94ca3a853a',
    modelName: 'Macbook pro 13',
    price: 2400,
    cpu: 'good cpu',
    memory: 'good memory',
    ssd: 'good ssd',
    imageUrl: 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/macbook-pro-13-og-202005?wid=1200&hei=630&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1587344054526',
    assembledAt: '2020-03-19',
    maker: {
      _id: '5f4f87674a142e94ca3a853f',
      name: 'Apple',
      founder: 'Steven Paul Jobs',
      employeeCount: 137000,
      symbolImageUrl: 'https://as-images.apple.com/is/og-default?wid=1200&hei=630&fmt=jpeg&qlt=95&op_usm=0.5,0.5&.v=1525370171638',
      establishedAt: '1976-04-01',
    },
  },
  {
    _id: '6f4f87674a142e94ca3a853b',
    modelName: 'Surface Pro 6',
    price: 2500,
    cpu: 'awesome cpu',
    memory: 'awesome memory',
    ssd: 'awesome ssd',
    imageUrl: 'https://i.insider.com/5bb7bb6693032c64621b9c47?width=1100&format=jpeg&auto=webp',
    assembledAt: '2019-07-20',
    maker: {
      _id: '5f5321712b30596a0a674fcf',
      name: 'Microsoft',
      founder: 'William Henry Bill Gates',
      employeeCount: 156439,
      symbolImageUrl: 'https://blog.kakaocdn.net/dn/bbaUVL/btqCVE01iMs/GaoXsQWvPcLNEmT6A50qO0/img.jpg',
      establishedAt: '1975-04-04',
    },
  },
  {
    _id: '6f4f87674a142e94ca3a853c',
    modelName: 'Surface Laptop 3',
    price: 2100,
    cpu: 'good cpu',
    memory: 'good memory',
    ssd: 'good ssd',
    imageUrl: 'https://cnet3.cbsistatic.com/img/hC-WzO08VQwHyUKP9rJiI4QcqWo=/420x236/2019/11/04/c1f95af0-2ef3-41ca-b5bb-9143fce906b8/surface-laptop-3-8.jpg',
    assembledAt: '2019-04-03',
    maker: {
      _id: '5f5321712b30596a0a674fcf',
      name: 'Microsoft',
      founder: 'William Henry Bill Gates',
      employeeCount: 156439,
      symbolImageUrl: 'https://blog.kakaocdn.net/dn/bbaUVL/btqCVE01iMs/GaoXsQWvPcLNEmT6A50qO0/img.jpg',
      establishedAt: '1975-04-04',
    },
  },
];

const rootQuery = gql`
  type Query {
    manufacturer(id: String!): Manufacturer
    manufacturers: [Manufacturer]!
    computer(id: String!): Computer
    computers: [Computer]!
  }

  type Mutation {
    createManufacturer(manufacturerInput: ManufacturerInput!): Manufacturer!
    createComputer(computerInput: ComputerInput!): Computer!
  }
`

const rootResolver = {
  Query: {
    manufacturer: (_parent, { id }) => {      
      return manufacturers.find((manufacturer) => manufacturer._id === id);
    },
    manufacturers: (_parent, _args) => {
      return manufacturers;
    },
    computer: (_parent, { id }) => {      
      return computers.find((computer) => computer._id === id);
    },
    computers: (_parent, _args) => {
      return computers;
    },
  },
  Mutation: {
    createManufacturer: (_parent, { manufacturerInput }) => {
      manufacturers.push(manufacturerInput);
      return manufacturerInput;
    },
    createComputer: (_parent, { computerInput }) => {
      computers.push(computerInput);
      return computerInput;
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs: [
    rootQuery,
    Manufacturer,
    Computer,
  ],
  resolvers: rootResolver,
});

module.exports = schema;
