const cryptoRandomString = require('crypto-random-string');
const { Server } = require('../models');
const { info, error } = require('../logger');
const { databaseError, serverAlreadyRegistered } = require('../errors');
const { API_KEY_LENGTH, API_KEY_TYPE } = require('../utils/servers');

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
    const apiKey = cryptoRandomString({ length: API_KEY_LENGTH, type: API_KEY_TYPE });
    return Server.create({ ...serverData, apiKey })
      .then(() => apiKey)
      .catch(dbError => {
        error(`Server could not be created. Error: ${dbError}`);
        throw databaseError(`Server could not be created. Error: ${dbError}`);
      });
  });
