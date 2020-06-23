const cryptoRandomString = require('crypto-random-string');
const { Server } = require('../models');
const { info, error } = require('../logger');
const { databaseError, serverAlreadyRegistered } = require('../errors');

const getServerFromName = serverName => {
  info(`Getting server with with name: ${serverName} `);
  return Server.findOne({ where: { server: serverName } }).catch(dbError => {
    error(`Could not get server. Error: ${dbError}`);
    throw databaseError(`Could not get server. Error: ${dbError}`);
  });
};

exports.registerServer = body =>
  getServerFromName(body.server).then(server => {
    if (server) throw serverAlreadyRegistered('Server is already registered');
    const apiKey = cryptoRandomString({ length: 64, type: 'base64' });
    const serverData = { ...body, apiKey };
    return Server.create(serverData)
      .catch(dbError => {
        error(`Server could not be created. Error: ${dbError}`);
        throw databaseError(`Server could not be created. Error: ${dbError}`);
      })
      .then(() => apiKey);
  });
