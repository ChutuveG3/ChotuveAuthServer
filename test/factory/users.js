const { factory } = require('factory-girl');

const { factoryWithCustomizedValue } = require('./factory_by_models');

factoryWithCustomizedValue('User', { deletedAt: null });

module.exports = {
  create: userToCreate => factory.create('User', userToCreate)
};
