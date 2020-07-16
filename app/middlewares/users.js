const moment = require('moment');
const { getUserFromUsername, getUserFromEmail } = require('../services/users');
const { invalidParams, passwordMismatch, userMismatchError } = require('../errors');
const { checkPassword } = require('../services/bcrypt');
const { authorizationSchema } = require('./sessions');
const { apiKeySchema } = require('./servers');
const { authenticateFirebaseToken } = require('../services/authentication');

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
    optional: true,
    errorMessage: 'password should be a string'
  },
  firebase_token: {
    in: ['body'],
    isJWT: true,
    optional: true,
    errorMessage: 'firebase_token should be a jwt'
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
    optional: true,
    errorMessage: 'username should be a string'
  },
  password: {
    in: ['body'],
    isString: true,
    isLength: { errorMessage: 'Password should have at least 6 characters', options: { min: 6 } },
    optional: true,
    errorMessage: 'password should be a string'
  },
  firebase_token: {
    in: ['body'],
    isJWT: true,
    optional: true,
    errorMessage: 'firebase_token should be a jwt'
  }
};

exports.checkUser = ({ body }, res, next) => {
  if (body.special) {
    return authenticateFirebaseToken(body.firebase_token)
      .then(decodedToken => getUserFromEmail(decodedToken.email))
      .then(user => {
        body.username = user.user_name;
        return next();
      })
      .catch(next);
  }
  return getUserFromUsername(body.username)
    .then(user => checkPassword(body.password, user.password))
    .then(compareResult => {
      if (compareResult) return next();
      throw passwordMismatch('Password does not match with that username');
    })
    .catch(next);
};

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

exports.validateSignUpCredentials = ({ body }, res, next) => {
  if (!body.password === !body.firebase_token) {
    return next(invalidParams('Password or firebase token must be present'));
  }
  if (!body.password) body.special = true;
  return next();
};

exports.validateLoginCredentials = ({ body }, res, next) => {
  if (
    (body.username || body.password || !body.firebase_token) &&
    (!body.username || !body.password || body.firebase_token)
  ) {
    return next(invalidParams('Username and password, or firebase token must be present'));
  }
  if (!body.password) body.special = true;
  return next();
};
