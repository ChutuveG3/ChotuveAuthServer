const jwt = require('jsonwebtoken');
const moment = require('moment');
const { invalidTokenError } = require('../errors');
const { secret } = require('../../config').common.session;

exports.generateTokenFromUsername = ({ username }) =>
  jwt.sign({ sub: username, iat: moment().unix() }, secret, { expiresIn: '1h' });

exports.decodeToken = token =>
  jwt.verify(token, secret, (verifyError, decodedToken) => {
    if (verifyError) throw invalidTokenError(verifyError);
    return decodedToken;
  });
