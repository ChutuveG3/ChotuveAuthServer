const { decodeToken } = require('../services/jwt');
const { invalidTokenError } = require('../errors');

exports.validateTokenAndLoadEmail = (req, res, next) => {
  try {
    const tokenInfo = decodeToken(req.headers.authorization);
    req.email = tokenInfo.sub;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.validateToken = token => {
  try {
    return decodeToken(token);
  } catch (error) {
    throw invalidTokenError(error);
  }
};

exports.authorizationSchema = {
  authorization: {
    in: ['headers'],
    isString: true,
    errorMessage: 'authorization should be a string and be present in headers'
  }
};
