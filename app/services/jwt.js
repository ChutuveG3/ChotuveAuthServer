const jwt = require('jsonwebtoken');
const moment = require('moment');
const { invalidTokenError } = require('../errors');
const { secret } = require('../../config').common.session;

exports.generateTokenFromEmail = ({ email }) => jwt.sign({ sub: email, iat: moment().unix() }, secret);

exports.decodeToken = token =>
  jwt.verify(token, secret, (verifyError, decodedToken) => {
    if (verifyError) throw invalidTokenError(verifyError);
    return decodedToken;
  });
