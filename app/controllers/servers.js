const { info } = require('../logger');
const { registerServer, getServers, deleteServer } = require('../services/servers');
const { registerServerSerializer } = require('../serializers/servers');
const { registerServerMapper } = require('../mappers/servers');

exports.registerServer = ({ body }, res, next) => {
  info(`Registering server ${body.server}`);
  return registerServer(registerServerMapper(body))
    .then(apiKey => res.status(201).send(registerServerSerializer(apiKey)))
    .catch(next);
};

exports.getServers = (req, res, next) => {
  info('Getting servers');
  return getServers()
    .then(servers => res.status(200).send({ servers }))
    .catch(next);
};

exports.deleteServer = ({ params: { name } }, res, next) => {
  info(`Deleting server with name: ${name}`);
  return deleteServer(name)
    .then(() => res.status(200).end())
    .catch(next);
};
