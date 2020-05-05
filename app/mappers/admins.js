exports.createAdminMapper = body => ({
  email: body.email,
  password: body.password,
  userName: body.user_name
});
