'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.changeColumn('users', 'password', { type: Sequelize.STRING }),
  down: (queryInterface, Sequelize) =>
    queryInterface.changeColumn('users', 'password', { type: Sequelize.STRING, allowNull: false })
};
