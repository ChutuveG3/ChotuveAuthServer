const { passwordMissmatch } = require('../errors');
const { checkPassword } = require('../services/bcrypt');
const { getAdminFromEmail } = require('../services/admins');

exports.createAdminSchema = {
  first_name: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'firstName should be a string'
  },
  last_name: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'lastName should be a string'
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
  }
};

exports.createAdminSessionSchema = {
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
  }
};

exports.checkAdmin = ({ body }, res, next) =>
  getAdminFromEmail(body.email)
    .then(admin => checkPassword(body.password, admin.password))
    .then(compareResult => {
      if (compareResult) return next();
      throw passwordMissmatch('Password does not match with that email');
    })
    .catch(next);
