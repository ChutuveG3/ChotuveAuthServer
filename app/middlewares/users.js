const moment = require('moment');
const { getUserFromUsername } = require('../services/users');
const { passwordMismatch, userMismatchError } = require('../errors');
const { checkPassword } = require('../services/bcrypt');
const { authorizationSchema } = require('./sessions');
const { apiKeySchema } = require('./servers');

exports.createUserSchema = {
  ...apiKeySchema,
  first_name: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'first_name should be a string'
  },
  last_name: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'last_name should be a string'
  },
  email: {
    in: ['body'],
    isEmail: true,
    optional: false,
    errorMessage: 'email should be a valid email'
  },
  password: {
    in: ['body'],
    isString: true,
    isLength: { errorMessage: 'Password should have at least 6 characters', options: { min: 6 } },
    optional: false,
    errorMessage: 'password should be a string'
  },
  user_name: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'userName should be a string'
  },
  birthdate: {
    in: ['body'],
    custom: {
      options: birthdate => moment(birthdate, 'YYYY-MM-DD', true).isValid() === true
    },
    optional: false,
    errorMessage: 'birthdate should be a valid date'
  }
};

exports.createUserSessionSchema = {
  ...apiKeySchema,
  username: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'username should be a string'
  },
  password: {
    in: ['body'],
    isString: true,
    isLength: { errorMessage: 'Password should have at least 6 characters', options: { min: 6 } },
    optional: false,
    errorMessage: 'password should be a string'
  }
};

exports.checkUser = ({ body }, res, next) =>
  getUserFromUsername(body.username)
    .then(user => checkPassword(body.password, user.password))
    .then(compareResult => {
      if (compareResult) return next();
      throw passwordMismatch('Password does not match with that username');
    })
    .catch(next);

exports.viewProfileSchema = {
  ...apiKeySchema,
  ...authorizationSchema,
  username: {
    in: ['params'],
    isString: true,
    optional: false,
    errorMessage: 'username should be a string'
  }
};

exports.updateProfileSchema = {
  ...apiKeySchema,
  ...authorizationSchema,
  first_name: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'first_name should be a string'
  },
  last_name: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'last_name should be a string'
  },
  email: {
    in: ['body'],
    isEmail: true,
    optional: false,
    errorMessage: 'email should be a valid email'
  },
  birthdate: {
    in: ['body'],
    custom: {
      options: birthdate => moment(birthdate, 'YYYY-MM-DD', true).isValid() === true
    },
    optional: false,
    errorMessage: 'birthdate should be a valid date'
  },
  profile_img_url: {
    in: ['body'],
    isString: true,
    optional: true,
    isURL: true,
    errorMessage: 'profile_image_url should be a string'
  }
};

exports.validateUser = ({ username, params: { username: pathUsername } }, res, next) => {
  if (username !== pathUsername) return next(userMismatchError('Token user does not match route user'));
  return next();
};
