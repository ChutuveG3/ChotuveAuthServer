exports.createUserMapper = body => ({
  firstName: body.first_name,
  lastName: body.last_name,
  email: body.email,
  password: body.password,
  userName: body.user_name,
  birthdate: body.birthdate
});

exports.updateUserMapper = body => ({
  firstName: body.first_name,
  lastName: body.last_name,
  email: body.email,
  password: body.password,
  birthdate: body.birthdate,
  profileImgUrl: body.profile_img_url
});
