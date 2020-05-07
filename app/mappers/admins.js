exports.createAdminMapper = body => ({
  firstName: body.first_name,
  lastName: body.last_name,
  email: body.email,
  password: body.password
});
