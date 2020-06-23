const { factory } = require('factory-girl');

const { factoryWithCustomizedValue } = require('./factory_by_models');

factoryWithCustomizedValue('Server', { deletedAt: null });

module.exports = {
  create: serverToCreate => factory.create('Server', serverToCreate)
};
