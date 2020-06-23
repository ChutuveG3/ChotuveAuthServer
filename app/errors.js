const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.INVALID_PARAMS = 'invalid_params';
exports.invalidParams = message => internalError(message, exports.INVALID_PARAMS);

exports.USER_NAME_ALREADY_EXISTS = 'user_name_already_exists';
exports.userNameAlreadyExists = message => internalError(message, exports.USER_NAME_ALREADY_EXISTS);

exports.USER_EMAIL_ALREADY_EXISTS = 'user_email_already_exists';
exports.userEmailAlreadyExists = message => internalError(message, exports.USER_EMAIL_ALREADY_EXISTS);

exports.ADMIN_EMAIL_ALREADY_EXISTS = 'admin_email_already_exists';
exports.adminEmailAlreadyExists = message => internalError(message, exports.ADMIN_EMAIL_ALREADY_EXISTS);

exports.EXTERNAL_ERROR = 'external_error';
exports.externalError = message => internalError(message, exports.EXTERNAL_ERROR);

exports.JWT_ERROR = 'jwt_error';
exports.jwtError = message => internalError(message, exports.JWT_ERROR);

exports.USER_NOT_EXISTS = 'user_not_exists';
exports.userNotExists = message => internalError(message, exports.USER_NOT_EXISTS);

exports.PASSWORD_MISMATCH = 'password_mismatch';
exports.passwordMismatch = message => internalError(message, exports.PASSWORD_MISMATCH);

exports.ADMIN_NOT_EXISTS = 'admin_not_exists';
exports.adminNotExists = message => internalError(message, exports.ADMIN_NOT_EXISTS);

exports.INVALID_TOKEN_ERROR = 'invalid_token_error';
exports.invalidTokenError = message => internalError(message, exports.INVALID_TOKEN_ERROR);

exports.UNAUTHORIZED = 'unauthorized';
exports.unauthorized = message => internalError(message, exports.UNAUTHORIZED);

exports.USER_MISMATCH_ERROR = 'user_mismatch_error';
exports.userMismatchError = message => internalError(message, exports.USER_MISMATCH_ERROR);

exports.SERVER_ALREADY_REGISTERED = 'server_already_registered';
exports.serverAlreadyRegistered = message => internalError(message, exports.SERVER_ALREADY_REGISTERED);
