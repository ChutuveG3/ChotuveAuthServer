const cryptoRandomString = require('crypto-random-string');
const { Server } = require('../models');
const { info, error } = require('../logger');
const { databaseError, serverAlreadyRegistered, serverNotExists } = require('../errors');
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

exports.getServers = () =>
  Server.findAll({ attributes: ['name', 'created_at', 'api_key'], limit: 50 }).catch(dbError => {
    error(`Could not get servers. Error: ${dbError}`);
    throw databaseError(`Could not get servers. Error: ${dbError}`);
  });

exports.deleteServer = serverName =>
  getServerFromName(serverName).then(server => {
    if (!server) throw serverNotExists(`Server with name ${serverName} does not exist`);
    return server.destroy();
  });
