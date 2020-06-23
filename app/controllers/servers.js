const { info } = require('../logger');
const { registerServer } = require('../services/servers');
const { registerServerSerializer } = require('../serializers/servers');

exports.registerServer = ({ body }, res, next) => {
  info(`Registering server ${body.server}`);
  return registerServer(body)
    .then(apiKey => res.status(201).send(registerServerSerializer(apiKey)))
    .catch(next);
};
