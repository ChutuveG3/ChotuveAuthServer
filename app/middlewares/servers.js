const { authorizationSchema } = require('./sessions');

exports.registerServerSchema = {
  ...authorizationSchema,
  server: {
    in: ['body'],
    isString: true,
    optional: false,
    errorMessage: 'server should be a string'
  }
};
