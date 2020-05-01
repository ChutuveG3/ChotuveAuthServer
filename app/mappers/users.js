exports.createUserMapper = body => ({
  firstName: body.first_name,
  lastName: body.last_name,
  email: body.email,
  password: body.password,
  userName: body.user_name,
  birthdate: body.birthdate
});
