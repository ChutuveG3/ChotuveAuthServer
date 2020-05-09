const { hash } = require('bcrypt');
const { externalError } = require('../errors');

const saltRounds = 10;

exports.encryptPassword = password =>
  hash(password, saltRounds).catch(error => {
    throw externalError(`Could not encrypt password. Details: ${error}`);
  });
