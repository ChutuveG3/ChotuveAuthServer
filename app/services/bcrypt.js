const { hash, compare } = require('bcrypt');
const { externalError } = require('../errors');

const saltRounds = 10;

exports.encryptPassword = password =>
  hash(password, saltRounds).catch(error => {
    throw externalError(`Could not encrypt password. Details: ${error}`);
  });

exports.checkPassword = (password, dbPassword) =>
  compare(password, dbPassword).catch(error => {
    throw externalError(`Could not compare passwords. Details: ${error}`);
  });
