const { decodeToken } = require('../services/jwt');

exports.validateTokenAndLoadEmail = (req, res, next) => {
  try {
    const tokenInfo = decodeToken(req.headers.authorization);
    req.email = tokenInfo.sub;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.validateToken = token => decodeToken(token);

exports.authorizationSchema = {
  authorization: {
    in: ['headers'],
    isString: true,
    errorMessage: 'authorization should be a string and be present in headers'
  }
};
