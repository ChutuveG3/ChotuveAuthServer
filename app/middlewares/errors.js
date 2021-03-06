const errors = require('../errors');
const logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.DATABASE_ERROR]: 503,
  [errors.DEFAULT_ERROR]: 500,
  [errors.INVALID_PARAMS]: 400,
  [errors.USER_EMAIL_ALREADY_EXISTS]: 400,
  [errors.USER_NAME_ALREADY_EXISTS]: 400,
  [errors.ADMIN_EMAIL_ALREADY_EXISTS]: 400,
  [errors.EXTERNAL_ERROR]: 500,
  [errors.USER_NOT_EXISTS]: 409,
  [errors.PASSWORD_MISMATCH]: 409,
  [errors.ADMIN_NOT_EXISTS]: 409,
  [errors.INVALID_TOKEN_ERROR]: 401,
  [errors.UNAUTHORIZED]: 403,
  [errors.USER_MISMATCH_ERROR]: 400,
  [errors.SERVER_ALREADY_REGISTERED]: 409,
  [errors.INVALID_API_KEY_ERROR]: 401,
  [errors.INVALID_RECOVERY_TOKEN]: 409,
  [errors.INVALID_EMAIL_ERROR]: 409
};

exports.handle = (error, req, res, next) => {
  if (error.internalCode) res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
