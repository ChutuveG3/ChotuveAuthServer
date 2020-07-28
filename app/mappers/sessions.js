exports.modifyPasswordMapper = body => ({
  password: body.password,
  recoveryToken: body.recovery_token
});
