const { Server } = require('../models');
const { info, error } = require('../logger');
const { databaseError, invalidApiKeyError } = require('../errors');
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

exports.apiKeySchema = {
  x_api_key: {
    in: ['headers'],
    isString: true,
    optional: false,
    errorMessage: 'api key should be a string and be present in headers'
  }
};

exports.validateApiKey = ({ headers: { x_api_key: apiKey } }, res, next) => {
  info('Validating Api Key');
  return Server.findOne({ where: { apiKey } })
    .catch(dbError => {
      error(`Could not get server. Error: ${dbError}`);
      throw databaseError(`Could not get server. Error: ${dbError}`);
    })
    .then(server => {
      if (!server) throw invalidApiKeyError('Invalid Api Key');
      return next();
    })
    .catch(next);
};

exports.getServersSchema = {
  ...authorizationSchema
};