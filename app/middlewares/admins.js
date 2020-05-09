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
    optional: false,
    errorMessage: 'password should be a string'
  }
};