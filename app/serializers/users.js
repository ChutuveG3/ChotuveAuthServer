const moment = require('moment');

exports.getCurrentUserSerializer = user => ({
  first_name: user.firstName,
  last_name: user.lastName,
  user_name: user.userName,
  email: user.email,
  birthdate: moment(user.birthdate).format('YYYY-MM-DD'),
  profile_img_url: user.profileImgUrl
});

exports.getUsersSerializer = users => ({ users: users.map(user => exports.getCurrentUserSerializer(user)) });
