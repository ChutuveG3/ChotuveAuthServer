const { decodeToken } = require('../services/jwt');
const { userAndTokenMismatchError } = require('../errors');

exports.validateTokenAndLoadUsername = (req, res, next) => {
  try {
    const tokenInfo = decodeToken(req.headers.authorization);
    req.username = tokenInfo.sub;
  } catch (error) {
    return next(error);
  }
  return next();
};

exports.validateUser = (req, res, next) => {
  const userName = req.params.username;
  const token_username = req.username;
  if (userName !== token_username) next(userAndTokenMismatchError('Username and token info do not match'));
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
