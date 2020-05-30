const { info } = require('../logger');
const { decodeToken } = require('../services/jwt');

exports.validateToken = (req, res, next) => {
  info('Validating token');
  try {
    decodeToken(req.headers.authorization);
  } catch (err) {
    return next(err);
  }
  return res.status(200).end();
};
