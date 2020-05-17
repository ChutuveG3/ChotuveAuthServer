const jwt = require('jwt-simple');
const moment = require('moment');

exports.generateTokenFromEmail = ({ email }) => jwt.encode({ sub: email, iat: moment().unix() }, '123');
