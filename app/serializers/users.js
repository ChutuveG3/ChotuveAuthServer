const moment = require('moment');

exports.getCurrentUserSerializer = user => ({
  first_name: user.firstName,
  last_name: user.lastName,
  user_name: user.userName,
  email: user.email,
  birthdate: moment(user.birthdate).format('YYYY-MM-DD')
});
