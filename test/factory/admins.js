const { factory } = require('factory-girl');

const { factoryWithCustomizedValue } = require('./factory_by_models');

factoryWithCustomizedValue('Admin', { deletedAt: null });

module.exports = {
  create: adminToCreate => factory.create('Admin', adminToCreate)
};
