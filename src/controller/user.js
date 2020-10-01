const ApiResult = require('../model/ApiResult');
const ApiError = require('../errors/ApiError');
const logger = require('../common/logger');
const User = require('../model/User');
const CsvWriter = require('../common/csv-write-stream');
const ObjectID = require('bson-objectid');

const getConnections = (req, res, next) => {
  
};

const checkEmail = (req, res, next) => {
  
};

const join = (req, res, next) => {
  
};

const me = (req, res, next) => {
  
};

const getUsers = (req, res, next) => {
  
};

const getUser = (req, res, next) => {
  
};

const updateUser = (req, res, next) => {
  
};

const deleteUser = (req, res, next) => {
  
};

const createUser = (req, res, next) => {
  
};

//헤더에 file 설정 후 파일스트림 열고 저장
const exportToCsv = (req, res, next) => {
  const csvWriter = new CsvWriter();
  res.setHeader('Content-type', 'text/csv');
  res.setHeader('Content-disposition', 'attachment; filename=user.csv');
  csvWriter.pipe(res);
  User.find().exec((error, users) => {
    users.forEach((v) => csvWriter.write(v));
    csvWriter.end();
  });
};

module.exports = {
  getConnections,
  checkEmail,
  join,
  me,
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
  exportToCsv,
};
