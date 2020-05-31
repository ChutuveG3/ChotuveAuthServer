const { decodeToken } = require('../services/jwt');
const { getUserFromEmail } = require('../services/users');
const { userAndTokenMismatchError } = require('../errors');

exports.validateTokenAndLoadEmail = (req, res, next) => {
  try {
    const tokenInfo = decodeToken(req.headers.authorization);
    req.email = tokenInfo.sub;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.validateUser = (req, res, next) => {
  const userName = req.params.username;
  const token_email = req.email;
  return getUserFromEmail(token_email)
    .then(user => {
      if (user.userName !== userName) throw userAndTokenMismatchError('Username and token info do not match');
      return next();
    })
    .catch(next);
};

exports.validateToken = (req, res, next) => {
  try {
    decodeToken(req.headers.authorization);
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
