const { decodeToken } = require('../services/jwt');
const { unauthorized } = require('../errors');
const { apiKeySchema } = require('./servers');

exports.validateTokenAndLoadUsername = (req, res, next) => {
  try {
    const tokenInfo = decodeToken(req.headers.authorization);
    req.username = tokenInfo.sub;
  } catch (error) {
    return next(error);
  }
  return next();
};

exports.validateToken = (req, res, next) => {
  try {
    const tokenInfo = decodeToken(req.headers.authorization);
    req.privilege = tokenInfo.privilege;
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

exports.checkPrivileges = ({ privilege }, res, next) => {
  if (!privilege) return next(unauthorized('You do not have the privileges to perform this operation'));
  return next();
};

exports.createRecoveryTokenSchema = {
  ...apiKeySchema,
  email: {
    in: ['body'],
    isEmail: true,
    optional: false,
    errorMessage: 'email should be a valid email'
  }
};
