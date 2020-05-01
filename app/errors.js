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
