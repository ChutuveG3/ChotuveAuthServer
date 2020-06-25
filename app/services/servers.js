const cryptoRandomString = require('crypto-random-string');
const { Server } = require('../models');
const { info, error } = require('../logger');
const { databaseError, serverAlreadyRegistered } = require('../errors');

const getServerFromName = serverName => {
  info(`Getting server with with name: ${serverName} `);
  return Server.findOne({ where: { name: serverName } }).catch(dbError => {
    error(`Could not get server. Error: ${dbError}`);
    throw databaseError(`Could not get server. Error: ${dbError}`);
  });
};

exports.registerServer = serverData =>
  getServerFromName(serverData.name).then(server => {
    if (server) throw serverAlreadyRegistered('Server is already registered');
    const apiKey = cryptoRandomString({ length: 64, type: 'base64' });
    return Server.create({ ...serverData, apiKey })
      .then(() => apiKey)
      .catch(dbError => {
        error(`Server could not be created. Error: ${dbError}`);
        throw databaseError(`Server could not be created. Error: ${dbError}`);
      });
  });
