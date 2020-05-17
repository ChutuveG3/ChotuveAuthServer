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
