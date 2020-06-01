const { decodeToken } = require('../services/jwt');

exports.validateTokenAndLoadUsername = (req, res, next) => {
  try {
    const tokenInfo = decodeToken(req.headers.authorization);
    req.username = tokenInfo.sub;
  } catch (error) {
    return next(error);
  }
  return next();
};

exports.validateToken = ({ headers: { authorization: token } }, res, next) => {
  try {
    decodeToken(token);
  } catch (err) {
    return next(err);
  }
  return next();
};

exports.authorizationSchema = {
  authorization: {
    in: ['headers'],
    isString: true,
    errorMessage: 'authorization should be a string and be present in headers'
  }
};
